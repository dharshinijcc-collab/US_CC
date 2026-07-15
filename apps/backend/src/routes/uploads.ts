import { FastifyInstance } from 'fastify';
import { verifyAdmin } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';
import crypto from 'crypto';

export default async function uploadsRoutes(app: FastifyInstance) {
  // POST /people/upload
  app.post('/people/upload', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
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
      const uniqueName = `avatar-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('avatars')
        .upload(uniqueName, buffer, {
          contentType: fileData.mimetype,
          upsert: true
        });

      if (uploadError) {
        request.log.error(uploadError, 'Supabase Storage upload error');
        return reply.status(500).send({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('avatars')
        .getPublicUrl(uniqueName);

      const publicUrl = publicUrlData?.publicUrl || '';

      return reply.send({ status: 'success', url: publicUrl, filename: uniqueName });
    } catch (err: any) {
      request.log.error(err, 'API upload error');
      return reply.status(500).send({ error: err.message });
    }
  });

  // POST /portfolio/upload
  app.post('/portfolio/upload', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
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
      const uniqueName = `portfolio-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('portfolio')
        .upload(uniqueName, buffer, {
          contentType: fileData.mimetype,
          upsert: true
        });

      if (uploadError) {
        request.log.error(uploadError, 'Supabase Storage upload error');
        return reply.status(500).send({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('portfolio')
        .getPublicUrl(uniqueName);

      const publicUrl = publicUrlData?.publicUrl || '';

      return reply.send({ status: 'success', url: publicUrl, filename: uniqueName });
    } catch (err: any) {
      request.log.error(err, 'API upload error');
      return reply.status(500).send({ error: err.message });
    }
  });
}
