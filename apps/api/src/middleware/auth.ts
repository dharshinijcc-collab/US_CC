import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../services/supabase';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
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
    const decoded = jwt.verify(token, G_SECRET_KEY) as { email: string };
    if (!decoded || !decoded.email) {
      return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Invalid token payload' });
    }

    if (!supabaseAdmin) {
      return reply.status(503).send({ status: 'error', payload: 'Database client not configured' });
    }

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', decoded.email)
      .maybeSingle();

    if (error || !data) {
      request.log.warn(`Admin verification failed for email: ${decoded.email}`);
      return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Access denied' });
    }

    // Attach decoded user to the request
    (request as any).user = decoded;
  } catch (err) {
    request.log.error(err, 'JWT verification failed');
    return reply.status(401).send({ status: 'error', payload: 'Unauthorized: Invalid token' });
  }
}
