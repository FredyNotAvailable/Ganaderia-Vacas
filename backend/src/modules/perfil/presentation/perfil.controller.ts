import { Response } from 'express';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';
import { UpdatePerfilUseCase } from '../application/update-perfil.usecase';

export class PerfilController {
    constructor(private updatePerfilUseCase: UpdatePerfilUseCase) { }

    getProfile = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email; // Assuming auth middleware attaches email or we can get it
            console.log(`[PERFIL] Getting profile for user: ${userId}`);

            let profile = await this.updatePerfilUseCase.getProfile(userId);

            if (!profile) {
                console.log(`[PERFIL] Profile not found for user: ${userId}. Auto-creating...`);
                // Auto-create logic using metadata if available
                const fullName = req.user.user_metadata?.full_name || 'Usuario';
                try {
                    profile = await this.updatePerfilUseCase.createProfile({
                        user_id: userId,
                        nombre: fullName,
                        email: userEmail || 'no-email@provided.com'
                    });
                    console.log(`[PERFIL] Profile auto-created successfully: ${userId} (${fullName})`);
                } catch (createError: any) {
                    console.error(`[PERFIL_ERROR] Failed to auto-create profile: ${createError.message}`);
                    return res.status(500).json({ error: 'Failed to create profile' });
                }
            }

            return res.json(profile);
        } catch (error: any) {
            console.error(`[PERFIL_ERROR] Failed to get profile: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };

    updateProfile = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user.id;
            console.log(`[PERFIL] Updating profile for user: ${userId}`);
            const updatedProfile = await this.updatePerfilUseCase.execute(userId, req.body);
            console.log(`[PERFIL] Profile updated successfully for user: ${userId}`);
            return res.json(updatedProfile);
        } catch (error: any) {
            console.error(`[PERFIL_ERROR] Failed to update profile: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    };
}
