import { Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';
import { VacaUseCase } from '../application/vaca.usecase';

export class VacaController {
    constructor(private vacaUseCase: VacaUseCase) { }

    create = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            console.log(`[VACA] Creating vaca`);
            const vaca = await this.vacaUseCase.createVaca(req.body);
            console.log(`[VACA] Vaca created successfully: ${vaca.vaca_id}`);
            return res.status(201).json(vaca);
        } catch (error: any) {
            console.error(`[VACA_ERROR] Failed to create vaca: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    list = async (req: AuthRequest, res: Response) => {
        try {
            const { ganaderia_id } = req.query;
            if (!ganaderia_id) {
                console.warn('[VACA_WARN] List request missing ganaderia_id');
                return res.status(400).json({ error: 'ganaderia_id is required' });
            }
            console.log(`[VACA] Listing vacas for ganaderia: ${ganaderia_id}`);
            const vacas = await this.vacaUseCase.listVacas(ganaderia_id as string);
            console.log(`[VACA] Found ${vacas.length} vacas`);
            return res.json(vacas);
        } catch (error: any) {
            console.error(`[VACA_ERROR] Failed to list vacas: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    update = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            console.log(`[VACA] Updating vaca: ${id}`);
            const updated = await this.vacaUseCase.updateVaca(id as string, req.body);
            console.log(`[VACA] Vaca updated successfully: ${id}`);
            return res.json(updated);
        } catch (error: any) {
            console.error(`[VACA_ERROR] Failed to update vaca ${req.params.id}: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            console.log(`[VACA] Deleting vaca: ${id}`);
            await this.vacaUseCase.deleteVaca(id as string);
            console.log(`[VACA] Vaca deleted successfully: ${id}`);
            return res.status(204).send();
        } catch (error: any) {
            console.error(`[VACA_ERROR] Failed to delete vaca ${req.params.id}: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };
}
