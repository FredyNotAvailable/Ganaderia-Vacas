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
// Middleware
const request_logger_middleware_1 = require("./shared/middleware/request-logger.middleware");
const error_middleware_1 = require("./shared/middleware/error.middleware");
const app = (0, express_1.default)();
// CORS Configuration
const allowedOrigins = [
    'https://ganaderia-vacas-frontend.vercel.app',
    'http://localhost:5173'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(request_logger_middleware_1.requestLogger);
// Public Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Modular Routes
app.use('/api/perfil', perfil_routes_1.perfilRouter);
app.use('/api/ganaderia', ganaderia_routes_1.ganaderiaRouter);
app.use('/api/vacas', vaca_routes_1.vacaRouter);
app.use('/api/ordenos', ordeno_routes_1.ordenoRouter);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
