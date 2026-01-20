import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../../shared/middleware/admin.middleware';
import { SupabaseAdminRepository } from '../infrastructure/admin.repository';
import { AdminUseCase } from '../application/admin.usecase';
import { AdminController } from './admin.controller';

const adminRouter = Router();

// Dependencies
const adminRepo = new SupabaseAdminRepository();
const adminUseCase = new AdminUseCase(adminRepo);
const adminController = new AdminController(adminUseCase);

// All routes are protected by auth + admin middleware
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/ganaderias', adminController.getGanaderias);
adminRouter.get('/roles', adminController.getRoles);
adminRouter.post('/access', adminController.assignAccess);
adminRouter.delete('/access/:userId/:ganaderiaId', adminController.removeAccess);
adminRouter.put('/users/:userId/role', adminController.updateUserRole);

export { adminRouter };
