"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const content_1 = __importDefault(require("./routes/content"));
const faqs_1 = __importDefault(require("./routes/faqs"));
const milestones_1 = __importDefault(require("./routes/milestones"));
const open_positions_1 = __importDefault(require("./routes/open-positions"));
const partner_products_1 = __importDefault(require("./routes/partner-products"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const submit_1 = __importDefault(require("./routes/submit"));
const team_1 = __importDefault(require("./routes/team"));
const tool_config_1 = __importDefault(require("./routes/tool-config"));
const status_webhook_1 = __importDefault(require("./routes/status-webhook"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const idea_validator_1 = __importDefault(require("./routes/idea-validator"));
const server = (0, fastify_1.default)({
    logger: true,
});
// Configure CORS
server.register(cors_1.default, {
    origin: true, // In production, this can be customized to frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
// Configure Multipart for file uploads
server.register(multipart_1.default, {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
// Health check
server.get('/health', async () => {
    return { status: 'ok', service: 'Concrete Venture Studio API' };
});
// Register routes under /api
server.register(auth_1.default, { prefix: '/api' });
server.register(blogs_1.default, { prefix: '/api' });
server.register(content_1.default, { prefix: '/api' });
server.register(faqs_1.default, { prefix: '/api' });
server.register(milestones_1.default, { prefix: '/api' });
server.register(open_positions_1.default, { prefix: '/api' });
server.register(partner_products_1.default, { prefix: '/api' });
server.register(submissions_1.default, { prefix: '/api' });
server.register(submit_1.default, { prefix: '/api' });
server.register(team_1.default, { prefix: '/api' });
server.register(tool_config_1.default, { prefix: '/api' });
server.register(status_webhook_1.default, { prefix: '/api' });
server.register(uploads_1.default, { prefix: '/api' });
server.register(idea_validator_1.default, { prefix: '/api' });
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const start = async () => {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🚀 Fastify server running on http://localhost:${PORT}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
