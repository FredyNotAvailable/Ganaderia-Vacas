import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { SupabaseOrdenoRepository } from '../infrastructure/ordeno.repository';
import { OrdenoUseCase } from '../application/ordeno.usecase';
import { OrdenoController } from './ordeno.controller';
import { authorize } from '../../../shared/middleware/authorize.middleware';
import { PERMISOS } from '../../../shared/constants/permisos';

const ordenoRouter = Router();

// Dependencies
const ordenoRepo = new SupabaseOrdenoRepository();
const ordenoUseCase = new OrdenoUseCase(ordenoRepo);
const ordenoController = new OrdenoController(ordenoUseCase);

// Routes
ordenoRouter.post('/', authMiddleware, authorize(PERMISOS.CREAR), ordenoController.create);
ordenoRouter.get('/', authMiddleware, authorize(PERMISOS.LECTURA), ordenoController.list);
ordenoRouter.put('/:id', authMiddleware, authorize(PERMISOS.EDITAR), ordenoController.update);
ordenoRouter.delete('/:id', authMiddleware, authorize(PERMISOS.ELIMINAR), ordenoController.delete);

export { ordenoRouter };
