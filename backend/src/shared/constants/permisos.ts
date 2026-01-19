/**
 * Constantes de permisos del sistema (Jerárquicos)
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

/**
 * Jerarquía de permisos: ELIMINAR (4) > EDITAR (3) > CREAR (2) > LECTURA (1)
 */
export const PERMISO_LEVELS: Record<PermisoType, number> = {
    [PERMISOS.LECTURA]: 1,
    [PERMISOS.CREAR]: 2,
    [PERMISOS.EDITAR]: 3,
    [PERMISOS.ELIMINAR]: 4
};

/**
 * Helper para obtener el nivel numérico de un permiso
 */
export const nivelPermiso = (permiso: string): number => {
    return PERMISO_LEVELS[permiso as PermisoType] || 0;
};
