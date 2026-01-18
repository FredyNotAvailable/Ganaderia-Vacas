import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabaseOrdenoRepository } from '../infrastructure/ordeno.repository';
import { OrdenoUseCase } from '../application/ordeno.usecase';
import { OrdenoController } from './ordeno.controller';

const ordenoRouter = Router();

// Dependencies
const ordenoRepo = new SupabaseOrdenoRepository();
const ordenoUseCase = new OrdenoUseCase(ordenoRepo);
const ordenoController = new OrdenoController(ordenoUseCase);

// Routes
ordenoRouter.post('/', authMiddleware, ordenoController.create);
ordenoRouter.get('/', authMiddleware, ordenoController.list);
ordenoRouter.put('/:id', authMiddleware, ordenoController.update);
ordenoRouter.delete('/:id', authMiddleware, ordenoController.delete);

export { ordenoRouter };
