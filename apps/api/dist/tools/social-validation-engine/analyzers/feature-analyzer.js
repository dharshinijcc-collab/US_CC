"use strict";
/**
 * analyzers/feature-analyzer.ts
 *
 * Uses Gemini + Google Search grounding to discover and prioritize feature
 * requests users are asking competitors to build or fix.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFeatures = analyzeFeatures;
const gemini_1 = require("../../../services/gemini");
const config_1 = require("../config");
const SYSTEM_PROMPT = `
You are a product researcher mining feature requests from competitor reviews,
Reddit threads, Product Hunt discussions, and HackerNews comments.

You will use web search to find what users are ACTIVELY ASKING competitor products
to build or fix. Focus on: review site comments, GitHub issues, Reddit complaints
about named competitors, Product Hunt reviews.

For each distinct feature request:
- feature_name: specific, actionable (e.g. 'Dark mode', 'CSV export', 'API access')
- mentions: how many distinct sources mention this
- priority: derive from mentions: >=10 = 'high', 4-9 = 'medium', 1-3 = 'low'
- Output MUST be valid JSON matching the schema.
`.trim();
const JSON_SCHEMA_HINT = `
Return ONLY a raw JSON object with no markdown fences:
{
  "feature_requests": [
    {"feature_name": "...", "mentions": 5, "priority": "medium"}
  ]
}`.trim();
async function analyzeFeatures(ideaText, competitors) {
    const ai = (0, gemini_1.requireGeminiClient)();
    const competitorNames = competitors
        .slice(0, 6)
        .map(c => c.name)
        .join(', ') || "(no competitors identified yet)";
    const userMessage = `Startup idea:\n${ideaText}\n\nKnown competitors in this space: ${competitorNames}\n\nSearch the web and find the most-requested features that users are asking these competitors (or similar tools) to build.`;
    let lastExc = null;
    let features = [];
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await (0, gemini_1.withTimeout)(ai.models.generateContent({
                model: config_1.SETTINGS.geminiModelWeb,
                contents: userMessage,
                config: {
                    systemInstruction: `${SYSTEM_PROMPT}\n\n${JSON_SCHEMA_HINT}`,
                    maxOutputTokens: 2048,
                    tools: [{ googleSearch: {} }]
                }
            }), config_1.SETTINGS.featureTimeoutMs, 'feature_analyzer');
            let raw = response.text?.trim() || "";
            raw = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) {
                throw new Error(`No JSON found in response: ${raw.substring(0, 200)}`);
            }
            const data = JSON.parse(match[0]);
            features = data.feature_requests || [];
            break;
        }
        catch (exc) {
            lastExc = exc;
            const msg = String(exc.message || exc);
            const delay = (0, gemini_1.parseRetryDelay)(msg);
            console.warn(`feature_analyzer: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    if (features.length === 0) {
        console.warn("feature_analyzer: all attempts failed, returning empty:", lastExc?.message || lastExc);
        return [];
    }
    // Enforce priority derivation from mentions for v1 (PRD §12)
    const result = features.map(f => {
        const mentions = Number(f.mentions || 1);
        let priority = 'low';
        if (mentions >= 10) {
            priority = 'high';
        }
        else if (mentions >= 4) {
            priority = 'medium';
        }
        return {
            feature_name: (f.feature_name || '').trim(),
            mentions,
            priority
        };
    });
    console.log(`feature_analyzer: found ${result.length} feature requests.`);
    return result;
}
