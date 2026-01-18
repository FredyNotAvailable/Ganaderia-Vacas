import { Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';
import { GanaderiaUseCase } from '../application/ganaderia.usecase';

export class GanaderiaController {
    constructor(private ganaderiaUseCase: GanaderiaUseCase) { }

    createGanaderia = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            console.log(`[GANADERIA] Creating ganaderia for user (owner): ${userId}`);

            const ganaderiaData = {
                ...req.body,
                propietario_user_id: userId // STRICTLY ENFORCE OWNER
            };

            const created = await this.ganaderiaUseCase.createGanaderia(ganaderiaData);
            console.log(`[GANADERIA] Ganaderia created: ${created.ganaderia_id}`);
            return res.status(201).json(created);
        } catch (error: any) {
            console.error(`[GANADERIA_ERROR] Failed to create ganaderia: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    getGanaderia = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            console.log(`[GANADERIA] Getting ganaderias for user: ${userId}`);
            const ganaderias = await this.ganaderiaUseCase.getGanaderias(userId);

            console.log(`[GANADERIA] Found ${ganaderias.length} ganaderias for user: ${userId}`);
            return res.json(ganaderias);
        } catch (error: any) {
            console.error(`[GANADERIA_ERROR] Failed to get ganaderias: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    updateGanaderia = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.params.id as string;
            console.log(`[GANADERIA] Updating ganaderia ID: ${id}`);
            const updated = await this.ganaderiaUseCase.updateGanaderia(id, req.body);
            return res.json(updated);
        } catch (error: any) {
            console.error(`[GANADERIA_ERROR] Failed to update ganaderia: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    deleteGanaderia = async (req: AuthRequest, res: Response) => {
        try {
            const id = req.params.id as string;
            console.log(`[GANADERIA] Deleting ganaderia ID: ${id}`);
            await this.ganaderiaUseCase.deleteGanaderia(id);
            console.log(`[GANADERIA] Ganaderia deleted successfully`);
            return res.status(204).send();
        } catch (error: any) {
            console.error(`[GANADERIA_ERROR] Failed to delete ganaderia: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };
}
