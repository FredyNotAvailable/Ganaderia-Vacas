"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenoRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../shared/middleware/auth.middleware");
const ordeno_repository_1 = require("../infrastructure/ordeno.repository");
const ordeno_usecase_1 = require("../application/ordeno.usecase");
const ordeno_controller_1 = require("./ordeno.controller");
const authorize_middleware_1 = require("../../../shared/middleware/authorize.middleware");
const permisos_1 = require("../../../shared/constants/permisos");
const ordenoRouter = (0, express_1.Router)();
exports.ordenoRouter = ordenoRouter;
// Dependencies
const ordenoRepo = new ordeno_repository_1.SupabaseOrdenoRepository();
const ordenoUseCase = new ordeno_usecase_1.OrdenoUseCase(ordenoRepo);
const ordenoController = new ordeno_controller_1.OrdenoController(ordenoUseCase);
// Routes
ordenoRouter.post('/', auth_middleware_1.authMiddleware, (0, authorize_middleware_1.authorize)(permisos_1.PERMISOS.CREAR), ordenoController.create);
ordenoRouter.get('/', auth_middleware_1.authMiddleware, (0, authorize_middleware_1.authorize)(permisos_1.PERMISOS.LECTURA), ordenoController.list);
ordenoRouter.put('/:id', auth_middleware_1.authMiddleware, (0, authorize_middleware_1.authorize)(permisos_1.PERMISOS.EDITAR), ordenoController.update);
ordenoRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, authorize_middleware_1.authorize)(permisos_1.PERMISOS.ELIMINAR), ordenoController.delete);
