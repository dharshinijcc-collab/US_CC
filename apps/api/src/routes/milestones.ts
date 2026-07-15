import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

async function deleteMilestoneImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/portfolio/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      await supabaseAdmin.storage.from('portfolio').remove([filename]);
    }
  } catch (err) {
    console.error('Failed to clean up milestone image:', err);
  }
}

export default async function milestonesRoutes(app: FastifyInstance) {
  // GET /milestones
  app.get('/milestones', async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { data, error } = await supabaseAdmin
        .from('milestones')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', payload: data || [] });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // POST /milestones
  app.post('/milestones', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;
      if (!body.year || !body.title || !body.description) {
        return reply.status(400).send({ status: 'error', message: 'Year, Title, and Description are required' });
      }

      const { data: maxData } = await supabaseAdmin
        .from('milestones')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

      const { data, error } = await supabaseAdmin
        .from('milestones')
        .insert({
          year: body.year,
          title: body.title,
          description: body.description,
          image_url: body.image_url || null,
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

  // PUT /milestones
  app.put('/milestones', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const body = request.body as any;

      const { data: existing } = await supabaseAdmin
        .from('milestones')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.image_url && existing.image_url !== body.image_url) {
        await deleteMilestoneImage(existing.image_url);
      }

      const { data, error } = await supabaseAdmin
        .from('milestones')
        .update({
          year: body.year,
          title: body.title,
          description: body.description,
          image_url: body.image_url,
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

  // DELETE /milestones
  app.delete('/milestones', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { data: existing } = await supabaseAdmin
        .from('milestones')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.image_url) {
        await deleteMilestoneImage(existing.image_url);
      }

      const { error } = await supabaseAdmin
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', message: 'Milestone deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });
}
