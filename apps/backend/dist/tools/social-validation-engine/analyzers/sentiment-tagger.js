"use strict";
/**
 * analyzers/sentiment-tagger.ts
 *
 * Tags collected social posts with buying intent, frustration level, and
 * active-search signals using Gemini.
 *
 * FIX: responseSchema now uses UPPERCASE type strings as required by
 *      @google/genai SDK (Type enum values = "OBJECT", "ARRAY", "STRING", etc.).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSentiment = tagSentiment;
const gemini_1 = require("../../../services/gemini");
const config_1 = require("../config");
const SYSTEM_PROMPT = `
You are a buying-intent and sentiment analyst reviewing social media posts.

For each post, detect:
1. buying_intent: true if the post contains phrases like:
   - 'I would pay for', 'how much would X cost', 'is there a tool that',
   - 'does anyone know of', 'willing to pay', 'I'd subscribe if',
   - 'looking for a product that', 'need a solution for'
2. frustration_level: 1 (mildly annoyed) to 5 (furious / desperate)
3. active_search: true if the person is actively hunting for a solution RIGHT NOW
Output MUST be valid JSON matching the schema.
`.trim();
// ── Schema — all type strings UPPERCASE per @google/genai SDK ─────────────────
const _SENTIMENT_SCHEMA = {
    type: 'OBJECT',
    properties: {
        tags: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    source_index: { type: 'INTEGER' },
                    buying_intent: { type: 'BOOLEAN' },
                    frustration_level: { type: 'INTEGER' },
                    active_search: { type: 'BOOLEAN' }
                },
                required: ['source_index', 'buying_intent', 'frustration_level', 'active_search']
            }
        }
    },
    required: ['tags']
};
const MAX_POST_CHARS = 300;
const MAX_POSTS = 80;
async function tagSentiment(sources) {
    const empty = { buying_intent_count: 0, active_search_count: 0, total_tagged: 0, per_source: {} };
    if (!sources || sources.length === 0)
        return empty;
    const ai = (0, gemini_1.requireGeminiClient)();
    const indexedPosts = sources.slice(0, MAX_POSTS).map((src, i) => ({
        source_index: i,
        content: (src.content || '').substring(0, MAX_POST_CHARS)
    }));
    let lastExc = null;
    let tags = [];
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await (0, gemini_1.withTimeout)(ai.models.generateContent({
                model: config_1.SETTINGS.geminiModel,
                contents: JSON.stringify(indexedPosts),
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                    responseSchema: _SENTIMENT_SCHEMA
                }
            }), config_1.SETTINGS.sentimentTimeoutMs, 'sentiment_tagger');
            const raw = response.text?.trim() || '';
            const data = JSON.parse(raw);
            tags = data.tags || [];
            break;
        }
        catch (exc) {
            lastExc = exc;
            const msg = String(exc.message || exc);
            const delay = (0, gemini_1.parseRetryDelay)(msg);
            console.warn(`sentiment_tagger: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    if (tags.length === 0) {
        console.warn('sentiment_tagger: all attempts failed, defaulting to zeros:', lastExc?.message || lastExc);
        return empty;
    }
    const idMap = {};
    sources.slice(0, MAX_POSTS).forEach((src, i) => { idMap[i] = src.id; });
    const perSource = {};
    let buyingIntentCount = 0;
    let activeSearchCount = 0;
    for (const tag of tags) {
        const idx = tag.source_index;
        if (idx === undefined || !idMap[idx])
            continue;
        const sourceId = idMap[idx];
        perSource[sourceId] = {
            buying_intent: !!tag.buying_intent,
            frustration_level: Number(tag.frustration_level || 1),
            active_search: !!tag.active_search
        };
        if (tag.buying_intent)
            buyingIntentCount++;
        if (tag.active_search)
            activeSearchCount++;
    }
    console.log(`sentiment_tagger: ${buyingIntentCount}/${sources.slice(0, MAX_POSTS).length} posts show buying intent.`);
    return {
        buying_intent_count: buyingIntentCount,
        active_search_count: activeSearchCount,
        total_tagged: tags.length,
        per_source: perSource
    };
}
