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
    }
}
exports.OrdenoController = OrdenoController;
