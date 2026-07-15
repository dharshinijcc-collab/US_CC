import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

export default async function authRoutes(app: FastifyInstance) {
  // POST /auth/admin-login
  app.post('/auth/admin-login', async (request, reply) => {
    try {
      if (!G_SECRET_KEY) {
        return reply.status(500).send({ status: 'error', payload: 'G_SECRET_KEY configuration is missing on the server.' });
      }

      const { email, password } = request.body as any;

      if (!email || !password) {
        return reply.status(400).send({ status: 'error', payload: 'Missing email or password' });
      }

      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', payload: 'Database client not configured.' });
      }

      // 1. Fetch user from admin_users
      const { data, error } = await supabaseAdmin
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
      const isPasswordValid = await bcrypt.compare(password, data.password_hash);
      if (!isPasswordValid) {
        return reply.status(400).send({ status: 'error', payload: 'Invalid email or password' });
      }

      // 3. Generate JWT access token
      const token = jwt.sign({ email: data.email }, G_SECRET_KEY, { expiresIn: '24h' });

      // Return token in payload (Option A)
      return reply.send({
        status: 'success',
        payload: {
          user: { email: data.email, id: data.id },
          token: token
        }
      });
    } catch (err: any) {
      request.log.error(err, 'admin-login API error');
      return reply.status(500).send({ status: 'error', payload: err.message });
    }
  });

  // GET /auth/check
  app.get('/auth/check', { preHandler: [verifyAdmin] }, async (request, reply) => {
    const user = (request as any).user;
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
