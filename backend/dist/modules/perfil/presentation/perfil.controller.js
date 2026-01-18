"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilController = void 0;
class PerfilController {
    constructor(updatePerfilUseCase) {
        this.updatePerfilUseCase = updatePerfilUseCase;
        this.getProfile = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[PERFIL] Getting profile for user: ${userId}`);
                const profile = await this.updatePerfilUseCase.getProfile(userId);
                if (!profile) {
                    console.warn(`[PERFIL_WARN] Profile not found for user: ${userId}`);
                    return res.status(404).json({ error: 'Profile not found' });
                }
                console.log(`[PERFIL] Profile found for user: ${userId}`);
                return res.json(profile);
            }
            catch (error) {
                console.error(`[PERFIL_ERROR] Failed to get profile: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                const userId = req.user.id;
                console.log(`[PERFIL] Updating profile for user: ${userId}`);
                const updatedProfile = await this.updatePerfilUseCase.execute(userId, req.body);
                console.log(`[PERFIL] Profile updated successfully for user: ${userId}`);
                return res.json(updatedProfile);
            }
            catch (error) {
                console.error(`[PERFIL_ERROR] Failed to update profile: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        };
    }
}
exports.PerfilController = PerfilController;
