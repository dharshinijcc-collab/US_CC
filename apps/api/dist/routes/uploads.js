"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadsRoutes;
const auth_1 = require("../middleware/auth");
const supabase_1 = require("../services/supabase");
const crypto_1 = __importDefault(require("crypto"));
async function uploadsRoutes(app) {
    // POST /people/upload
    app.post('/people/upload', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const fileData = await request.file();
            if (!fileData) {
                return reply.status(400).send({ error: 'No file provided' });
            }
            const buffer = await fileData.toBuffer();
            // Validate file size (max 5MB)
            if (buffer.length > 5 * 1024 * 1024) {
                return reply.status(400).send({ error: 'File size exceeds 5MB limit' });
            }
            // Validate MIME type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(fileData.mimetype)) {
                return reply.status(400).send({ error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.' });
            }
            const ext = fileData.filename.split('.').pop() || 'png';
            const uniqueName = `avatar-${crypto_1.default.randomUUID()}.${ext}`;
            const { error: uploadError } = await supabase_1.supabaseAdmin.storage
                .from('avatars')
                .upload(uniqueName, buffer, {
                contentType: fileData.mimetype,
                upsert: true
            });
            if (uploadError) {
                request.log.error(uploadError, 'Supabase Storage upload error');
                return reply.status(500).send({ error: uploadError.message });
            }
            const { data: publicUrlData } = supabase_1.supabaseAdmin.storage
                .from('avatars')
                .getPublicUrl(uniqueName);
            const publicUrl = publicUrlData?.publicUrl || '';
            return reply.send({ status: 'success', url: publicUrl, filename: uniqueName });
        }
        catch (err) {
            request.log.error(err, 'API upload error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /portfolio/upload
    app.post('/portfolio/upload', { preHandler: [auth_1.verifyAdmin] }, async (request, reply) => {
        try {
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const fileData = await request.file();
            if (!fileData) {
                return reply.status(400).send({ error: 'No file provided' });
            }
            const buffer = await fileData.toBuffer();
            // Validate file size (max 8MB)
            if (buffer.length > 8 * 1024 * 1024) {
                return reply.status(400).send({ error: 'File size exceeds 8MB limit' });
            }
            // Validate MIME type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(fileData.mimetype)) {
                return reply.status(400).send({ error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.' });
            }
            const ext = fileData.filename.split('.').pop() || 'png';
            const uniqueName = `portfolio-${crypto_1.default.randomUUID()}.${ext}`;
            const { error: uploadError } = await supabase_1.supabaseAdmin.storage
                .from('portfolio')
                .upload(uniqueName, buffer, {
                contentType: fileData.mimetype,
                upsert: true
            });
            if (uploadError) {
                request.log.error(uploadError, 'Supabase Storage upload error');
                return reply.status(500).send({ error: uploadError.message });
            }
            const { data: publicUrlData } = supabase_1.supabaseAdmin.storage
                .from('portfolio')
                .getPublicUrl(uniqueName);
            const publicUrl = publicUrlData?.publicUrl || '';
            return reply.send({ status: 'success', url: publicUrl, filename: uniqueName });
        }
        catch (err) {
            request.log.error(err, 'API upload error');
            return reply.status(500).send({ error: err.message });
        }
    });
}
