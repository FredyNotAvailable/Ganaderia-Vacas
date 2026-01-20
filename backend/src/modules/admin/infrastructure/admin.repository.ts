import { supabase } from '../../../shared/supabase/supabase.client';

export interface AdminRepository {
    getAllUsers(): Promise<any[]>;
    getAllGanaderias(): Promise<any[]>;
    getAllRoles(): Promise<any[]>;
    assignAccess(userId: string, ganaderiaId: string, rolId: string): Promise<void>;
    removeAccess(userId: string, ganaderiaId: string): Promise<void>;
    updateUserRole(userId: string, rolSistema: string): Promise<void>;
}

export class SupabaseAdminRepository implements AdminRepository {
    async getAllUsers(): Promise<any[]> {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw new Error(error.message);

        // Fetch current accesses for each user
        const { data: accesses, error: accError } = await supabase
            .from('ganaderia_usuario')
            .select(`
                user_id,
                rol_id,
                ganaderias (nombre, ganaderia_id),
                roles (nombre, codigo)
            `)
            .eq('is_active', true);

        if (accError) throw new Error(accError.message);

        // Fetch all ganaderias to find owners
        const { data: allGanaderias, error: gError } = await supabase
            .from('ganaderias')
            .select('ganaderia_id, nombre, propietario_user_id');

        if (gError) throw new Error(gError.message);

        return (data || []).map(user => {
            const userSharedAccesses = (accesses || []).filter(a => a.user_id === user.user_id);
            const userOwnedFarms = (allGanaderias || [])
                .filter(g => g.propietario_user_id === user.user_id)
                .map(g => ({
                    user_id: user.user_id,
                    ganaderias: { ganaderia_id: g.ganaderia_id, nombre: g.nombre },
                    roles: { nombre: 'Dueño', codigo: 'DUEÑO' },
                    is_owner: true
                }));

            return {
                ...user,
                accesses: [...userOwnedFarms, ...userSharedAccesses]
            };
        });
    }

    async getAllGanaderias(): Promise<any[]> {
        const { data, error } = await supabase
            .from('ganaderias')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async getAllRoles(): Promise<any[]> {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async assignAccess(userId: string, ganaderiaId: string, rolId: string): Promise<void> {
        // Use maybeSingle to avoid PGRST116 error if not found
        const { data: existing, error: selectError } = await supabase
            .from('ganaderia_usuario')
            .select('*')
            .eq('user_id', userId)
            .eq('ganaderia_id', ganaderiaId)
            .maybeSingle();

        if (selectError) throw new Error(selectError.message);

        if (existing) {
            const { error } = await supabase
                .from('ganaderia_usuario')
                .update({
                    rol_id: rolId,
                    is_active: true
                })
                .eq('user_id', userId)
                .eq('ganaderia_id', ganaderiaId);

            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from('ganaderia_usuario')
                .insert({
                    user_id: userId,
                    ganaderia_id: ganaderiaId,
                    rol_id: rolId,
                    is_active: true
                });

            if (error) throw new Error(error.message);
        }
    }

    async removeAccess(userId: string, ganaderiaId: string): Promise<void> {
        const { error } = await supabase
            .from('ganaderia_usuario')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('ganaderia_id', ganaderiaId);

        if (error) throw new Error(error.message);
    }

    async updateUserRole(userId: string, rolSistema: string): Promise<void> {
        const { error } = await supabase
            .from('perfiles')
            .update({ rol_sistema: rolSistema, updated_at: new Date().toISOString() })
            .eq('user_id', userId);

        if (error) throw new Error(error.message);
    }
}
