import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabaseVacaRepository } from '../infrastructure/vaca.repository';
import { VacaUseCase } from '../application/vaca.usecase';
import { VacaController } from './vaca.controller';

const vacaRouter = Router();

// Dependencies
const vacaRepo = new SupabaseVacaRepository();
const vacaUseCase = new VacaUseCase(vacaRepo);
const vacaController = new VacaController(vacaUseCase);

// Routes
vacaRouter.post('/', authMiddleware, vacaController.create);
vacaRouter.get('/', authMiddleware, vacaController.list);
vacaRouter.put('/:id', authMiddleware, vacaController.update);
vacaRouter.delete('/:id', authMiddleware, vacaController.delete);

export { vacaRouter };
