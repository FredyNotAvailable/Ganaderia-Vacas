"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanaderiaController = void 0;
class GanaderiaController {
    constructor(ganaderiaUseCase) {
        this.ganaderiaUseCase = ganaderiaUseCase;
        this.getGanaderia = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[GANADERIA] Getting ganaderia for user: ${userId}`);
                const ganaderia = await this.ganaderiaUseCase.getGanaderia(userId);
                if (!ganaderia) {
                    console.warn(`[GANADERIA_WARN] Ganaderia not found for user: ${userId}`);
                    return res.status(404).json({ error: 'Ganaderia not found' });
                }
                console.log(`[GANADERIA] Ganaderia found: ${ganaderia.ganaderia_id}`);
                return res.json(ganaderia);
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to get ganaderia: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.updateGanaderia = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[GANADERIA] Updating ganaderia for user: ${userId}`);
                const updated = await this.ganaderiaUseCase.updateGanaderia(userId, req.body);
                console.log(`[GANADERIA] Ganaderia updated successfully`);
                return res.json(updated);
            }
            catch (error) {
                console.error(`[GANADERIA_ERROR] Failed to update ganaderia: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.GanaderiaController = GanaderiaController;
