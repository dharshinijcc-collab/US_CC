"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ideaValidatorRoutes;
const zod_1 = require("zod");
const crypto_1 = __importDefault(require("crypto"));
const supabase_1 = require("../services/supabase");
const signal_extractor_1 = require("./idea-validator/lib/signal-extractor");
const rule_engine_1 = require("./idea-validator/lib/rule-engine");
const gemini_1 = require("./idea-validator/lib/gemini");
const score_calculator_1 = require("./idea-validator/lib/score-calculator");
const social_validation_engine_1 = require("../tools/social-validation-engine");
// Input Zod Validation Schema
const submitIdeaSchema = zod_1.z.object({
    ideaText: zod_1.z.string().min(10).max(2000),
    answers: zod_1.z.object({
        customer: zod_1.z.string().min(2),
        problem: zod_1.z.string().min(2),
        pain_score: zod_1.z.number().min(1).max(10),
        validation_level: zod_1.z.enum(['none', 'conversations', 'waitlist', 'paying_customers']),
        market_size_choice: zod_1.z.enum(['small', 'medium', 'large', 'mass_market']).optional(),
        revenue_model_choice: zod_1.z.enum(['subscription', 'transaction_fee', 'marketplace', 'licensing', 'advertising', 'one_time', 'other']).optional(),
        why_now: zod_1.z.string().min(2).optional(),
        competitors: zod_1.z.string().min(2),
        moat: zod_1.z.string().min(2),
        solo_founder: zod_1.z.boolean(),
        has_technical_cofounder: zod_1.z.boolean().optional(),
        technical_background: zod_1.z.enum(['can_code', 'used_to_code', 'no']),
        current_stage: zod_1.z.enum(['forming', 'ux_design', 'prototype', 'mvp']),
        launch_timeline: zod_1.z.string().min(2),
        funding_status: zod_1.z.enum(['bootstrapped', 'raising', 'raised']),
        contact_name: zod_1.z.string().min(2),
        contact_email: zod_1.z.string().email(),
        need_help: zod_1.z.boolean().optional()
    })
});
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// Simple in-memory cache
const cache = new Map();
async function getUserIdFromRequest(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    if (!supabase_1.supabaseAdmin)
        return null;
    try {
        const { data: { user }, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !user)
            return null;
        return user.id;
    }
    catch (err) {
        console.error('Error verifying auth token:', err);
        return null;
    }
}
async function ideaValidatorRoutes(app) {
    // GET /idea-validator
    app.get('/idea-validator', async (request, reply) => {
        let reportData = null;
        try {
            const { id } = request.query;
            if (!id) {
                return reply.status(400).send({ error: 'Missing report ID' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const userId = await getUserIdFromRequest(request);
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
            }
            const { data, error } = await supabase_1.supabaseAdmin
                .from('dd_reports')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            reportData = data;
            if (error) {
                request.log.error(error, 'Supabase error fetching dd_report');
                return reply.status(500).send({ error: error.message });
            }
            if (!data) {
                return reply.status(404).send({ error: 'Report not found' });
            }
            if (data.user_id && data.user_id !== userId) {
                return reply.status(403).send({ error: 'Forbidden: You do not own this report' });
            }
            // If it is a draft (overall_score is null), compile it with SVE results
            if (data.overall_score === null) {
                const draftData = data.report_data;
                const { ideaText, answers } = draftData;
                // Check if the SVE project is done
                const { data: projectRow, error: pError } = await supabase_1.supabaseAdmin
                    .from('projects')
                    .select('status')
                    .eq('id', id)
                    .maybeSingle();
                if (pError || !projectRow) {
                    request.log.error(pError, 'Supabase error fetching SVE project');
                    return reply.status(500).send({ error: 'Failed to fetch SVE project status' });
                }
                if (projectRow.status !== 'done') {
                    return reply.status(425).send({ error: `Social Validation is in status: ${projectRow.status}` });
                }
                request.log.info('⚙️ SVE completed. Compiling final merged report...');
                // 1. Fetch SVE report
                const { data: sveReport } = await supabase_1.supabaseAdmin
                    .from('reports')
                    .select('*')
                    .eq('project_id', id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                // 2. Fetch SVE pain points & sources
                const { data: pps } = await supabase_1.supabaseAdmin
                    .from('pain_points')
                    .select('*')
                    .eq('project_id', id);
                const painPointsOut = [];
                for (const pp of (pps || [])) {
                    const { data: joinRows } = await supabase_1.supabaseAdmin
                        .from('pain_point_sources')
                        .select('source_id')
                        .eq('pain_point_id', pp.id);
                    const sourceIds = (joinRows || []).map((r) => r.source_id);
                    let urls = [];
                    if (sourceIds.length > 0) {
                        const { data: srcRows } = await supabase_1.supabaseAdmin
                            .from('sources')
                            .select('url')
                            .in('id', sourceIds);
                        urls = (srcRows || []).map((s) => s.url);
                    }
                    painPointsOut.push({
                        pain_point: pp.pain_point,
                        mentions: pp.mentions,
                        severity: pp.severity,
                        confidence: pp.confidence,
                        sources: urls
                    });
                }
                // 3. Fetch SVE competitors
                const { data: comps } = await supabase_1.supabaseAdmin
                    .from('competitors')
                    .select('*')
                    .eq('project_id', id);
                const competitorsOut = (comps || []).map((c) => ({
                    name: c.name,
                    website: c.website,
                    source_url: c.source_url,
                    missing_features: c.missing_features || [],
                    confidence: c.confidence
                }));
                // 4. Fetch SVE features
                const { data: feats } = await supabase_1.supabaseAdmin
                    .from('features')
                    .select('*')
                    .eq('project_id', id)
                    .order('mentions', { ascending: false });
                const featuresOut = (feats || []).map((f) => ({
                    feature_name: f.feature_name,
                    mentions: f.mentions,
                    priority: f.priority
                }));
                // 5. Run local Fastify Due Diligence signals, scoring & narrative
                const geminiKey = process.env.GEMINI_API_KEY;
                const answersWithDefaults = {
                    ...answers,
                    market_size_choice: answers.market_size_choice || 'medium',
                    revenue_model_choice: answers.revenue_model_choice || 'subscription',
                    why_now: answers.why_now || 'The timing is right due to market shifts and technological advancements.',
                    has_technical_cofounder: answers.has_technical_cofounder !== undefined
                        ? answers.has_technical_cofounder
                        : (answers.solo_founder ? false : true),
                };
                // Fetch dynamic configurations
                let dynamicConfig = null;
                try {
                    const { data: configData } = await supabase_1.supabaseAdmin
                        .from('tool_configurations')
                        .select('config')
                        .eq('key', 'idea_validator')
                        .maybeSingle();
                    if (configData) {
                        dynamicConfig = configData.config;
                    }
                }
                catch (err) {
                    request.log.error(err, 'Failed to load tool_configurations');
                }
                request.log.info('🤖 Extracting AI signals for merged report...');
                const signals = await (0, signal_extractor_1.extractSignals)(ideaText, answersWithDefaults, geminiKey, dynamicConfig?.prompt_templates?.signal_extraction);
                request.log.info('⚙️ Evaluating scoring rule engine for merged report...');
                const dimensionScores = (0, rule_engine_1.runRuleEngine)(signals, dynamicConfig?.rule_modifiers);
                const redFlags = (0, rule_engine_1.detectRedFlags)(signals);
                request.log.info('📊 Aggregating overall scores for merged report...');
                const aggregated = (0, score_calculator_1.calculateAggregatedScores)(dimensionScores, answersWithDefaults, redFlags.length, dynamicConfig);
                request.log.info('✍️ Generating due diligence narratives...');
                const narrativeReport = await (0, gemini_1.generateNarrative)(ideaText, answersWithDefaults, aggregated, dimensionScores, redFlags, geminiKey, dynamicConfig?.prompt_templates?.narrative_generation, competitorsOut);
                // Compile final merged payload
                const finalPayload = {
                    ...narrativeReport,
                    id: id,
                    signals,
                    answers: answersWithDefaults,
                    dimensions: narrativeReport.dimensions,
                    unlocked: true,
                    created_at: new Date().toISOString(),
                    is_mock: !geminiKey,
                    social_validation: {
                        validation_score: sveReport?.validation_score || 0,
                        verdict: sveReport?.verdict || 'Unknown',
                        reasoning: sveReport?.reasoning || 'Social validation completed with no narrative feedback.',
                        pain_points: painPointsOut,
                        competitors: competitorsOut,
                        feature_requests: featuresOut
                    }
                };
                // Update the report in dd_reports table
                const verdict = finalPayload.overall_score >= 7.5 ? 'Proceed' :
                    finalPayload.overall_score >= 4.5 ? 'Needs Work' : 'High Risk';
                const { error: dbError } = await supabase_1.supabaseAdmin
                    .from('dd_reports')
                    .update({
                    overall_score: finalPayload.overall_score,
                    verdict,
                    report_data: finalPayload,
                    is_mock: finalPayload.is_mock || false
                })
                    .eq('id', id);
                if (dbError) {
                    request.log.error(dbError, '⚠️ Failed to update compiled dd_report');
                }
                return reply.send(finalPayload);
            }
            return reply.send(reportData.report_data);
        }
        catch (err) {
            const isSve = reportData?.overall_score === null;
            request.log.error(err, isSve ? '❌ SVE report compilation error' : '❌ Get Idea Validator API error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // GET /idea-validator/status
    app.get('/idea-validator/status', async (request, reply) => {
        try {
            const { id } = request.query;
            if (!id) {
                return reply.status(400).send({ error: 'Missing project ID' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const userId = await getUserIdFromRequest(request);
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
            }
            // Check ownership by checking if the dd_reports entry has user_id matching auth userId
            const { data: existingReport, error: repError } = await supabase_1.supabaseAdmin
                .from('dd_reports')
                .select('user_id')
                .eq('id', id)
                .maybeSingle();
            if (repError || !existingReport) {
                return reply.status(404).send({ error: 'Report not found' });
            }
            if (existingReport.user_id && existingReport.user_id !== userId) {
                return reply.status(403).send({ error: 'Forbidden: You do not own this report' });
            }
            // Check SVE project status in `projects` table
            const { data, error } = await supabase_1.supabaseAdmin
                .from('projects')
                .select('status, failed_stage')
                .eq('id', id)
                .maybeSingle();
            if (error) {
                request.log.error(error, 'Supabase error fetching project status');
                return reply.status(500).send({ error: error.message });
            }
            if (!data) {
                // Fallback: check if it's already in dd_reports
                const { data: reportData } = await supabase_1.supabaseAdmin
                    .from('dd_reports')
                    .select('id')
                    .eq('id', id)
                    .maybeSingle();
                if (reportData) {
                    return reply.send({ status: 'done' });
                }
                return reply.status(404).send({ error: 'Project not found' });
            }
            return reply.send(data);
        }
        catch (err) {
            request.log.error(err, 'Get project status API error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // PUT /idea-validator (links report to user ID)
    app.put('/idea-validator', async (request, reply) => {
        try {
            const { reportId, userId } = request.body;
            if (!reportId || !userId) {
                return reply.status(400).send({ error: 'Missing reportId or userId' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const authUserId = await getUserIdFromRequest(request);
            if (!authUserId) {
                return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
            }
            if (authUserId !== userId) {
                return reply.status(403).send({ error: 'Forbidden: Cannot link report to another user' });
            }
            // Check if report exists and who owns it
            const { data: existingReport, error: fetchError } = await supabase_1.supabaseAdmin
                .from('dd_reports')
                .select('user_id')
                .eq('id', reportId)
                .maybeSingle();
            if (fetchError || !existingReport) {
                return reply.status(404).send({ error: 'Report not found' });
            }
            if (existingReport.user_id && existingReport.user_id !== userId) {
                return reply.status(403).send({ error: 'Forbidden: Report is already owned by another user' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('dd_reports')
                .update({ user_id: userId })
                .eq('id', reportId);
            if (error) {
                request.log.error(error, 'Supabase error updating dd_report user link');
                return reply.status(500).send({ error: error.message });
            }
            return reply.send({ success: true });
        }
        catch (err) {
            request.log.error(err, 'Link report user API error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /idea-validator
    app.post('/idea-validator', async (request, reply) => {
        try {
            const body = request.body;
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Database client not configured.' });
            }
            const userId = await getUserIdFromRequest(request);
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
            }
            // 1. Zod Validation
            const parsed = submitIdeaSchema.safeParse(body);
            if (!parsed.success) {
                return reply.status(400).send({ error: 'Invalid input data', details: parsed.error.format() });
            }
            const { ideaText, answers } = parsed.data;
            const isSupabaseConfigured = !!supabase_1.supabaseAdmin;
            const useMockDB = process.env.USE_MOCK_DB === 'true' || !isSupabaseConfigured;
            // SVE validation pipeline local trigger
            const sveProjectId = crypto_1.default.randomUUID();
            if (supabase_1.supabaseAdmin && !useMockDB) {
                request.log.info(`⚙️ Creating SVE project record for ID: ${sveProjectId}`);
                const { error: projectError } = await supabase_1.supabaseAdmin
                    .from('projects')
                    .insert([{
                        id: sveProjectId,
                        idea_text: ideaText,
                        idea_name: answers.contact_name || 'Anonymous',
                        target_audience: answers.customer || 'General',
                        status: 'pending'
                    }]);
                if (projectError) {
                    request.log.error(projectError, '⚠️ Failed to create SVE project in DB. Falling back to immediate due diligence.');
                }
                else {
                    // Kick off SVE pipeline in background
                    (0, social_validation_engine_1.runSvePipeline)(sveProjectId, ideaText).catch(err => {
                        request.log.error(err, `❌ SVE background pipeline failed for project ${sveProjectId}`);
                    });
                    // Save draft report record to dd_reports for polling compilation later
                    request.log.info('💾 Saving draft report to Supabase dd_reports...');
                    const { error: dbError } = await supabase_1.supabaseAdmin
                        .from('dd_reports')
                        .insert([{
                            id: sveProjectId,
                            user_id: userId === 'mock-user-id' ? null : userId,
                            overall_score: null,
                            verdict: 'Pending',
                            report_data: { ideaText, answers, status: 'pending' },
                            is_mock: false
                        }]);
                    if (dbError) {
                        request.log.error(dbError, '⚠️ Failed to save draft to dd_reports');
                    }
                    return reply.send({
                        id: sveProjectId,
                        status: 'pending'
                    });
                }
            }
            // 2. Deduplication check
            const cacheKey = `${answers.contact_email}:${ideaText.substring(0, 100)}`;
            const cached = cache.get(cacheKey);
            const now = Date.now();
            if (cached && now - cached.timestamp < 300000) {
                request.log.info('🔄 Returning deduplicated cached response...');
                return reply.send(cached.payload);
            }
            const geminiKey = process.env.GEMINI_API_KEY;
            // 3. Build answers payload with default values
            const answersWithDefaults = {
                ...answers,
                market_size_choice: answers.market_size_choice || 'medium',
                revenue_model_choice: answers.revenue_model_choice || 'subscription',
                why_now: answers.why_now || 'The timing is right due to market shifts and technological advancements.',
                has_technical_cofounder: answers.has_technical_cofounder !== undefined
                    ? answers.has_technical_cofounder
                    : (answers.solo_founder ? false : true),
            };
            // Fetch dynamic configurations from database if configured
            let dynamicConfig = null;
            if (supabase_1.supabaseAdmin && !useMockDB) {
                try {
                    const { data, error } = await supabase_1.supabaseAdmin
                        .from('tool_configurations')
                        .select('config')
                        .eq('key', 'idea_validator')
                        .maybeSingle();
                    if (!error && data) {
                        dynamicConfig = data.config;
                        request.log.info('✅ Loaded dynamic tool_configurations for idea_validator');
                    }
                }
                catch (err) {
                    request.log.error(err, 'Failed to load tool_configurations');
                }
            }
            // 4. Pass 1: Extract signals
            request.log.info('🤖 Extracting AI signals...');
            const signals = await (0, signal_extractor_1.extractSignals)(ideaText, answersWithDefaults, geminiKey, dynamicConfig?.prompt_templates?.signal_extraction);
            // 5. TS Rule Engine: Calculate dimension scores
            request.log.info('⚙️ Evaluating deterministic scoring rule engine...');
            const dimensionScores = (0, rule_engine_1.runRuleEngine)(signals, dynamicConfig?.rule_modifiers);
            // 6. Detect red flags
            const redFlags = (0, rule_engine_1.detectRedFlags)(signals);
            // 7. Score Aggregation
            request.log.info('📊 Aggregating overall scores...');
            const aggregated = (0, score_calculator_1.calculateAggregatedScores)(dimensionScores, answersWithDefaults, redFlags.length, dynamicConfig);
            // 8. Pass 2: AI Narrative generation
            request.log.info('✍️ Generating due diligence narrative explanations...');
            const narrativeReport = await (0, gemini_1.generateNarrative)(ideaText, answersWithDefaults, aggregated, dimensionScores, redFlags, geminiKey, dynamicConfig?.prompt_templates?.narrative_generation);
            const reportId = crypto_1.default.randomUUID();
            const finalPayload = {
                ...narrativeReport,
                id: reportId,
                signals,
                answers: answersWithDefaults,
                dimensions: narrativeReport.dimensions,
                unlocked: true,
                created_at: new Date().toISOString()
            };
            if (!geminiKey) {
                finalPayload.is_mock = true;
            }
            // 9. Save to Supabase dd_reports table
            if (supabase_1.supabaseAdmin && !useMockDB && body.saveToDb !== false) {
                request.log.info('💾 Saving report to Supabase dd_reports...');
                const verdict = finalPayload.overall_score >= 7.5 ? 'Proceed' :
                    finalPayload.overall_score >= 4.5 ? 'Needs Work' : 'High Risk';
                const { error: dbError } = await supabase_1.supabaseAdmin
                    .from('dd_reports')
                    .insert([{
                        id: reportId,
                        overall_score: finalPayload.overall_score,
                        verdict,
                        report_data: finalPayload,
                        is_mock: finalPayload.is_mock || false
                    }]);
                if (dbError) {
                    request.log.error(dbError, '⚠️ Failed to save to dd_reports');
                }
            }
            // Cache response
            cache.set(cacheKey, { timestamp: now, payload: finalPayload });
            return reply.send(finalPayload);
        }
        catch (err) {
            request.log.error(err, '❌ Idea Validator API error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /idea-validator/submit
    app.post('/idea-validator/submit', async (request, reply) => {
        try {
            const { report } = request.body;
            if (!report) {
                return reply.status(400).send({ error: 'Missing report data' });
            }
            if (!supabase_1.supabaseAdmin) {
                return reply.send({ success: true, message: 'Mock submit successful' });
            }
            const verdict = report.overall_score >= 7.5 ? 'Proceed' :
                report.overall_score >= 4.5 ? 'Needs Work' : 'High Risk';
            // 1. Save to dd_reports
            const { error: dbError } = await supabase_1.supabaseAdmin
                .from('dd_reports')
                .insert([{
                    id: report.id,
                    overall_score: report.overall_score,
                    verdict,
                    report_data: report,
                    is_mock: report.is_mock || false
                }]);
            if (dbError) {
                request.log.error(dbError, '⚠️ Failed to save to dd_reports');
                return reply.status(500).send({ error: dbError.message });
            }
            // 2. Save to idea_submissions as a lead
            const answers = report.answers || {};
            const ideaText = report.ideaText || '';
            const { error: subError } = await supabase_1.supabaseAdmin
                .from('idea_submissions')
                .insert([{
                    name: answers.contact_name || 'Anonymous',
                    email: answers.contact_email || 'Anonymous',
                    idea: ideaText || 'Anonymous',
                    created_at: new Date().toISOString()
                }]);
            if (subError) {
                request.log.error(subError, '⚠️ Failed to save to idea_submissions');
            }
            return reply.send({ success: true });
        }
        catch (err) {
            request.log.error(err, '❌ Submit API error');
            return reply.status(500).send({ error: err.message });
        }
    });
    // POST /idea-validator/auth
    app.post('/idea-validator/auth', async (request, reply) => {
        try {
            const { action } = request.query;
            const body = request.body;
            if (!supabase_1.supabaseAdmin) {
                return reply.status(503).send({ error: 'Auth service not configured.' });
            }
            // ── SIGN UP ──────────────────────────────────────────────────────────────
            if (action === 'signup') {
                const parsed = signupSchema.safeParse(body);
                if (!parsed.success) {
                    return reply.status(400).send({ error: 'Invalid input.', details: parsed.error.format() });
                }
                const { name, email, password } = parsed.data;
                // Use admin.createUser so the account is immediately confirmed
                const { data, error } = await supabase_1.supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                    user_metadata: { full_name: name },
                });
                if (error) {
                    if (error.message.toLowerCase().includes('already registered') ||
                        error.message.toLowerCase().includes('already been registered') ||
                        error.message.toLowerCase().includes('user already exists') ||
                        error.status === 422) {
                        return reply.status(409).send({ error: 'already_exists' });
                    }
                    return reply.status(400).send({ error: error.message });
                }
                // Sign the newly created user in to get a real session token
                const { data: sessionData, error: signInError } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError || !sessionData.session) {
                    return reply.status(500).send({ error: 'Account created but could not sign in automatically. Please log in.' });
                }
                return reply.send({
                    access_token: sessionData.session.access_token,
                    refresh_token: sessionData.session.refresh_token,
                    user: { id: data.user?.id, email, name },
                });
                // ── LOG IN ───────────────────────────────────────────────────────────────
            }
            else if (action === 'login') {
                const parsed = loginSchema.safeParse(body);
                if (!parsed.success) {
                    return reply.status(400).send({ error: 'Invalid input.', details: parsed.error.format() });
                }
                const { email, password } = parsed.data;
                const { data, error } = await supabase_1.supabaseAdmin.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.toLowerCase().includes('email not confirmed')) {
                        return reply.status(403).send({ error: 'email_not_confirmed' });
                    }
                    return reply.status(401).send({ error: 'invalid_credentials' });
                }
                if (!data.session) {
                    return reply.status(401).send({ error: 'invalid_credentials' });
                }
                return reply.send({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    user: { id: data.user?.id, email },
                });
            }
            else {
                return reply.status(400).send({ error: 'Unknown action. Use ?action=signup or ?action=login' });
            }
        }
        catch (err) {
            request.log.error(err, '❌ Auth API error');
            return reply.status(500).send({ error: 'Internal server error', message: err.message });
        }
    });
}
