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
  console.log(`pipeline: starting project_id=${projectId}`);

  // ── Module 2: Keyword Generation ─────────────────────────────────────────
  let keywords: string[] = [];
  try {
    keywords = await generateKeywords(ideaText);
    console.log(`pipeline: ${keywords.length} keywords generated.`);
  } catch (exc: any) {
    console.error("pipeline: keyword_generator failed:", exc.message || exc);
    await setStatus(projectId, "failed", "keyword_generator");
    return;
  }

  // ── Module 3: Reddit Collection ───────────────────────────────────────────
  await setStatus(projectId, "collecting");
  let sourceRows: SourceRow[] = [];
  try {
    const rawPosts = await collectPosts(keywords);
    sourceRows = await insertSources(projectId, rawPosts);
    console.log(`pipeline: ${sourceRows.length} source rows inserted.`);
  } catch (exc: any) {
    console.error("pipeline: reddit_collector failed:", exc.message || exc);
    await setStatus(projectId, "failed", "reddit_collector");
    return;
  }

  if (sourceRows.length === 0) {
    console.warn("pipeline: no sources collected — marking as failed.");
    await setStatus(projectId, "failed", "reddit_collector");
    return;
  }

  await setStatus(projectId, "analyzing");

  // ── Module 4: Pain Point Extraction ──────────────────────────────────────
  let painPointsRaw: any[] = [];
  try {
    painPointsRaw = await extractPainPoints(ideaText, sourceRows);
    const insertedPps = await insertPainPoints(projectId, painPointsRaw);
    console.log(`pipeline: ${insertedPps.length} pain points inserted.`);
  } catch (exc: any) {
    console.error("pipeline: pain_point_extractor failed:", exc.message || exc);
    await setStatus(projectId, "failed", "pain_point_extractor");
    return;
  }

  // ── Module 5: Sentiment / Buying-Intent Tagging ───────────────────────────
  let sentiment: any = null;
  try {
    sentiment = await tagSentiment(sourceRows);
  } catch (exc: any) {
    console.warn("pipeline: sentiment_tagger failed (non-fatal), defaulting:", exc.message || exc);
    sentiment = {
      buying_intent_count: 0,
      active_search_count: 0,
      total_tagged: 0,
      per_source: {}
    };
  }

  // ── Module 6: Competitor Discovery ───────────────────────────────────────
  let competitorsRaw: any[] = [];
  try {
    competitorsRaw = await findCompetitors(ideaText, painPointsRaw);
    const insertedCompetitors = await insertCompetitors(projectId, competitorsRaw);
    console.log(`pipeline: ${insertedCompetitors.length} competitors inserted.`);
  } catch (exc: any) {
    console.warn("pipeline: competitor_finder failed (non-fatal), continuing with empty:", exc.message || exc);
    competitorsRaw = [];
  }

  // ── Module 7: Feature Request Analysis ───────────────────────────────────
  let featuresRaw: any[] = [];
  try {
    featuresRaw = await analyzeFeatures(ideaText, competitorsRaw);
    await insertFeatures(projectId, featuresRaw);
    console.log(`pipeline: ${featuresRaw.length} feature requests inserted.`);
  } catch (exc: any) {
    console.warn("pipeline: feature_analyzer failed (non-fatal), skipping:", exc.message || exc);
    featuresRaw = [];
  }

  // ── Module 8: Validation Scoring ─────────────────────────────────────────
  try {
    const scoreResult = computeValidationScore(
      painPointsRaw,
      sentiment,
      competitorsRaw,
      featuresRaw,
      sourceRows
    );
    await insertReport(projectId, scoreResult);
    console.log(`pipeline: report saved. score=${scoreResult.validation_score} verdict='${scoreResult.verdict}'`);
  } catch (exc: any) {
    console.error("pipeline: validation_engine/report failed:", exc.message || exc);
    await setStatus(projectId, "failed", "validation_engine");
    return;
  }

  await setStatus(projectId, "done");
  console.log(`pipeline: project_id=${projectId} complete.`);
}
