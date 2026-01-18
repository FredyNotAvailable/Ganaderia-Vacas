import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabasePerfilRepository } from '../infrastructure/perfil.repository';
import { UpdatePerfilUseCase } from '../application/update-perfil.usecase';
import { PerfilController } from './perfil.controller';

const perfilRouter = Router();

// Dependencies
const perfilRepo = new SupabasePerfilRepository();
const perfilUseCase = new UpdatePerfilUseCase(perfilRepo);
const perfilController = new PerfilController(perfilUseCase);

// Routes
perfilRouter.get('/', authMiddleware, perfilController.getProfile);
perfilRouter.put('/', authMiddleware, perfilController.updateProfile);

export { perfilRouter };
