"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacaRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../shared/middleware/auth.middleware");
const vaca_repository_1 = require("../infrastructure/vaca.repository");
const vaca_usecase_1 = require("../application/vaca.usecase");
const vaca_controller_1 = require("./vaca.controller");
const vacaRouter = (0, express_1.Router)();
exports.vacaRouter = vacaRouter;
// Dependencies
const vacaRepo = new vaca_repository_1.SupabaseVacaRepository();
const vacaUseCase = new vaca_usecase_1.VacaUseCase(vacaRepo);
const vacaController = new vaca_controller_1.VacaController(vacaUseCase);
// Routes
vacaRouter.post('/', auth_middleware_1.authMiddleware, vacaController.create);
vacaRouter.get('/', auth_middleware_1.authMiddleware, vacaController.list);
vacaRouter.put('/:id', auth_middleware_1.authMiddleware, vacaController.update);
