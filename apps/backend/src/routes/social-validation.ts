import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { runPipeline, sveStatusStore } from '../tools/social-validation-engine/services/orchestrator';

// ─── Supabase admin client ─────────────────────────────────────────────────────
const supabaseAdmin =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

// ─── Routes ───────────────────────────────────────────────────────────────────

export default async function socialValidationRoutes(app: FastifyInstance) {

  // ── POST /social-validation ──────────────────────────────────────────────────
  // Accepts: { ideaText, ideaName, targetAudience, contactName, contactEmail }
  // Returns: { id, status: 'pending' } — starts background SVE pipeline
  app.post('/social-validation', async (request, reply) => {
    try {
      const body = request.body as any;

      const {
        ideaText,
        ideaName,
        targetAudience,
        contactName,
        contactEmail
      } = body;

      if (!ideaText || String(ideaText).trim().length < 20) {
        return reply.status(400).send({ error: 'ideaText must be at least 20 characters.' });
      }

      const projectId = crypto.randomUUID();

      if (supabaseAdmin) {
        // 1. Create project record
        const { error: projectError } = await supabaseAdmin
          .from('projects')
          .insert([{
            id: projectId,
            idea_text: ideaText,
            idea_name: ideaName || contactName || 'Unnamed Idea',
            target_audience: targetAudience || 'General Audience',
            status: 'pending'
          }]);

        if (projectError) {
          request.log.error(projectError, '⚠️ Failed to create SVE project in DB.');
          return reply.status(500).send({ error: 'Failed to create SVE project record.' });
        }

        // 2. Create placeholder dd_reports entry (overall_score null = pending SVE)
        const { error: dbError } = await supabaseAdmin
          .from('dd_reports')
          .insert([{
            id: projectId,
            user_id: null,
            overall_score: null,
            verdict: 'Pending',
            report_data: {
              ideaText,
              ideaName,
              targetAudience,
              contactName: contactName || 'Anonymous',
              contactEmail: contactEmail || 'anonymous@crestcode.com',
              status: 'pending',
              toolType: 'social-validation'
            },
            is_mock: false
          }]);

        if (dbError) {
          request.log.error(dbError, '⚠️ Failed to create dd_reports placeholder.');
        }

        // 3. Kick off SVE background pipeline (fire-and-forget)
        runPipeline(projectId, ideaText).catch((err: any) => {
          request.log.error(err, `❌ SVE background pipeline failed for project ${projectId}`);
        });

        return reply.send({ id: projectId, status: 'pending' });
      }

      // ── Fallback: Supabase not configured — return mock immediately ────────────
      return reply.send({
        id: projectId,
        status: 'done',
        social_validation: {
          validation_score: 74,
          verdict: 'Moderate Demand',
          reasoning: 'Simulated SVE (no DB): Decent interest found in relevant online communities.',
          pain_points: [
            { pain_point: 'No structured feedback loop for indie devs', mentions: 12, severity: 4, confidence: 0.88, sources: [] },
            { pain_point: 'Bug prioritization is manual and time-consuming', mentions: 8, severity: 3, confidence: 0.75, sources: [] }
          ],
          competitors: [
            { name: 'UserVoice', website: 'https://uservoice.com', source_url: '', missing_features: ['In-game SDK', 'AI severity triage'], confidence: 0.8 }
          ],
          feature_requests: [
            { feature_name: 'Slack Integration for bug alerts', mentions: 9, priority: 'high' },
            { feature_name: 'One-click in-game survey widget', mentions: 6, priority: 'medium' }
          ]
        }
      });

    } catch (err: any) {
      request.log.error(err, '❌ POST /social-validation error');
      return reply.status(500).send({ error: err.message });
    }
  });

  // ── GET /social-validation/status ─────────────────────────────────────────────
  // Query: ?id=<projectId>
  // Returns: { status: 'pending' | 'done' | 'failed', failed_stage? }
  app.get('/social-validation/status', async (request, reply) => {
    try {
      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ error: 'Missing project ID.' });
      }

      if (!supabaseAdmin) {
        return reply.send({ status: 'done' }); // mock fallback
      }

      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('status, failed_stage')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        request.log.error(error, 'Supabase error fetching SVE project status');
        return reply.status(500).send({ error: error.message });
      }

      if (!data) {
        // Maybe it was already compiled — check dd_reports
        const { data: reportData } = await supabaseAdmin
          .from('dd_reports')
          .select('id, overall_score')
          .eq('id', id)
          .maybeSingle();

        if (reportData && reportData.overall_score !== null) {
          return reply.send({ status: 'done' });
        }
        return reply.status(404).send({ error: 'SVE project not found.' });
      }

      const inMemory = sveStatusStore.get(id);

      return reply.send({
        status: data.status,
        failed_stage: data.failed_stage,
        current_stage: inMemory?.current_stage || null
      });
    } catch (err: any) {
      request.log.error(err, '❌ GET /social-validation/status error');
      return reply.status(500).send({ error: err.message });
    }
  });

  // ── GET /social-validation ─────────────────────────────────────────────────────
  // Query: ?id=<projectId>
  // Returns: compiled SVE report with pain_points, competitors, feature_requests
  app.get('/social-validation', async (request, reply) => {
    try {
      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ error: 'Missing project ID.' });
      }

      if (!supabaseAdmin) {
        return reply.status(503).send({ error: 'Database not configured.' });
      }

      // 1. Check project is done
      const { data: projectRow } = await supabaseAdmin
        .from('projects')
        .select('status')
        .eq('id', id)
        .maybeSingle();

      if (!projectRow) {
        return reply.status(404).send({ error: 'SVE project not found.' });
      }

      if (projectRow.status !== 'done') {
        return reply.status(425).send({ error: `SVE project is still in status: ${projectRow.status}` });
      }

      // 2. Fetch SVE report record
      const { data: sveReport } = await supabaseAdmin
        .from('reports')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // 3. Fetch pain points with source URLs
      const { data: pps } = await supabaseAdmin
        .from('pain_points')
        .select('*')
        .eq('project_id', id);

      const painPointsOut = [];
      for (const pp of (pps || [])) {
        const { data: joinRows } = await supabaseAdmin
          .from('pain_point_sources')
          .select('source_id')
          .eq('pain_point_id', pp.id);

        const sourceIds = (joinRows || []).map((r: any) => r.source_id);
        let urls: string[] = [];
        if (sourceIds.length > 0) {
          const { data: srcRows } = await supabaseAdmin
            .from('sources')
            .select('url')
            .in('id', sourceIds);
          urls = (srcRows || []).map((s: any) => s.url);
        }
        painPointsOut.push({
          pain_point: pp.pain_point,
          mentions: pp.mentions,
          severity: pp.severity,
          confidence: pp.confidence,
          sources: urls
        });
      }

      // 4. Fetch competitors
      const { data: comps } = await supabaseAdmin
        .from('competitors')
        .select('*')
        .eq('project_id', id);

      const competitorsOut = (comps || []).map((c: any) => ({
        name: c.name,
        website: c.website,
        source_url: c.source_url,
        missing_features: c.missing_features || [],
        confidence: c.confidence
      }));

      // 5. Fetch feature requests
      const { data: feats } = await supabaseAdmin
        .from('features')
        .select('*')
        .eq('project_id', id)
        .order('mentions', { ascending: false });

      const featuresOut = (feats || []).map((f: any) => ({
        feature_name: f.feature_name,
        mentions: f.mentions,
        priority: f.priority
      }));

      // 6. Compile final payload
      const finalPayload = {
        id,
        created_at: new Date().toISOString(),
        social_validation: {
          validation_score: sveReport?.validation_score || 0,
          verdict: sveReport?.verdict || 'Unknown',
          reasoning: sveReport?.reasoning || 'Social validation completed.',
          pain_points: painPointsOut,
          competitors: competitorsOut,
          feature_requests: featuresOut
        }
      };

      // 7. Update dd_reports with compiled result
      await supabaseAdmin
        .from('dd_reports')
        .update({
          overall_score: sveReport?.validation_score || 0,
          verdict: sveReport?.verdict || 'Done',
          report_data: finalPayload,
          is_mock: false
        })
        .eq('id', id);

      return reply.send(finalPayload);
    } catch (err: any) {
      request.log.error(err, '❌ GET /social-validation error');
      return reply.status(500).send({ error: err.message });
    }
  });
}
