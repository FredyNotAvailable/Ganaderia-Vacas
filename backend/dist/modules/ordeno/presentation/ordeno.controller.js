"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenoController = void 0;
class OrdenoController {
    constructor(ordenoUseCase) {
        this.ordenoUseCase = ordenoUseCase;
        this.create = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[ORDENO] Creating ordeno`);
                const ordeno = await this.ordenoUseCase.createOrdeno(req.body);
                console.log(`[ORDENO] Ordeno created successfully: ${ordeno.ordeno_id}`);
                return res.status(201).json(ordeno);
            }
            catch (error) {
                console.error(`[ORDENO_ERROR] Failed to create ordeno: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.list = async (req, res) => {
            try {
                const { ganaderia_id } = req.query;
                if (!ganaderia_id) {
                    console.warn('[ORDENO_WARN] List request missing ganaderia_id');
                    return res.status(400).json({ error: 'ganaderia_id is required' });
                }
                console.log(`[ORDENO] Listing ordenos for ganaderia: ${ganaderia_id}`);
                const ordenos = await this.ordenoUseCase.listOrdenos(ganaderia_id);
                console.log(`[ORDENO] Found ${ordenos.length} ordenos`);
                return res.json(ordenos);
            }
            catch (error) {
                console.error(`[ORDENO_ERROR] Failed to list ordenos: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                console.log(`[ORDENO] Updating ordeno: ${id}`);
                const updated = await this.ordenoUseCase.updateOrdeno(id, req.body);
                console.log(`[ORDENO] Ordeno updated successfully: ${id}`);
                return res.json(updated);
            }
            catch (error) {
                console.error(`[ORDENO_ERROR] Failed to update ordeno ${req.params.id}: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                console.log(`[ORDENO] Deleting ordeno: ${id}`);
                await this.ordenoUseCase.deleteOrdeno(id);
                console.log(`[ORDENO] Ordeno deleted successfully: ${id}`);
                return res.status(204).send();
            }
            catch (error) {
                console.error(`[ORDENO_ERROR] Failed to delete ordeno ${req.params.id}: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.OrdenoController = OrdenoController;
