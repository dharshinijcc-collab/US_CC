import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

export default async function faqsRoutes(app: FastifyInstance) {
  // GET /faqs
  app.get('/faqs', async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { all } = request.query as { all?: string };
      const showAll = all === 'true';

      let query = supabaseAdmin.from('faqs').select('*').order('display_order', { ascending: true });
      
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

  // POST /faqs
  app.post('/faqs', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;
      if (!body.category || !body.question || !body.answer) {
        return reply.status(400).send({ status: 'error', message: 'Category, Question, and Answer are required' });
      }

      const { data: maxData } = await supabaseAdmin
        .from('faqs')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

      const { data, error } = await supabaseAdmin
        .from('faqs')
        .insert({
          category: body.category,
          question: body.question,
          answer: body.answer,
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

  // PUT /faqs
  app.put('/faqs', { preHandler: [verifyAdmin] }, async (request, reply) => {
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
        .from('faqs')
        .update({
          category: body.category,
          question: body.question,
          answer: body.answer,
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

  // DELETE /faqs
  app.delete('/faqs', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { error } = await supabaseAdmin
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', message: 'FAQ deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });
}
