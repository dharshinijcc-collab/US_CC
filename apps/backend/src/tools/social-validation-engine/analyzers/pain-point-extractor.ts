/**
 * analyzers/pain-point-extractor.ts
 *
 * Extracts validated user pain points from collected social posts using Gemini.
 * Returns enriched pain point objects linked back to source UUIDs.
 *
 * FIX: responseSchema now uses UPPERCASE type strings as required by
 *      @google/genai SDK (Type enum values = "OBJECT", "ARRAY", "STRING", etc.).
 */

import { requireGeminiClient, withTimeout, parseRetryDelay } from '../../../services/gemini';
import { SETTINGS } from '../config';
import { SourceRow } from '../models/types';

const SYSTEM_PROMPT = `
You are a qualitative research analyst extracting validated pain points from social media posts.

You will receive:
1. A startup idea description.
2. A JSON array of social posts, each with an index, content, and engagement score.

Your task:
- Extract distinct, specific pain points expressed by real users.
- Deduplicate: merge posts expressing the same pain into one entry.
- For each pain point, record which post indexes support it.
- Do NOT invent pain points not evidenced in the posts.
- Severity scale: 1=minor inconvenience, 5=acute blocker they'd pay to fix.
- Confidence: 0.0=inferred, 1.0=explicitly stated in multiple high-engagement posts.
- Output MUST be valid JSON matching the schema.
`.trim();

// ── Schema — all type strings UPPERCASE per @google/genai SDK ─────────────────
const _PAIN_POINT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    pain_points: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          pain_point:     { type: 'STRING'  },
          mentions:       { type: 'INTEGER' },
          severity:       { type: 'INTEGER' },
          confidence:     { type: 'NUMBER'  },
          source_indexes: { type: 'ARRAY', items: { type: 'INTEGER' } }
        },
        required: ['pain_point', 'mentions', 'severity', 'confidence', 'source_indexes']
      }
    }
  },
  required: ['pain_points']
};

const MAX_POST_CHARS = 400;
const MAX_POSTS = 80;

export async function extractPainPoints(
  ideaText: string,
  sources: SourceRow[]
): Promise<any[]> {
  if (!sources || sources.length === 0) {
    console.warn('pain_point_extractor: no sources provided, returning empty.');
    return [];
  }

  const ai = requireGeminiClient();

  // Index and truncate posts for the prompt
  const indexedPosts = sources.slice(0, MAX_POSTS).map((src, i) => ({
    index: i,
    content: (src.content || '').substring(0, MAX_POST_CHARS),
    engagement: src.engagement || 0
  }));

  const userMessage = `Startup idea:\n${ideaText}\n\nSocial posts (JSON):\n${JSON.stringify(indexedPosts)}`;

  let lastExc: any = null;
  let rawPainPoints: any[] = [];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: SETTINGS.geminiModel,
          contents: userMessage,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
            responseSchema: _PAIN_POINT_SCHEMA as any
          }
        }),
        SETTINGS.painPointTimeoutMs,
        'pain_point_extractor'
      );

      const raw = response.text?.trim() || '';
      const data = JSON.parse(raw);
      rawPainPoints = data.pain_points || [];
      break;

    } catch (exc: any) {
      lastExc = exc;
      const msg = String(exc.message || exc);
      const delay = parseRetryDelay(msg);
      console.warn(`pain_point_extractor: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  if (rawPainPoints.length === 0 && lastExc) {
    throw new Error(`pain_point_extractor failed after 3 attempts: ${lastExc.message || lastExc}`);
  }

  // Map source indexes → source UUIDs
  const idMap: Record<number, string> = {};
  sources.slice(0, MAX_POSTS).forEach((src, i) => { idMap[i] = src.id; });

  const enriched = rawPainPoints.map(pp => {
    const indexes: number[] = pp.source_indexes || [];
    const sourceIds = indexes.map(idx => idMap[idx]).filter(Boolean);
    return {
      pain_point: pp.pain_point,
      mentions:   pp.mentions || sourceIds.length,
      severity:   pp.severity,
      confidence: pp.confidence,
      source_ids: sourceIds
    };
  });

  console.log(`pain_point_extractor: extracted ${enriched.length} pain points.`);
  return enriched;
}
