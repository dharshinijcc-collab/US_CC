"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_1 = require("../services/supabase");
const auth_1 = require("../middleware/auth");
const G_SECRET_KEY = process.env.G_SECRET_KEY;
async function authRoutes(app) {
    // POST /auth/admin-login
    app.post('/auth/admin-login', async (request, reply) => {
        try {
            if (!G_SECRET_KEY) {
                return reply.status(500).send({ status: 'error', payload: 'G_SECRET_KEY configuration is missing on the server.' });
            }
            const { email, password } = request.body;
            if (!email || !password) {
                return reply.status(400).send({ status: 'error', payload: 'Missing email or password' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', payload: 'Database client not configured.' });
            }
            // 1. Fetch user from admin_users
            const { data, error } = await supabase_1.supabaseAdmin
                .from('admin_users')
                .select('id, email, password_hash')
                .eq('email', email)
                .maybeSingle();
            if (error) {
                request.log.error(error, 'Supabase error fetching admin');
                return reply.status(500).send({ status: 'error', payload: error.message });
            }
            if (!data) {
                return reply.status(400).send({ status: 'error', payload: 'Invalid email or password' });
            }
            // 2. Compare password using bcryptjs
            const isPasswordValid = await bcryptjs_1.default.compare(password, data.password_hash);
            if (!isPasswordValid) {
                return reply.status(400).send({ status: 'error', payload: 'Invalid email or password' });
            }
            // 3. Generate JWT access token
            const token = jsonwebtoken_1.default.sign({ email: data.email }, G_SECRET_KEY, { expiresIn: '24h' });
            // Return token in payload (Option A)
            return reply.send({
                status: 'success',
                payload: {
                    user: { email: data.email, id: data.id },
                    token: token
                }
            });
        }
        catch (err) {
            request.log.error(err, 'admin-login API error');
            return reply.status(500).send({ status: 'error', payload: err.message });
        }
    });
    // GET /auth/check
    app.get('/auth/check', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        const user = request.user;
        return reply.send({
            status: 'success',
            authenticated: true,
            user: user,
            payload: user
        });
    });
    // POST /auth/logout
    app.post('/auth/logout', async (request, reply) => {
        // Standard stateless logout simply returns success. Client handles removing token from storage.
        return reply.send({ status: 'success', payload: 'Logged out successfully' });
    });
}
