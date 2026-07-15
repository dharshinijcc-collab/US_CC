import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

// Import routes
import authRoutes from './routes/auth';
import blogsRoutes from './routes/blogs';
import contentRoutes from './routes/content';
import faqsRoutes from './routes/faqs';
import milestonesRoutes from './routes/milestones';
import openPositionsRoutes from './routes/open-positions';
import partnerProductsRoutes from './routes/partner-products';
import submissionsRoutes from './routes/submissions';
import submitRoutes from './routes/submit';
import teamRoutes from './routes/team';
import toolConfigRoutes from './routes/tool-config';
import statusWebhookRoutes from './routes/status-webhook';
import uploadsRoutes from './routes/uploads';
import ideaValidatorRoutes from './routes/idea-validator';
import socialValidationRoutes from './routes/social-validation';


const server = fastify({
  logger: true,
});

// Configure CORS
server.register(cors, {
  origin: true, // In production, this can be customized to frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Configure Multipart for file uploads
server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Health check
server.get('/health', async () => {
  return { status: 'ok', service: 'Concrete Venture Studio API' };
});

// Register routes under /api
server.register(authRoutes, { prefix: '/api' });
server.register(blogsRoutes, { prefix: '/api' });
server.register(contentRoutes, { prefix: '/api' });
server.register(faqsRoutes, { prefix: '/api' });
server.register(milestonesRoutes, { prefix: '/api' });
server.register(openPositionsRoutes, { prefix: '/api' });
server.register(partnerProductsRoutes, { prefix: '/api' });
server.register(submissionsRoutes, { prefix: '/api' });
server.register(submitRoutes, { prefix: '/api' });
server.register(teamRoutes, { prefix: '/api' });
server.register(toolConfigRoutes, { prefix: '/api' });
server.register(statusWebhookRoutes, { prefix: '/api' });
server.register(uploadsRoutes, { prefix: '/api' });
server.register(ideaValidatorRoutes, { prefix: '/api' });
server.register(socialValidationRoutes, { prefix: '/api' });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Fastify server running on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
