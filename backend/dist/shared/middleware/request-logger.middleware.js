"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
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
exports.requestLogger = requestLogger;
