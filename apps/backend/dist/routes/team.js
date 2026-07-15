"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = teamRoutes;
const supabase_1 = require("../services/supabase");
const auth_1 = require("../middleware/auth");
async function deleteAvatarFromStorage(imageUrl) {
    if (!imageUrl || !supabase_1.supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/avatars/'))
        return;
    try {
        const filename = imageUrl.split('/').pop();
        if (filename) {
            const { error } = await supabase_1.supabaseAdmin.storage
                .from('avatars')
                .remove([filename]);
            if (error) {
                console.error('Error deleting old avatar from storage:', error);
            }
        }
    }
    catch (err) {
        console.error('Error in deleteAvatarFromStorage:', err);
    }
}
async function teamRoutes(app) {
    // GET /team
    app.get('/team', async (request, reply) => {
        try {
            const { all } = request.query;
            const showAll = all === 'true';
            if (!supabase_1.supabaseAdmin) {
                return reply.send({ status: 'success', payload: [] });
            }
            // If showAll is true, we verify the admin first
            if (showAll) {
                await (0, auth_1.verifyAdmin)(request, reply);
                if (reply.sent)
                    return; // verifyAdmin already sent an error response
            }
            let query = supabase_1.supabaseAdmin.from('team_members').select('*').order('display_order', { ascending: true });
            if (!showAll) {
                query = query.eq('is_active', true);
            }
            const { data, error } = await query;
            if (error) {
                request.log.error(error, 'Error fetching team members');
                return reply.status(500).send({ status: 'error', message: error.message });
            }
            return reply.send({ status: 'success', payload: data });
        }
        catch (err) {
            return reply.status(500).send({ status: 'error', message: err.message });
        }
    });
    // POST /team
    app.post('/team', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', message: 'Database not configured' });
            }
            const body = request.body;
            if (!body.name || !body.role || !body.category) {
                return reply.status(400).send({ status: 'error', message: 'name, role, and category are required' });
            }
            const { data, error } = await supabase_1.supabaseAdmin
                .from('team_members')
                .insert({
                name: body.name,
                role: body.role,
                bio: body.bio || null,
                image_url: body.image_url || null,
                category: body.category,
                display_order: body.display_order ?? 0,
                is_active: body.is_active ?? true,
            })
                .select()
                .single();
            if (error)
                return reply.status(500).send({ status: 'error', message: error.message });
            return reply.status(201).send({ status: 'success', payload: data });
        }
        catch (err) {
            return reply.status(500).send({ status: 'error', message: err.message });
        }
    });
    // PUT /team
    app.put('/team', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', message: 'Database not configured' });
            }
            const { id } = request.query;
            if (!id)
                return reply.status(400).send({ status: 'error', message: 'id is required' });
            const body = request.body;
            // Storage cleanup
            if (body.image_url !== undefined) {
                const { data: currentMember } = await supabase_1.supabaseAdmin
                    .from('team_members')
                    .select('image_url')
                    .eq('id', id)
                    .maybeSingle();
                if (currentMember && currentMember.image_url && currentMember.image_url !== body.image_url) {
                    await deleteAvatarFromStorage(currentMember.image_url);
                }
            }
            const { data, error } = await supabase_1.supabaseAdmin
                .from('team_members')
                .update(body)
                .eq('id', id)
                .select()
                .single();
            if (error)
                return reply.status(500).send({ status: 'error', message: error.message });
            return reply.send({ status: 'success', payload: data });
        }
        catch (err) {
            return reply.status(500).send({ status: 'error', message: err.message });
        }
    });
    // DELETE /team
    app.delete('/team', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', message: 'Database not configured' });
            }
            const { id, permanent } = request.query;
            const isPermanent = permanent === 'true';
            if (!id)
                return reply.status(400).send({ status: 'error', message: 'id is required' });
            const { data: currentMember } = await supabase_1.supabaseAdmin
                .from('team_members')
                .select('image_url')
                .eq('id', id)
                .maybeSingle();
            if (isPermanent) {
                if (currentMember?.image_url) {
                    await deleteAvatarFromStorage(currentMember.image_url);
                }
                const { error } = await supabase_1.supabaseAdmin
                    .from('team_members')
                    .delete()
                    .eq('id', id);
                if (error)
                    return reply.status(500).send({ status: 'error', message: error.message });
                return reply.send({ status: 'success', message: 'Member permanently deleted' });
            }
            else {
                const { error } = await supabase_1.supabaseAdmin
                    .from('team_members')
                    .update({ is_active: false })
                    .eq('id', id);
                if (error)
                    return reply.status(500).send({ status: 'error', message: error.message });
                return reply.send({ status: 'success', message: 'Member deactivated' });
            }
        }
        catch (err) {
            return reply.status(500).send({ status: 'error', message: err.message });
        }
    });
    // POST /team/reorder
    app.post('/team/reorder', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ status: 'error', message: 'Database not configured' });
            }
            const { updates } = request.body;
            if (!updates || !Array.isArray(updates)) {
                return reply.status(400).send({ status: 'error', message: 'updates array is required' });
            }
            const results = await Promise.all(updates.map(({ id, display_order }) => supabase_1.supabaseAdmin
                .from('team_members')
                .update({ display_order })
                .eq('id', id)));
            const failed = results.find((r) => r.error);
            if (failed?.error) {
                return reply.status(500).send({ status: 'error', message: failed.error.message });
            }
            return reply.send({ status: 'success', message: 'Order updated' });
        }
        catch (err) {
            return reply.status(500).send({ status: 'error', message: err.message });
        }
    });
}
