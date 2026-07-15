import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

export default async function openPositionsRoutes(app: FastifyInstance) {
  // GET /open-positions
  app.get('/open-positions', async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { all } = request.query as { all?: string };
      const showAll = all === 'true';

      let query = supabaseAdmin.from('open_positions').select('*').order('display_order', { ascending: true });
      
      if (!showAll) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', payload: data || [] });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // POST /open-positions
  app.post('/open-positions', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;
      if (!body.title || !body.experience || !body.category) {
        return reply.status(400).send({ status: 'error', message: 'Title, Experience, and Category are required' });
      }

      const { data: maxData } = await supabaseAdmin
        .from('open_positions')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

      const { data, error } = await supabaseAdmin
        .from('open_positions')
        .insert({
          title: body.title,
          location: body.location || 'Chennai, TN',
          type: body.type || 'Full Time',
          experience: body.experience,
          category: body.category,
          apply_link: body.apply_link || 'mailto:careers@crestcode.usa',
          application_email: body.application_email || 'careers@crestcode.usa',
          is_active: body.is_active ?? true,
          display_order: body.display_order ?? (maxOrder + 1)
        })
        .select()
        .single();

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.status(201).send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // PUT /open-positions
  app.put('/open-positions', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const body = request.body as any;
      const { data, error } = await supabaseAdmin
        .from('open_positions')
        .update({
          title: body.title,
          location: body.location,
          type: body.type,
          experience: body.experience,
          category: body.category,
          apply_link: body.apply_link,
          application_email: body.application_email,
          is_active: body.is_active,
          display_order: body.display_order
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // DELETE /open-positions
  app.delete('/open-positions', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { error } = await supabaseAdmin
        .from('open_positions')
        .delete()
        .eq('id', id);

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', message: 'Position deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });
}
