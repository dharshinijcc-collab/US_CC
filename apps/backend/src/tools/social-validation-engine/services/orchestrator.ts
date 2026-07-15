import { supabaseAdmin } from '../../../services/supabase';
import { generateKeywords } from '../analyzers/keyword-generator';
import { collectPosts } from '../collectors';
import { extractPainPoints } from '../analyzers/pain-point-extractor';
import { tagSentiment } from '../analyzers/sentiment-tagger';
import { findCompetitors } from '../analyzers/competitor-finder';
import { analyzeFeatures } from '../analyzers/feature-analyzer';
import { computeValidationScore } from './validation-engine';
import { SourceRow } from '../models/types';

async function setStatus(projectId: string, status: string, failedStage?: string): Promise<void> {
  // Supabase DB CHECK constraint only permits: pending | done | failed.
  const allowed = ["pending", "done", "failed"];
  if (!allowed.includes(status)) {
    console.debug(`orchestrator: skipping intermediate status '${status}' (not in DB CHECK constraint)`);
    return;
  }

  if (!supabaseAdmin) {
    console.warn(`orchestrator: supabase client is not configured, cannot set status to ${status}`);
    return;
  }

  const payload: Record<string, any> = { status, updated_at: new Date().toISOString() };
  if (failedStage) {
    payload.failed_stage = failedStage;
  }

  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .update(payload)
      .eq('id', projectId);

    if (error) throw error;
  } catch (err) {
    console.warn(`orchestrator: failed to update status to ${status}:`, err);
  }
}

// In-memory status store to avoid Supabase DB schema undefined column errors
export const sveStatusStore = new Map<string, { current_stage: string }>();

async function setStage(projectId: string, stage: string): Promise<void> {
  sveStatusStore.set(projectId, { current_stage: stage });
}

async function insertSources(projectId: string, rawPosts: any[]): Promise<SourceRow[]> {
  if (!rawPosts || rawPosts.length === 0) return [];
  if (!supabaseAdmin) return [];

  const rows = rawPosts.map(p => ({
    project_id: projectId,
    platform: p.platform,
    url: p.url,
    content: p.content,
    engagement: p.engagement,
    posted_at: p.posted_at,
    collected_at: new Date().toISOString()
  }));

  const { data, error } = await supabaseAdmin
    .from('sources')
    .insert(rows)
    .select();

  if (error) throw error;
  return (data || []) as SourceRow[];
}

async function insertPainPoints(projectId: string, painPoints: any[]): Promise<any[]> {
  if (!painPoints || painPoints.length === 0) return [];
  if (!supabaseAdmin) return [];

  const rows = painPoints.map(pp => ({
    project_id: projectId,
    pain_point: pp.pain_point,
    mentions: pp.mentions,
    severity: pp.severity,
    confidence: pp.confidence
  }));

  const { data: inserted, error } = await supabaseAdmin
    .from('pain_points')
    .insert(rows)
    .select();

  if (error) throw error;

  // Populate join table - map inserted UUID back to source_ids
  const joinRows: any[] = [];
  for (let i = 0; i < (inserted || []).length; i++) {
    const insertedPp = inserted[i];
    const originalPp = painPoints[i];
    const sourceIds = originalPp.source_ids || [];
    for (const sourceId of sourceIds) {
      joinRows.push({
        pain_point_id: insertedPp.id,
        source_id: sourceId
      });
    }
  }

  if (joinRows.length > 0) {
    const { error: joinError } = await supabaseAdmin
      .from('pain_point_sources')
      .insert(joinRows);
    if (joinError) console.error("orchestrator: failed to insert pain_point_sources:", joinError);
  }

  return inserted || [];
}

async function insertCompetitors(projectId: string, competitors: any[]): Promise<any[]> {
  if (!competitors || competitors.length === 0) return [];
  if (!supabaseAdmin) return [];

  const rows = competitors.map(c => ({
    project_id: projectId,
    name: c.name,
    website: c.website,
    source_url: c.source_url,
    missing_features: c.missing_features,
    confidence: c.confidence
  }));

  const { data, error } = await supabaseAdmin
    .from('competitors')
    .insert(rows)
    .select();

  if (error) throw error;
  return data || [];
}

