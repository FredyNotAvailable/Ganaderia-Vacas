import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { PermissionService } from '../auth/permission.service';
import { PermisoType } from '../constants/permisos';
import { supabase } from '../supabase/supabase.client';

/**
 * Middleware para autorizar acciones basadas en permisos por ganadería
 * @param permisoRequerido Nivel mínimo de permiso necesario
 */
export const authorize = (permisoRequerido: PermisoType) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            // Intentar obtener ganaderia_id de query, body o params
            let ganaderiaId = (req.query.ganaderia_id as string) || (req.body.ganaderia_id as string) || (req.params.ganaderia_id as string);

            // Si no está presente, pero tenemos un ID en params, intentamos deducirlo (opcional/simple)
            if (!ganaderiaId && req.params.id) {
                const path = req.baseUrl; // e.g., /api/vacas
                const table = path.includes('vacas') ? 'vacas' : (path.includes('ordenos') ? 'ordenos' : null);

                if (table) {
                    const { data } = await supabase
                        .from(table)
                        .select('ganaderia_id')
                        .eq(`${table.slice(0, -1)}_id`, req.params.id)
                        .single();

                    if (data) ganaderiaId = data.ganaderia_id;
                }
            }

            if (!ganaderiaId) {
                console.warn(`[AUTHORIZE_WARN] Request missing ganaderia_id for path: ${req.originalUrl}`);
                return res.status(400).json({ error: 'Se requiere ganaderia_id para validar permisos' });
            }

            const hasPerm = await PermissionService.hasPermission(userId, ganaderiaId, permisoRequerido);

            if (!hasPerm) {
                console.warn(`[AUTHORIZE_DENIED] User ${userId} denied ${permisoRequerido} on ganaderia ${ganaderiaId}`);
                return res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción' });
            }

            // Guardar ganaderiaId en el request por si el controlador lo necesita
            (req as any).ganaderiaId = ganaderiaId;

            next();
        } catch (error: any) {
            console.error(`[AUTHORIZE_ERROR] ${error.message}`);
            return res.status(500).json({ error: 'Error interno al validar permisos' });
        }
    };
};
