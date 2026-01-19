import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabaseVacaRepository } from '../infrastructure/vaca.repository';
import { VacaUseCase } from '../application/vaca.usecase';
import { VacaController } from './vaca.controller';
import { authorize } from '../../../shared/middleware/authorize.middleware';
import { PERMISOS } from '../../../shared/constants/permisos';

const vacaRouter = Router();

// Dependencies
const vacaRepo = new SupabaseVacaRepository();
const vacaUseCase = new VacaUseCase(vacaRepo);
const vacaController = new VacaController(vacaUseCase);

// Routes
vacaRouter.post('/', authMiddleware, authorize(PERMISOS.CREAR), vacaController.create);
vacaRouter.get('/', authMiddleware, authorize(PERMISOS.LECTURA), vacaController.list);
vacaRouter.put('/:id', authMiddleware, authorize(PERMISOS.EDITAR), vacaController.update);
vacaRouter.delete('/:id', authMiddleware, authorize(PERMISOS.ELIMINAR), vacaController.delete);

export { vacaRouter };