async function insertFeatures(projectId: string, features: any[]): Promise<any[]> {
  if (!features || features.length === 0) return [];
  if (!supabaseAdmin) return [];

  const rows = features.map(f => ({
    project_id: projectId,
    feature_name: f.feature_name,
    mentions: f.mentions,
    priority: f.priority
  }));

  const { data, error } = await supabaseAdmin
    .from('features')
    .insert(rows)
    .select();

  if (error) throw error;
  return data || [];
}

async function insertReport(projectId: string, scoreResult: any): Promise<void> {
  if (!supabaseAdmin) return;
  const { error } = await supabaseAdmin
    .from('reports')
    .insert([{
      project_id: projectId,
      validation_score: scoreResult.validation_score,
      verdict: scoreResult.verdict,
      reasoning: scoreResult.reasoning
    }]);

  if (error) throw error;
}

export async function runPipeline(projectId: string, ideaText: string): Promise<void> {
  const pipelineStart = Date.now();
  const elapsed = () => `+${((Date.now() - pipelineStart) / 1000).toFixed(1)}s`;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 [SVE] Pipeline START  project_id=${projectId}`);
  console.log(`${'='.repeat(60)}`);

  // ── Stage 1: Keyword Generation ────────────────────────────────────────────
  let keywords: string[] = [];
  const kwStart = Date.now();
  await setStage(projectId, 'keyword_generation');
  console.log(`\n[${elapsed()}] 🔑 STAGE 1: Keyword Generation — calling Gemini...`);
  try {
    keywords = await generateKeywords(ideaText);
    const kwMs = Date.now() - kwStart;
    console.log(`[${elapsed()}] ✅ STAGE 1 DONE in ${kwMs}ms`);
    console.log(`[${elapsed()}]    📝 ${keywords.length} keywords generated:`);
    keywords.forEach((kw, i) => console.log(`[${elapsed()}]       ${i + 1}. "${kw}"`));
  } catch (exc: any) {
    console.error(`[${elapsed()}] ❌ STAGE 1 FAILED after ${Date.now() - kwStart}ms:`, exc.message || exc);
    await setStatus(projectId, 'failed', 'keyword_generator');
    return;
  }

  // ── Stage 2: Post Collection (Reddit + HN + ProductHunt) ──────────────────
  await setStatus(projectId, 'collecting');
  await setStage(projectId, 'collecting');
  let sourceRows: SourceRow[] = [];
  const collectStart = Date.now();
  console.log(`\n[${elapsed()}] 📡 STAGE 2: Post Collection — scraping Reddit, HN, ProductHunt in parallel...`);
  try {
    const rawPosts = await collectPosts(keywords);
    sourceRows = await insertSources(projectId, rawPosts);
    const collectMs = Date.now() - collectStart;
    console.log(`[${elapsed()}] ✅ STAGE 2 DONE in ${collectMs}ms`);
    console.log(`[${elapsed()}]    📊 Total unique sources collected: ${sourceRows.length}`);
  } catch (exc: any) {
    console.error(`[${elapsed()}] ❌ STAGE 2 FAILED after ${Date.now() - collectStart}ms:`, exc.message || exc);
    await setStatus(projectId, 'failed', 'reddit_collector');
    return;
  }

  if (sourceRows.length === 0) {
    console.warn(`[${elapsed()}] ⚠️  STAGE 2: Zero sources collected across all platforms.`);
    console.warn(`[${elapsed()}]    This usually means Reddit has no credentials set AND HN/PH returned no results.`);
    console.warn(`[${elapsed()}]    Marking project as FAILED at reddit_collector stage.`);
    await setStatus(projectId, 'failed', 'reddit_collector');
    return;
  }

  await setStatus(projectId, 'analyzing');
  await setStage(projectId, 'extracting_pain_points');

  // ── Stage 3: Pain Point Extraction ────────────────────────────────────────
  let painPointsRaw: any[] = [];
  const ppStart = Date.now();
  console.log(`\n[${elapsed()}] 🧠 STAGE 3: Pain Point Extraction — sending ${sourceRows.length} posts to Gemini...`);
  try {
    painPointsRaw = await extractPainPoints(ideaText, sourceRows);
    const insertedPps = await insertPainPoints(projectId, painPointsRaw);
    const ppMs = Date.now() - ppStart;
    console.log(`[${elapsed()}] ✅ STAGE 3 DONE in ${ppMs}ms`);
  } catch (exc: any) {
    console.error(`[${elapsed()}] ❌ STAGE 3 FAILED after ${Date.now() - ppStart}ms:`, exc.message || exc);
    await setStatus(projectId, 'failed', 'pain_point_extractor');
    return;
  }

  // ── Stage 4: Sentiment Tagging ────────────────────────────────────────────
  await setStage(projectId, 'sentiment_tagging');
  let sentiment: any = null;
  const sentStart = Date.now();
  console.log(`\n[${elapsed()}] 💬 STAGE 4: Sentiment Tagging — analyzing buying intent...`);
  try {
    sentiment = await tagSentiment(sourceRows);
    const sentMs = Date.now() - sentStart;
    console.log(`[${elapsed()}] ✅ STAGE 4 DONE in ${sentMs}ms`);
  } catch (exc: any) {
    console.warn(`[${elapsed()}] ⚠️  STAGE 4 FAILED (non-fatal) after ${Date.now() - sentStart}ms — defaulting to zeros:`, exc.message || exc);
    sentiment = { buying_intent_count: 0, active_search_count: 0, total_tagged: 0, per_source: {} };
  }

  // ── Stage 5: Competitor Discovery ─────────────────────────────────────────
  await setStage(projectId, 'competitor_discovery');
  let competitorsRaw: any[] = [];
  const compStart = Date.now();
  console.log(`\n[${elapsed()}] 🏆 STAGE 5: Competitor Discovery — Gemini web search grounding...`);
  try {
    competitorsRaw = await findCompetitors(ideaText, painPointsRaw);
    const insertedCompetitors = await insertCompetitors(projectId, competitorsRaw);
    const compMs = Date.now() - compStart;
    console.log(`[${elapsed()}] ✅ STAGE 5 DONE in ${compMs}ms`);
  } catch (exc: any) {
    console.warn(`[${elapsed()}] ⚠️  STAGE 5 FAILED (non-fatal) after ${Date.now() - compStart}ms:`, exc.message || exc);
    competitorsRaw = [];
  }

  // ── Stage 6: Feature Request Analysis ─────────────────────────────────────
  await setStage(projectId, 'feature_mapping');
  let featuresRaw: any[] = [];
  const featStart = Date.now();
  console.log(`\n[${elapsed()}] ✨ STAGE 6: Feature Request Analysis — Gemini web search grounding...`);
  try {
    featuresRaw = await analyzeFeatures(ideaText, competitorsRaw);
    await insertFeatures(projectId, featuresRaw);
    const featMs = Date.now() - featStart;
    console.log(`[${elapsed()}] ✅ STAGE 6 DONE in ${featMs}ms`);
  } catch (exc: any) {
    console.warn(`[${elapsed()}] ⚠️  STAGE 6 FAILED (non-fatal) after ${Date.now() - featStart}ms:`, exc.message || exc);
    featuresRaw = [];
  }

  // ── Stage 7: Validation Scoring ────────────────────────────────────────────
  await setStage(projectId, 'scoring');
  const scoreStart = Date.now();
  console.log(`\n[${elapsed()}] 📊 STAGE 7: Computing Validation Score...`);
  try {
    const scoreResult = computeValidationScore(painPointsRaw, sentiment, competitorsRaw, featuresRaw, sourceRows);
    await insertReport(projectId, scoreResult);
    const scoreMs = Date.now() - scoreStart;
    const totalMs = Date.now() - pipelineStart;
    console.log(`[${elapsed()}] ✅ STAGE 7 DONE in ${scoreMs}ms`);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎉 [SVE] Pipeline COMPLETE  project_id=${projectId}`);
    console.log(`   Score:   ${scoreResult.validation_score}/100`);
    console.log(`   Verdict: ${scoreResult.verdict}`);
    console.log(`   Total time: ${(totalMs / 1000).toFixed(1)}s`);
    console.log(`${'='.repeat(60)}\n`);
  } catch (exc: any) {
    console.error(`[${elapsed()}] ❌ STAGE 7 FAILED after ${Date.now() - scoreStart}ms:`, exc.message || exc);
    await setStatus(projectId, 'failed', 'validation_engine');
    return;
  }

  await setStatus(projectId, 'done');
}


