import { Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';
import { OrdenoUseCase } from '../application/ordeno.usecase';

export class OrdenoController {
    constructor(private ordenoUseCase: OrdenoUseCase) { }

    create = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            console.log(`[ORDENO] Creating ordeno`);
            const ordeno = await this.ordenoUseCase.createOrdeno(req.body);
            console.log(`[ORDENO] Ordeno created successfully: ${ordeno.ordeno_id}`);
            return res.status(201).json(ordeno);
        } catch (error: any) {
            console.error(`[ORDENO_ERROR] Failed to create ordeno: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    list = async (req: AuthRequest, res: Response) => {
        try {
            const { ganaderia_id } = req.query;
            if (!ganaderia_id) {
                console.warn('[ORDENO_WARN] List request missing ganaderia_id');
                return res.status(400).json({ error: 'ganaderia_id is required' });
            }
            console.log(`[ORDENO] Listing ordenos for ganaderia: ${ganaderia_id}`);
            const ordenos = await this.ordenoUseCase.listOrdenos(ganaderia_id as string);
            console.log(`[ORDENO] Found ${ordenos.length} ordenos`);
            return res.json(ordenos);
        } catch (error: any) {
            console.error(`[ORDENO_ERROR] Failed to list ordenos: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    update = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            console.log(`[ORDENO] Updating ordeno: ${id}`);
            const updated = await this.ordenoUseCase.updateOrdeno(id as string, req.body);
            console.log(`[ORDENO] Ordeno updated successfully: ${id}`);
            return res.json(updated);
        } catch (error: any) {
            console.error(`[ORDENO_ERROR] Failed to update ordeno ${req.params.id}: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            console.log(`[ORDENO] Deleting ordeno: ${id}`);
            await this.ordenoUseCase.deleteOrdeno(id as string);
            console.log(`[ORDENO] Ordeno deleted successfully: ${id}`);
            return res.status(204).send();
        } catch (error: any) {
            console.error(`[ORDENO_ERROR] Failed to delete ordeno ${req.params.id}: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };
}
