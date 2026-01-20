import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { supabase } from '../supabase/supabase.client';

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: profile, error } = await supabase
            .from('perfiles')
            .select('rol_sistema')
            .eq('user_id', req.user.id)
            .single();

        if (error || !profile) {
            console.warn(`[ADMIN_WARN] Profile not found for user: ${req.user.id}`);
            return res.status(403).json({ error: 'Forbidden: Profile not found' });
        }

        if (profile.rol_sistema !== 'SUPERADMIN') {
            console.warn(`[ADMIN_WARN] User ${req.user.id} is not a SUPERADMIN. Role: ${profile.rol_sistema}`);
            return res.status(403).json({ error: 'Forbidden: Superadmin access required' });
        }

        next();
    } catch (err: any) {
        console.error(`[ADMIN_ERROR] Unexpected admin verification error: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
