import express from 'express';
import cors from 'cors';

// Routers
import { perfilRouter } from './modules/perfil/presentation/perfil.routes';
import { ganaderiaRouter } from './modules/ganaderia/presentation/ganaderia.routes';
import { vacaRouter } from './modules/vaca/presentation/vaca.routes';
import { ordenoRouter } from './modules/ordeno/presentation/ordeno.routes';
import { adminRouter } from './modules/admin/presentation/admin.routes';

// Middleware
import { requestLogger } from './shared/middleware/request-logger.middleware';
import { errorHandler } from './shared/middleware/error.middleware';

const app = express();

// CORS Configuration
const allowedOrigins = [
    'https://ganaderia-vacas-frontend.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Public Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Modular Routes
app.use('/api/perfil', perfilRouter);
app.use('/api/ganaderia', ganaderiaRouter);
app.use('/api/vacas', vacaRouter);
app.use('/api/ordenos', ordenoRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
