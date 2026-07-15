import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';

export default async function toolConfigRoutes(app: FastifyInstance) {
  // GET /tool-config
  app.get('/tool-config', async (request, reply) => {
    try {
      const { key } = request.query as { key?: string };

      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', payload: 'Database client not configured.' });
      }

      if (key) {
        const { data, error } = await supabaseAdmin
          .from('tool_configurations')
          .select('config')
          .eq('key', key)
          .maybeSingle();

        if (error) {
          request.log.error(error, `Error fetching tool config for key ${key}`);
          return reply.status(500).send({ status: 'error', payload: error.message });
        }

        if (!data) {
          return reply.status(404).send({ status: 'error', payload: `No configuration found for key ${key}` });
        }

        return reply.send({ status: 'success', payload: data.config });
      } else {
        const { data, error } = await supabaseAdmin
          .from('tool_configurations')
          .select('key, config');

        if (error) {
          request.log.error(error, 'Error fetching all tool configs');
          return reply.status(500).send({ status: 'error', payload: error.message });
        }

        const configs = (data || []).reduce((acc: any, item: any) => {
          acc[item.key] = item.config;
          return acc;
        }, {});

        return reply.send({ status: 'success', payload: configs });
      }
    } catch (err: any) {
      request.log.error('get-tool-config API error:', err);
      return reply.status(500).send({ status: 'error', payload: err.message });
    }
  });

  // POST /tool-config
  app.post('/tool-config', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      const { key, config } = request.body as any;
      if (!key || !config) {
        return reply.status(400).send({ status: 'error', payload: 'Missing key or config payload' });
      }

      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', payload: 'Database client not configured.' });
      }

      const { error } = await supabaseAdmin
        .from('tool_configurations')
        .upsert({ key, config, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) {
        request.log.error(error, `Error updating tool config for key ${key}`);
        return reply.status(500).send({ status: 'error', payload: error.message });
      }

      return reply.send({ status: 'success', payload: `Tool configuration for key ${key} updated successfully` });
    } catch (err: any) {
      request.log.error('update-tool-config API error:', err);
      return reply.status(500).send({ status: 'error', payload: err.message });
    }
  });
}
