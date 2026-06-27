import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { extractSignals } from '../lib/signal-extractor';
import { runRuleEngine, detectRedFlags } from '../lib/rule-engine';
import { generateNarrative } from '../lib/gemini';
import { calculateAggregatedScores } from '../lib/score-calculator';
import { QAAnswers } from '../types/scoring';

// Input Zod Validation Schema
const submitIdeaSchema = z.object({
  ideaText: z.string().min(10).max(2000),
  answers: z.object({
    customer: z.string().min(2),
    problem: z.string().min(2),
    pain_score: z.number().min(1).max(10),
    validation_level: z.enum(['none', 'conversations', 'waitlist', 'paying_customers']),
    market_size_choice: z.enum(['small', 'medium', 'large', 'mass_market']).optional(),
    revenue_model_choice: z.enum(['subscription', 'transaction_fee', 'marketplace', 'licensing', 'advertising', 'one_time', 'other']).optional(),
    why_now: z.string().min(2).optional(),
    competitors: z.string().min(2),
    moat: z.string().min(2),
    solo_founder: z.boolean(),
    has_technical_cofounder: z.boolean().optional(),
    technical_background: z.enum(['can_code', 'used_to_code', 'no']),
    current_stage: z.enum(['forming', 'ux_design', 'prototype', 'mvp']),
    launch_timeline: z.string().min(2),
    funding_status: z.enum(['bootstrapped', 'raising', 'raised']),
    contact_name: z.string().min(2),
    contact_email: z.string().email(),
    need_help: z.boolean().optional()
  })
});

// Simple in-memory cache attached to global to persist across hot reloads in development
const globalForCache = global as unknown as {
  cache?: Map<string, { timestamp: number; payload: any }>;
};

const cache = globalForCache.cache || new Map<string, { timestamp: number; payload: any }>();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.cache = cache;
}

