"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nivelPermiso = exports.PERMISO_LEVELS = exports.ROLES_SISTEMA = exports.PERMISOS = void 0;
/**
 * Constantes de permisos del sistema (Jerárquicos)
 */
exports.PERMISOS = {
    LECTURA: 'LECTURA',
    CREAR: 'CREAR',
    EDITAR: 'EDITAR',
    ELIMINAR: 'ELIMINAR'
};
exports.ROLES_SISTEMA = {
    SUPERADMIN: 'SUPERADMIN',
    SOPORTE: 'SOPORTE',
    USUARIO: 'USUARIO'
};
/**
 * Jerarquía de permisos: ELIMINAR (4) > EDITAR (3) > CREAR (2) > LECTURA (1)
 */
exports.PERMISO_LEVELS = {
    [exports.PERMISOS.LECTURA]: 1,
    [exports.PERMISOS.CREAR]: 2,
    [exports.PERMISOS.EDITAR]: 3,
    [exports.PERMISOS.ELIMINAR]: 4
};
/**
 * Helper para obtener el nivel numérico de un permiso
 */
const nivelPermiso = (permiso) => {
    return exports.PERMISO_LEVELS[permiso] || 0;
};
exports.nivelPermiso = nivelPermiso;
