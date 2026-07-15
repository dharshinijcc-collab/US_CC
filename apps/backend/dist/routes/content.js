"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = contentRoutes;
const supabase_1 = require("../services/supabase");
const auth_1 = require("../middleware/auth");
async function contentRoutes(app) {
    // GET /content
    app.get('/content', async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                request.log.warn('⚠️ Database client not configured. Falling back to local static config.json');
                // Let's see if we have access to local config.json.
                // We will try importing it from the shared folder if it's there.
                // If not, we can fail gracefully or return dummy config.
                try {
                    const localConfig = require('../../web/shared/config.json');
                    return reply.send({ status: 'success', payload: localConfig });
                }
                catch {
                    return reply.status(503).send({ status: 'error', payload: 'Database and fallback local config not configured.' });
                }
            }
            const { data, error } = await supabase_1.supabaseAdmin
                .from('site_content')
                .select('payload')
                .eq('content_key', 'main_config')
                .eq('active', true)
                .maybeSingle();
            if (error) {
                request.log.error(error, 'Supabase error fetching content');
                return reply.status(500).send({ status: 'error', payload: error.message });
            }
            if (!data) {
                return reply.status(404).send({ status: 'error', payload: 'No content found' });
            }
            return reply.send({ status: 'success', payload: data.payload });
        }
        catch (err) {
            request.log.error(err, 'get-content API error');
            return reply.status(500).send({ status: 'error', payload: err.message });
        }
    });
    // POST /content/update
    app.post('/content/update', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            const { payload } = request.body;
            if (!payload) {
                return reply.status(400).send({ status: 'error', payload: 'Missing payload' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', payload: 'Database client not configured.' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('site_content')
                .update({ payload })
                .eq('content_key', 'main_config');
            if (error) {
                request.log.error(error, 'Supabase error updating content');
                return reply.status(500).send({ status: 'error', payload: error.message });
            }
            return reply.send({ status: 'success', payload: 'Content updated successfully' });
        }
        catch (err) {
            request.log.error(err, 'update-content API error');
            return reply.status(500).send({ status: 'error', payload: err.message });
        }
    });
}
