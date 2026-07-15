"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = verifyAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_1 = require("../services/supabase");
const G_SECRET_KEY = process.env.G_SECRET_KEY;
async function verifyAdmin(request, reply) {
    if (!G_SECRET_KEY) {
        request.log.error('Server configuration error: G_SECRET_KEY is missing');
        return reply.status(500).send({ status: 'error', payload: 'Server configuration error' });
    }
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Missing token' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, G_SECRET_KEY);
        if (!decoded || !decoded.email) {
            return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Invalid token payload' });
        }
        if (!supabase_1.supabaseAdmin) {
            return reply.status(503).send({ status: 'error', payload: 'Database client not configured' });
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('admin_users')
            .select('id')
            .eq('email', decoded.email)
            .maybeSingle();
        if (error || !data) {
            request.log.warn(`Admin verification failed for email: ${decoded.email}`);
            return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Access denied' });
        }
        // Attach decoded user to the request
        request.user = decoded;
    }
    catch (err) {
        request.log.error(err, 'JWT verification failed');
        return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Invalid token' });
    }
}
