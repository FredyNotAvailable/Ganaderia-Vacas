"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacaController = void 0;
class VacaController {
    constructor(vacaUseCase) {
        this.vacaUseCase = vacaUseCase;
        this.create = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[VACA] Creating vaca`);
                const vaca = await this.vacaUseCase.createVaca(req.body);
                console.log(`[VACA] Vaca created successfully: ${vaca.vaca_id}`);
                return res.status(201).json(vaca);
            }
            catch (error) {
                console.error(`[VACA_ERROR] Failed to create vaca: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.list = async (req, res) => {
            try {
                const { ganaderia_id } = req.query;
                if (!ganaderia_id) {
                    console.warn('[VACA_WARN] List request missing ganaderia_id');
                    return res.status(400).json({ error: 'ganaderia_id is required' });
                }
                console.log(`[VACA] Listing vacas for ganaderia: ${ganaderia_id}`);
                const vacas = await this.vacaUseCase.listVacas(ganaderia_id);
                console.log(`[VACA] Found ${vacas.length} vacas`);
                return res.json(vacas);
            }
            catch (error) {
                console.error(`[VACA_ERROR] Failed to list vacas: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                console.log(`[VACA] Updating vaca: ${id}`);
                const updated = await this.vacaUseCase.updateVaca(id, req.body);
                console.log(`[VACA] Vaca updated successfully: ${id}`);
                return res.json(updated);
            }
            catch (error) {
                console.error(`[VACA_ERROR] Failed to update vaca ${req.params.id}: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                console.log(`[VACA] Deleting vaca: ${id}`);
                await this.vacaUseCase.deleteVaca(id);
                console.log(`[VACA] Vaca deleted successfully: ${id}`);
                return res.status(204).send();
            }
            catch (error) {
                console.error(`[VACA_ERROR] Failed to delete vaca ${req.params.id}: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.VacaController = VacaController;
