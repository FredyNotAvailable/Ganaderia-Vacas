import { supabase } from '../../../shared/supabase/supabase.client';
import { IGanaderiaRepository, Ganaderia } from '../domain/ganaderia.entity';
import { nivelPermiso, PERMISOS } from '../../../shared/constants/permisos';

export class SupabaseGanaderiaRepository implements IGanaderiaRepository {
    private readonly table = 'ganaderias';

    async getByUserId(userId: string): Promise<Ganaderia[]> {
        // 0. Check for SUPERADMIN
        const { data: profile } = await supabase
            .from('perfiles')
            .select('rol_sistema')
            .eq('user_id', userId)
            .single();

        if (profile?.rol_sistema === 'SUPERADMIN') {
            const { data: allGanaderias, error: allError } = await supabase
                .from(this.table)
                .select('*');

            if (allError) throw new Error(allError.message);

            return (allGanaderias || []).map(g => ({
                ...g,
                rol: 'DUEÑO', // Treat as owner for UI compatibility
                permiso: PERMISOS.ELIMINAR,
                rol_detalle: { nombre: 'Super Admin', codigo: 'SUPERADMIN' }
            }));
        }

        // 1. Fetch owned ganaderias
        const { data: owned, error: ownedError } = await supabase
            .from(this.table)
            .select('*')
            .eq('propietario_user_id', userId);

        if (ownedError) throw new Error(ownedError.message);

        // 2. Fetch shared ganaderias via ganaderia_usuario
        const { data: shared, error: sharedError } = await supabase
            .from('ganaderia_usuario')
            .select(`
                rol_id,
                ganaderias (*),
                roles (
                    nombre,
                    codigo,
                    rol_permiso (
                        permisos (
                            codigo
                        )
                    )
                )
            `)
            .eq('user_id', userId)
            .eq('is_active', true);

        if (sharedError) {
            console.error(`[GANADERIA_REPO] Error fetching shared: ${sharedError.message}`);
        }

        // Normalize results
        const ownedNormalized = (owned || []).map(g => ({
            ...g,
            rol: 'DUEÑO',
            permiso: PERMISOS.ELIMINAR, // Owner has full permissions
            rol_detalle: { nombre: 'Propietario', codigo: 'DUEÑO' }
        }));

        const sharedNormalized = (shared || [])
            .filter(s => s.ganaderias) // Ensure joined data exists
            .map(s => {
                const ganaderia = s.ganaderias as any;
                const rol = s.roles as any;

                // Calculate max permission
                let maxLevel = 0;
                let maxPermisoCodigo = '';

                if (rol && rol.rol_permiso) {
                    rol.rol_permiso.forEach((rp: any) => {
                        const codigo = rp.permisos?.codigo;
                        if (codigo) {
                            const level = nivelPermiso(codigo);
                            if (level > maxLevel) {
                                maxLevel = level;
                                maxPermisoCodigo = codigo;
                            }
                        }
                    });
                }

                return {
                    ...ganaderia,
                    rol: 'COMPARTIDA',
                    permiso: maxPermisoCodigo || PERMISOS.LECTURA, // Fallback safe
                    rol_detalle: rol ? {
                        id: s.rol_id,
                        nombre: rol.nombre,
                        codigo: rol.codigo
                    } : undefined
                };
            });

        // Merge and remove duplicates
        const all = [...ownedNormalized];
        sharedNormalized.forEach(s => {
            if (!all.find(a => a.ganaderia_id === s.ganaderia_id)) {
                all.push(s);
            }
        });

        return all;
    }

    async create(data: Partial<Ganaderia>): Promise<Ganaderia> {
        const { data: newGanaderia, error } = await supabase
            .from(this.table)
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newGanaderia;
    }

    async update(ganaderiaId: string, data: Partial<Ganaderia>): Promise<Ganaderia> {
        const { data: updated, error } = await supabase
            .from(this.table)
            .update(data)
            .eq('ganaderia_id', ganaderiaId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updated;
    }

    async delete(ganaderiaId: string): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('ganaderia_id', ganaderiaId);

        if (error) throw new Error(error.message);
    }
}
