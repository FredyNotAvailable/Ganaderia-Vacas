import { Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';
import { AdminUseCase } from '../application/admin.usecase';

export class AdminController {
    constructor(private adminUseCase: AdminUseCase) { }

    getUsers = async (_req: AuthRequest, res: Response) => {
        try {
            const users = await this.adminUseCase.getUsers();
            return res.json(users);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    getGanaderias = async (_req: AuthRequest, res: Response) => {
        try {
            const ganaderias = await this.adminUseCase.getGanaderias();
            return res.json(ganaderias);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    getRoles = async (_req: AuthRequest, res: Response) => {
        try {
            const roles = await this.adminUseCase.getRoles();
            return res.json(roles);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    assignAccess = async (req: AuthRequest, res: Response) => {
        try {
            const { userId, ganaderiaId, rolId } = req.body;
            if (!userId || !ganaderiaId || !rolId) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }
            await this.adminUseCase.assignAccess(userId as string, ganaderiaId as string, rolId as string);
            return res.json({ message: 'Acceso asignado correctamente' });
        } catch (error: any) {
            console.error('[AdminController.assignAccess] Error:', error);
            return res.status(500).json({ error: error.message, details: error });
        }
    };

    removeAccess = async (req: AuthRequest, res: Response) => {
        try {
            const { userId, ganaderiaId } = req.params;
            if (!userId || !ganaderiaId) {
                return res.status(400).json({ error: 'Faltan parámetros' });
            }
            await this.adminUseCase.removeAccess(userId as string, ganaderiaId as string);
            return res.json({ message: 'Acceso eliminado correctamente' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    updateUserRole = async (req: AuthRequest, res: Response) => {
        try {
            const { userId } = req.params;
            const { rolSistema } = req.body;
            if (!userId || !rolSistema) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }
            await this.adminUseCase.updateUserRole(userId as string, rolSistema);
            return res.json({ message: 'Rol de sistema actualizado correctamente' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
}
