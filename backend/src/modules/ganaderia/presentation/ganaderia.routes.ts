import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabaseGanaderiaRepository } from '../infrastructure/ganaderia.repository';
import { GanaderiaUseCase } from '../application/ganaderia.usecase';
import { GanaderiaController } from './ganaderia.controller';

const ganaderiaRouter = Router();

// Dependencies
const ganaderiaRepo = new SupabaseGanaderiaRepository();
const ganaderiaUseCase = new GanaderiaUseCase(ganaderiaRepo);
const ganaderiaController = new GanaderiaController(ganaderiaUseCase);

// Routes
ganaderiaRouter.get('/', authMiddleware, ganaderiaController.getGanaderia);
ganaderiaRouter.post('/', authMiddleware, ganaderiaController.createGanaderia);
ganaderiaRouter.put('/:id', authMiddleware, ganaderiaController.updateGanaderia);
ganaderiaRouter.delete('/:id', authMiddleware, ganaderiaController.deleteGanaderia);

export { ganaderiaRouter };
