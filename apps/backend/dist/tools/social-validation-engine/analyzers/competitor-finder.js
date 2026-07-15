"use strict";
/**
 * analyzers/competitor-finder.ts
 *
 * Uses Gemini + Google Search grounding to find REAL, verifiable competitors.
 * Every returned entry must include a source_url — synthetic entries are dropped.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompetitors = findCompetitors;
const gemini_1 = require("../../../services/gemini");
const config_1 = require("../config");
const SYSTEM_PROMPT = `
You are a competitive intelligence researcher. You will use your web search tool
to find REAL, CURRENTLY-EXISTING products and companies that solve the same problem
as the given startup idea.

Critical rules:
- You MUST use the web search tool to verify every competitor.
- NEVER invent competitor names from memory alone.
- Every competitor entry MUST include a real source_url (a search result, their
  website, a Product Hunt page, a news article, etc.).
- If you cannot find a verifiable URL for a competitor, DO NOT include them.
- missing_features: list the features users are asking for that this competitor lacks
  (pull from review sites, Reddit, HackerNews, Product Hunt comments).
- confidence: 0.0 = found one mention, 1.0 = well-known product with many sources.
- Output MUST be valid JSON matching the schema.
`.trim();
const JSON_SCHEMA_HINT = `
Return ONLY a raw JSON object matching this exact structure, with no markdown fences:
{
  "competitors": [
    {"name": "...", "website": "...", "source_url": "...", "missing_features": [...], "confidence": 0.9}
  ]
}`.trim();
async function findCompetitors(ideaText, painPoints) {
    const ai = (0, gemini_1.requireGeminiClient)();
    const painSummary = painPoints
        .sort((a, b) => (b.mentions || 0) - (a.mentions || 0))
        .slice(0, 5)
        .map(pp => pp.pain_point)
        .join('; ');
    const userMessage = `Startup idea:\n${ideaText}\n\n` +
        `Top pain points found so far:\n${painSummary}\n\n` +
        `Search the web and find real existing competitors. Return only those you can verify with a real URL.`;
    let lastExc = null;
    let competitors = [];
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await (0, gemini_1.withTimeout)(ai.models.generateContent({
                model: config_1.SETTINGS.geminiModelWeb,
                contents: userMessage,
                config: {
                    systemInstruction: `${SYSTEM_PROMPT}\n\n${JSON_SCHEMA_HINT}`,
                    maxOutputTokens: 4096,
                    tools: [{ googleSearch: {} }]
                }
            }), config_1.SETTINGS.competitorTimeoutMs, 'competitor_finder');
            let raw = response.text?.trim() || '';
            // Strip markdown code fences if present
            raw = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match)
                throw new Error(`No JSON object in response: ${raw.substring(0, 200)}`);
            const data = JSON.parse(match[0]);
            competitors = data.competitors || [];
            break;
        }
        catch (exc) {
            lastExc = exc;
            const msg = String(exc.message || exc);
            const delay = (0, gemini_1.parseRetryDelay)(msg);
            console.warn(`competitor_finder: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    if (competitors.length === 0 && lastExc) {
        console.warn('competitor_finder: all attempts exhausted, returning empty:', lastExc.message || lastExc);
        return [];
    }
    // Enforce: drop any entry without a verifiable source_url
    const valid = competitors
        .filter(c => c.name && c.source_url)
        .map(c => ({
        name: c.name,
        website: c.website || null,
        source_url: c.source_url,
        missing_features: c.missing_features || [],
        confidence: c.confidence
    }));
    console.log(`competitor_finder: found ${valid.length} verified competitors.`);
    return valid;
}
