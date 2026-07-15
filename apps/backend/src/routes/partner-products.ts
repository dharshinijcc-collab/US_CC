import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

async function deleteProductLogo(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/portfolio/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      await supabaseAdmin.storage.from('portfolio').remove([filename]);
    }
  } catch (err) {
    console.error('Failed to clean up product logo:', err);
  }
}

export default async function partnerProductsRoutes(app: FastifyInstance) {
  // GET /partner-products
  app.get('/partner-products', async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { all } = request.query as { all?: string };
      const showAll = all === 'true';

      let query = supabaseAdmin.from('partner_products').select('*').order('display_order', { ascending: true });
      
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

  // POST /partner-products
  app.post('/partner-products', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;
      if (!body.name || !body.tagline || !body.subtitle || !body.what_we_did) {
        return reply.status(400).send({ status: 'error', message: 'Name, Tagline, Subtitle, and What We Did are required' });
      }

      const { data: maxData } = await supabaseAdmin
        .from('partner_products')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

      const { data, error } = await supabaseAdmin
        .from('partner_products')
        .insert({
          name: body.name,
          status_type: body.status_type || 'live',
          status_text: body.status_text || 'Live',
          status_subtext: body.status_subtext || null,
          tagline: body.tagline,
          subtitle: body.subtitle,
          stat_value: body.stat_value || '',
          stat_subtext: body.stat_subtext || '',
          what_we_did: body.what_we_did,
          industry: body.industry || '',
          duration: body.duration || '',
          team_size: body.team_size || '',
          tech_stack: body.tech_stack || [],
          features: body.features || [],
          gallery_images: body.gallery_images || [],
          website_url: body.website_url || null,
          logo_url: body.logo_url || null,
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

  // PUT /partner-products
  app.put('/partner-products', { preHandler: [verifyAdmin] }, async (request, reply) => {
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
        .from('partner_products')
        .select('logo_url, gallery_images')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.logo_url && existing.logo_url !== body.logo_url) {
        await deleteProductLogo(existing.logo_url);
      }

      if (existing && Array.isArray(existing.gallery_images) && Array.isArray(body.gallery_images)) {
        const deletedImages = existing.gallery_images.filter((img: string) => !body.gallery_images.includes(img));
        for (const img of deletedImages) {
          await deleteProductLogo(img);
        }
      }

      const { data, error } = await supabaseAdmin
        .from('partner_products')
        .update({
          name: body.name,
          status_type: body.status_type,
          status_text: body.status_text,
          status_subtext: body.status_subtext,
          tagline: body.tagline,
          subtitle: body.subtitle,
          stat_value: body.stat_value,
          stat_subtext: body.stat_subtext,
          what_we_did: body.what_we_did,
          industry: body.industry,
          duration: body.duration,
          team_size: body.team_size,
          tech_stack: body.tech_stack,
          features: body.features,
          gallery_images: body.gallery_images,
          website_url: body.website_url,
          logo_url: body.logo_url,
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

  // DELETE /partner-products
  app.delete('/partner-products', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { data: existing } = await supabaseAdmin
        .from('partner_products')
        .select('logo_url, gallery_images')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.logo_url) {
        await deleteProductLogo(existing.logo_url);
      }
      if (existing && Array.isArray(existing.gallery_images)) {
        for (const img of existing.gallery_images) {
          await deleteProductLogo(img);
        }
      }

      const { error } = await supabaseAdmin
        .from('partner_products')
        .delete()
        .eq('id', id);

      if (error) {
        return reply.status(500).send({ status: 'error', message: error.message });
      }
      return reply.send({ status: 'success', message: 'Product deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });
}
