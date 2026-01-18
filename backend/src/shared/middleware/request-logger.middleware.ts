import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    console.log(`[REQUEST] ${timestamp} | ${method} ${url}`);

    // Capture response finish to log duration and status
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        console.log(`[RESPONSE] ${method} ${url} | Status: ${status} | Duration: ${duration}ms`);
    });

    next();
};
