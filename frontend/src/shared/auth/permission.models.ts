export const PERMISOS = {
    LECTURA: 'LECTURA',
    CREAR: 'CREAR',
    EDITAR: 'EDITAR',
    ELIMINAR: 'ELIMINAR',
} as const;

export type PermisoType = typeof PERMISOS[keyof typeof PERMISOS];

export type AccionType = 'leer' | 'crear' | 'editar' | 'eliminar';

const PERMISO_LEVELS: Record<PermisoType, number> = {
    [PERMISOS.LECTURA]: 1,
    [PERMISOS.CREAR]: 2,
    [PERMISOS.EDITAR]: 3,
    [PERMISOS.ELIMINAR]: 4,
};

const ACCION_REQUIRED_LEVEL: Record<AccionType, number> = {
    'leer': 1,
    'crear': 2,
    'editar': 3,
    'eliminar': 4,
};

/**
 * Determina si un nivel de permiso actual permite realizar una acción
 */
export const puede = (permisoActual: PermisoType | string | null | undefined, accion: AccionType): boolean => {
    if (!permisoActual) return false;

    const userLevel = PERMISO_LEVELS[permisoActual as PermisoType] || 0;
    const requiredLevel = ACCION_REQUIRED_LEVEL[accion];

    return userLevel >= requiredLevel;
};

export const getDescripcionPermiso = (permiso: string | null | undefined): string => {
    switch (permiso) {
        case PERMISOS.LECTURA: return 'Solo puedes ver la información.';
        case PERMISOS.CREAR: return 'Puedes ver y registrar nuevos datos.';
        case PERMISOS.EDITAR: return 'Puedes ver, registrar y modificar datos existentes.';
        case PERMISOS.ELIMINAR: return 'Tienes control total sobre la información.';
        default: return 'No tienes permisos asignados.';
    }
};