// File-system cache fallback for mock DB mode
const CACHE_DIR = path.join(process.cwd(), 'app', 'founder', 'idea-validator', '.cache');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const parsed = submitIdeaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input data', details: parsed.error.format() }, { status: 400 });
    }

    const { ideaText, answers } = parsed.data;

    // 2. Deduplication check
    const cacheKey = `${answers.contact_email}:${ideaText.substring(0, 100)}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < 300000) {
      console.log('🔄 Returning deduplicated cached response...');
      return NextResponse.json(cached.payload);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const useMockDB = process.env.USE_MOCK_DB === 'true' || !supabaseUrl || !supabaseServiceKey;

    // 3. Setup Supabase admin client for server-side operations
    const supabaseAdmin = useMockDB ? null : createClient(supabaseUrl!, supabaseServiceKey!);

    // 4. No manual user lookup needed — auth handled by Supabase Auth + profiles trigger
    let userId: string | null = null;
    // (user_id will be linked when client calls the save endpoint after auth)

    // 5. Build answers payload with default values for omitted fields
    const answersWithDefaults: QAAnswers = {
      ...answers,
      market_size_choice: answers.market_size_choice || 'medium',
      revenue_model_choice: answers.revenue_model_choice || 'subscription',
      why_now: answers.why_now || 'The timing is right due to market shifts and technological advancements.',
      has_technical_cofounder: answers.has_technical_cofounder !== undefined 
        ? answers.has_technical_cofounder 
        : (answers.solo_founder ? false : true),
    };

    // 6. Pass 1: Extract signals (using Gemini API or dynamic Mock generator)
    console.log('🤖 Extracting AI signals...');
    const signals = await extractSignals(ideaText, answersWithDefaults, geminiKey);

    // 7. TS Rule Engine: Calculate dimension scores
    console.log('⚙️ Evaluating deterministic scoring rule engine...');
    const dimensionScores = runRuleEngine(signals);

    // 8. Detect red flags
    const redFlags = detectRedFlags(signals);

    // 9. Score Aggregation
    console.log('📊 Aggregating overall scores...');
    const aggregated = calculateAggregatedScores(dimensionScores, answersWithDefaults, redFlags.length);

    // 10. Pass 2: AI Narrative generation (prose explaining the scores)
    console.log('✍️ Generating due diligence narrative explanations...');
    const narrativeReport = await generateNarrative(
      ideaText,
      answersWithDefaults,
      aggregated,
      dimensionScores,
      redFlags,
      geminiKey
    );

    const reportId = crypto.randomUUID();

    const finalPayload = {
      ...narrativeReport,
      id: reportId,
      signals,
      answers: answersWithDefaults,
      dimensions: narrativeReport.dimensions,
      unlocked: true,
      created_at: new Date().toISOString()
    };

    // Return is_mock inside payload (if no API Key, narrativeReport.is_mock is already true)
    if (!geminiKey) {
      finalPayload.is_mock = true;
    }

    // 11. Save to Supabase dd_reports table
    if (supabaseAdmin) {
      console.log('💾 Saving report to Supabase dd_reports...');
      const verdict =
        finalPayload.overall_score >= 7.5 ? 'Proceed' :
        finalPayload.overall_score >= 4.5 ? 'Needs Work' : 'High Risk';

      const { error: dbError } = await supabaseAdmin
        .from('dd_reports')
        .insert([{
          id: reportId,
          overall_score: finalPayload.overall_score,
          verdict,
          report_data: finalPayload,
          is_mock: !geminiKey
          // user_id is null here — linked after user logs in on client
        }]);

      if (dbError) {
        console.error('⚠️ Failed to save to dd_reports:', dbError);
      }
    }

    // Save to deduplication cache and id cache
    cache.set(reportId, { timestamp: now, payload: finalPayload });
    cache.set(cacheKey, { timestamp: now, payload: finalPayload });

    // File cache backup write for HMR survival in mock DB mode
    try {
      ensureCacheDir();
      fs.writeFileSync(path.join(CACHE_DIR, `${reportId}.json`), JSON.stringify(finalPayload, null, 2));
    } catch (fsErr) {
      console.error('⚠️ File cache write failed:', fsErr);
    }

    return NextResponse.json(finalPayload);
  } catch (error: any) {
    console.error('❌ Scoring API endpoint error:', error);
    return NextResponse.json({ error: 'Internal scoring server error', message: error.message }, { status: 500 });
  }
}

async function generateDynamicFallbackReport(id: string) {
  const ideaText = "AI-powered HOA management software that automates compliance, billing, and resident communication.";
  const answers: QAAnswers = {
    customer: "Homeowners Associations (HOAs)",
    problem: "Manual overhead, delayed resident communication, and tracking late dues.",
    pain_score: 8,
    validation_level: "conversations",
    market_size_choice: "large",
    revenue_model_choice: "subscription",
    why_now: "Rising HOA fees and demand for modern digital transparency.",
    competitors: "AppFolio, TownSq, HOA Start",
    moat: "Proprietary automated compliance violation auto-detection engine.",
    solo_founder: false,
    has_technical_cofounder: true,
    technical_background: "can_code",
    current_stage: "ux_design",
    launch_timeline: "3_months",
    funding_status: "bootstrapped",
    contact_name: "John Doe",
    contact_email: "founder@example.com",
    need_help: true
  };

  const geminiKey = process.env.GEMINI_API_KEY;
  const signals = await extractSignals(ideaText, answers, geminiKey);
  const dimensionScores = runRuleEngine(signals);
  const redFlags = detectRedFlags(signals);
  const aggregated = calculateAggregatedScores(dimensionScores, answers, redFlags.length);
  const narrativeReport = await generateNarrative(
    ideaText,
    answers,
    aggregated,
    dimensionScores,
    redFlags,
    geminiKey
  );

  const finalPayload = {
    ...narrativeReport,
    id,
    signals,
    answers,
    dimensions: narrativeReport.dimensions,
    unlocked: true,
    created_at: new Date().toISOString()
  };

  if (!geminiKey) {
    finalPayload.is_mock = true;
  }

  // Save to memory cache and file system cache
  cache.set(id, { timestamp: Date.now(), payload: finalPayload });
  try {
    ensureCacheDir();
    fs.writeFileSync(path.join(CACHE_DIR, `${id}.json`), JSON.stringify(finalPayload, null, 2));
  } catch (fsErr) {
    console.error('⚠️ File cache write failed for fallback:', fsErr);
  }

  return finalPayload;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
    }

    // 1. Check in-memory cache first
    const cached = cache.get(id);
    if (cached) {
      console.log('🔄 Returning cached report from memory...');
      return NextResponse.json(cached.payload);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const useMockDB = process.env.USE_MOCK_DB === 'true' || !supabaseUrl || !supabaseServiceKey;

    if (useMockDB) {
      // 2. Check file-system cache backup before giving up in mock DB mode
      try {
        const filePath = path.join(CACHE_DIR, `${id}.json`);
        if (fs.existsSync(filePath)) {
          console.log('💾 Returning cached report from file-system...');
          const fileData = fs.readFileSync(filePath, 'utf-8');
          const payload = JSON.parse(fileData);
          // Restore to memory cache
          cache.set(id, { timestamp: Date.now(), payload });
          return NextResponse.json(payload);
        }
      } catch (fsErr) {
        console.error('⚠️ File cache read failed:', fsErr);
      }
      
      console.log('⚠️ Report not found in cache, generating dynamic mock fallback for ID:', id);
      try {
        const fallbackReport = await generateDynamicFallbackReport(id);
        return NextResponse.json(fallbackReport);
      } catch (genErr: any) {
        console.error('⚠️ Fallback generation failed:', genErr);
        return NextResponse.json({ error: 'Report not found in cache (running in mock DB mode)' }, { status: 404 });
      }
    }

    // 2. Fetch from Supabase
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
    const { data, error } = await supabaseAdmin
      .from('scoring_results')
      .select('report')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('⚠️ Failed to fetch report from Supabase:', error);
      return NextResponse.json({ error: 'Report not found in database' }, { status: 404 });
    }

    // Return the stored report JSON payload
    return NextResponse.json(data.report);
  } catch (error: any) {
    console.error('❌ GET API endpoint error:', error);
    return NextResponse.json({ error: 'Failed to retrieve report', message: error.message }, { status: 500 });
  }
}
