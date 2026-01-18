"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ganaderiaRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../shared/middleware/auth.middleware");
const ganaderia_repository_1 = require("../infrastructure/ganaderia.repository");
const ganaderia_usecase_1 = require("../application/ganaderia.usecase");
const ganaderia_controller_1 = require("./ganaderia.controller");
const ganaderiaRouter = (0, express_1.Router)();
exports.ganaderiaRouter = ganaderiaRouter;
// Dependencies
const ganaderiaRepo = new ganaderia_repository_1.SupabaseGanaderiaRepository();
const ganaderiaUseCase = new ganaderia_usecase_1.GanaderiaUseCase(ganaderiaRepo);
const ganaderiaController = new ganaderia_controller_1.GanaderiaController(ganaderiaUseCase);
// Routes
ganaderiaRouter.get('/', auth_middleware_1.authMiddleware, ganaderiaController.getGanaderia);
ganaderiaRouter.put('/', auth_middleware_1.authMiddleware, ganaderiaController.updateGanaderia);
