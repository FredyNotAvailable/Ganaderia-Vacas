import express from 'express';
import cors from 'cors';

// Routers
import { perfilRouter } from './modules/perfil/presentation/perfil.routes';
import { ganaderiaRouter } from './modules/ganaderia/presentation/ganaderia.routes';
import { vacaRouter } from './modules/vaca/presentation/vaca.routes';
import { ordenoRouter } from './modules/ordeno/presentation/ordeno.routes';

import { requestLogger } from './shared/middleware/request-logger.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Public Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Modular Routes
app.use('/api/perfil', perfilRouter);
app.use('/api/ganaderia', ganaderiaRouter);
app.use('/api/vacas', vacaRouter);
app.use('/api/ordenos', ordenoRouter);

export default app;
