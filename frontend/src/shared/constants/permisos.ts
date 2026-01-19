/**
 * Constantes de permisos del frontend (alineadas con backend)
 */
export const PERMISOS = {
    LECTURA: 'LECTURA',
    CREAR: 'CREAR',
    EDITAR: 'EDITAR',
    ELIMINAR: 'ELIMINAR'
} as const;

export const ROLES_SISTEMA = {
    SUPERADMIN: 'SUPERADMIN',
    SOPORTE: 'SOPORTE',
    USUARIO: 'USUARIO'
} as const;

export type RolSistemaType = keyof typeof ROLES_SISTEMA;

export type PermisoType = keyof typeof PERMISOS;

export type AccionType = 'leer' | 'crear' | 'editar' | 'eliminar';

/**
 * Jerarquía de permisos: ELIMINAR (4) > EDITAR (3) > CREAR (2) > LECTURA (1)
 */
export const PERMISO_LEVELS: Record<PermisoType, number> = {
    [PERMISOS.LECTURA]: 1,
    [PERMISOS.CREAR]: 2,
    [PERMISOS.EDITAR]: 3,
    [PERMISOS.ELIMINAR]: 4
};

const ACCION_REQUIRED_LEVEL: Record<AccionType, number> = {
    'leer': 1,
    'crear': 2,
    'editar': 3,
    'eliminar': 4,
};

/**
 * Helper para obtener el nivel numérico de un permiso
 */
export const nivelPermiso = (permiso: string): number => {
    return PERMISO_LEVELS[permiso as PermisoType] || 0;
};

/**
 * Determina si un nivel de permiso actual permite realizar una acción
 */
export const puede = (permisoActual: PermisoType | string | null | undefined, accion: AccionType): boolean => {
    if (!permisoActual) return false;
    const userLevel = nivelPermiso(permisoActual as string);
    const requiredLevel = ACCION_REQUIRED_LEVEL[accion];
    return userLevel >= requiredLevel;
};

export const getDescripcionPermiso = (permiso: string | null | undefined): string => {
    switch (permiso) {
        case PERMISOS.LECTURA: return 'Solo lectura';
        case PERMISOS.CREAR: return 'Crear y ver';
        case PERMISOS.EDITAR: return 'Editar, crear y ver';
        case PERMISOS.ELIMINAR: return 'Control total';
        default: return 'Sin acceso';
    }
};
