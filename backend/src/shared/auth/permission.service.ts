import { supabase } from '../supabase/supabase.client';
import { PERMISOS, PermisoType, nivelPermiso } from '../constants/permisos';

export class PermissionService {
    /**
     * Valida si un usuario tiene el permiso requerido para una ganadería
     * El dueño siempre tiene permisos completos (ELIMINAR)
     */
    static async hasPermission(
        userId: string,
        ganaderiaId: string,
        permisoRequerido: PermisoType
    ): Promise<boolean> {
        try {
            // 0. Obtener rol de sistema del usuario
            const { data: perfil, error: uProfileError } = await supabase
                .from('perfiles')
                .select('rol_sistema')
                .eq('user_id', userId)
                .single();

            if (uProfileError || !perfil) {
                console.error(`[PERMISSION_SERVICE] Error fetching user profile: ${uProfileError?.message}`);
                return false;
            }

            // Lógica de SUPERADMIN: Acceso total
            if (perfil.rol_sistema === 'SUPERADMIN') {
                return true;
            }

            // Lógica de SOPORTE: Solo LECTURA, bloqueo de escritura
            if (perfil.rol_sistema === 'SOPORTE') {
                if (permisoRequerido === PERMISOS.LECTURA) return true;
                return false; // Bloquear cualquier otra acción
            }

            // Si es USUARIO, continuamos con la lógica normal...

            // 1. Verificar si es el dueño de la ganadería
            const { data: ganaderia, error: gError } = await supabase
                .from('ganaderias')
                .select('propietario_user_id')
                .eq('ganaderia_id', ganaderiaId)
                .single();

            if (gError || !ganaderia) {
                console.error(`[PERMISSION_SERVICE] Error checking owner: ${gError?.message}`);
                return false;
            }

            if (ganaderia.propietario_user_id === userId) {
                return true; // El dueño tiene acceso total
            }

            // 2. Obtener el rol asignado al usuario en esta ganadería específica
            const { data: usuarioRole, error: uError } = await supabase
                .from('ganaderia_usuario')
                .select('rol_id, is_active')
                .eq('ganaderia_id', ganaderiaId)
                .eq('user_id', userId)
                .eq('is_active', true)
                .maybeSingle();

            if (uError || !usuarioRole || !usuarioRole.rol_id) {
                // No tiene rol asignado o no está activo en esta ganadería
                return false;
            }

            // 3. Obtener los permisos del rol Y validar que el rol pertenezca a la ganadería (Join explícito)
            const { data: permisosData, error: pError } = await supabase
                .from('rol_permiso')
                .select(`
                    permisos (
                        codigo
                    ),
                    roles!inner (
                        ganaderia_id
                    )
                `)
                .eq('rol_id', usuarioRole.rol_id)
                .eq('roles.ganaderia_id', ganaderiaId); // Validación CRÍTICA de Multi-Tenant

            if (pError || !permisosData) {
                console.error(`[PERMISSION_SERVICE] Error fetching permissions (or role mismatch) for role ${usuarioRole.rol_id}: ${pError?.message}`);
                return false;
            }

            // 4. Calcular el nivel máximo de permiso que tiene el usuario
            let maxLevel = 0;

            permisosData.forEach((item: any) => {
                const codigo = item.permisos?.codigo;
                if (codigo) {
                    const level = nivelPermiso(codigo);
                    if (level > maxLevel) maxLevel = level;
                }
            });

            const targetLevel = nivelPermiso(permisoRequerido);

            return maxLevel >= targetLevel;

        } catch (error: any) {
            console.error(`[PERMISSION_SERVICE_ERROR] check failed: ${error.message}`);
            return false;
        }
    }
}
