"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Routers
const perfil_routes_1 = require("./modules/perfil/presentation/perfil.routes");
const ganaderia_routes_1 = require("./modules/ganaderia/presentation/ganaderia.routes");
const vaca_routes_1 = require("./modules/vaca/presentation/vaca.routes");
const ordeno_routes_1 = require("./modules/ordeno/presentation/ordeno.routes");
const request_logger_middleware_1 = require("./shared/middleware/request-logger.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(request_logger_middleware_1.requestLogger);
// Public Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Modular Routes
app.use('/api/perfil', perfil_routes_1.perfilRouter);
app.use('/api/ganaderia', ganaderia_routes_1.ganaderiaRouter);
app.use('/api/vacas', vaca_routes_1.vacaRouter);
app.use('/api/ordenos', ordeno_routes_1.ordenoRouter);
exports.default = app;
