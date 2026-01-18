"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_client_1 = require("../supabase/supabase.client");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.warn(`[AUTH_WARN] Request missing Authorization header`);
        return res.status(401).json({ error: 'No authorization header provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.warn(`[AUTH_WARN] Request missing token in Authorization header`);
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const { data: { user }, error } = await supabase_client_1.supabase.auth.getUser(token);
        if (error || !user) {
            console.warn(`[AUTH_WARN] Invalid token or user not found. Error: ${error?.message}`);
            return res.status(401).json({ error: 'Invalid token or user not found' });
        }
        console.log(`[AUTH_SUCCESS] User authenticated: ${user.id} (${user.email})`);
        req.user = user;
        next();
    }
    catch (err) {
        console.error(`[AUTH_ERROR] Unexpected auth error: ${err.message}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authMiddleware = authMiddleware;
