import { useGanaderia } from '../context/GanaderiaContext';
import { puede, type AccionType, getDescripcionPermiso, ROLES_SISTEMA } from '../constants/permisos';
import { useAuth } from '../../modules/auth/AuthContext';

export const usePermisosFinca = () => {
    const { permiso, esPropietario, ganaderia } = useGanaderia();
    const { perfil } = useAuth();

    /**
     * Verifica si el usuario puede realizar una acción en la finca activa
     */
    const can = (accion: AccionType): boolean => {
        // 1. SUPERADMIN: Acceso total siempre
        if (perfil?.rol_sistema === ROLES_SISTEMA.SUPERADMIN) return true;

        // 2. SOPORTE: Solo lectura
        if (perfil?.rol_sistema === ROLES_SISTEMA.SOPORTE) {
            return accion === 'leer';
        }

        // 3. Dueño de finca: Acceso total en SU finca
        if (esPropietario) return true;

        // 4. Usuario normal: RBAC por ganadería
        return puede(permiso, accion);
    };

    const getSystemRoleDescription = () => {
        if (perfil?.rol_sistema === ROLES_SISTEMA.SUPERADMIN) return 'Super Administrador (Acceso Total)';
        if (perfil?.rol_sistema === ROLES_SISTEMA.SOPORTE) return 'Soporte (Solo Lectura)';
        return null;
    };

    return {
        permisoActual: permiso,
        esDueno: esPropietario,
        can,
        descripcionPermiso: getSystemRoleDescription() || getDescripcionPermiso(permiso),
        nombreFinca: ganaderia?.nombre || 'Sin finca',
        rolDetalle: ganaderia?.rol_detalle,
        rolSistema: perfil?.rol_sistema
    };
};
