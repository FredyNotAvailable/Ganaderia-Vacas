"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanaderiaController = void 0;
class GanaderiaController {
    constructor(ganaderiaUseCase) {
        this.ganaderiaUseCase = ganaderiaUseCase;
        this.createGanaderia = async (req, res) => {
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
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to create ganaderia: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.getGanaderia = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[GANADERIA] Getting ganaderias for user: ${userId}`);
                const ganaderias = await this.ganaderiaUseCase.getGanaderias(userId);
                console.log(`[GANADERIA] Found ${ganaderias.length} ganaderias for user: ${userId}`);
                return res.json(ganaderias);
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to get ganaderias: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.updateGanaderia = async (req, res) => {
            try {
                const id = req.params.id;
                console.log(`[GANADERIA] Updating ganaderia ID: ${id}`);
                const updated = await this.ganaderiaUseCase.updateGanaderia(id, req.body);
                return res.json(updated);
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to update ganaderia: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.deleteGanaderia = async (req, res) => {
            try {
                const id = req.params.id;
                console.log(`[GANADERIA] Deleting ganaderia ID: ${id}`);
                await this.ganaderiaUseCase.deleteGanaderia(id);
                console.log(`[GANADERIA] Ganaderia deleted successfully`);
                return res.status(204).send();
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to delete ganaderia: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.GanaderiaController = GanaderiaController;
