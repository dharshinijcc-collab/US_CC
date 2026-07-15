/**
 * analyzers/keyword-generator.ts
 *
 * Generates 5–10 problem-framed search keywords from a startup idea using Gemini.
 * These keywords drive the Reddit / HN / Product Hunt collectors.
 */

import { requireGeminiClient, withTimeout, parseRetryDelay } from '../../../services/gemini';
import { SETTINGS } from '../config';

const SYSTEM_PROMPT = `Generate 5 short, problem-focused search query phrases for this startup idea. Output JSON: {"keywords": ["string"]}`;

export async function generateKeywords(ideaText: string): Promise<string[]> {
  const ai = requireGeminiClient();

  let lastExc: any = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: SETTINGS.geminiModel,
          contents: `Idea: ${ideaText}`,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 128,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                keywords: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                }
              },
              required: ['keywords']
            }
          }
        }),
        SETTINGS.keywordGenTimeoutMs,
        'keyword_generator'
      );

      const raw = response.text?.trim() || '';
      const data = JSON.parse(raw);
      const keywords: string[] = data.keywords || [];
      if (keywords.length === 0) throw new Error('Gemini returned an empty keyword list.');
      console.log(`keyword_generator: generated ${keywords.length} keywords.`);
      return keywords.slice(0, 10);

    } catch (exc: any) {
      lastExc = exc;
      const msg = String(exc.message || exc);
      const delay = parseRetryDelay(msg);
      console.warn(`keyword_generator: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error(`keyword_generator failed after 3 attempts. Last: ${lastExc?.message || lastExc}`);
}
