"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfilRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../shared/middleware/auth.middleware");
const perfil_repository_1 = require("../infrastructure/perfil.repository");
const update_perfil_usecase_1 = require("../application/update-perfil.usecase");
const perfil_controller_1 = require("./perfil.controller");
const perfilRouter = (0, express_1.Router)();
exports.perfilRouter = perfilRouter;
// Dependencies
const perfilRepo = new perfil_repository_1.SupabasePerfilRepository();
const perfilUseCase = new update_perfil_usecase_1.UpdatePerfilUseCase(perfilRepo);
const perfilController = new perfil_controller_1.PerfilController(perfilUseCase);
// Routes
perfilRouter.get('/', auth_middleware_1.authMiddleware, perfilController.getProfile);
perfilRouter.put('/', auth_middleware_1.authMiddleware, perfilController.updateProfile);
