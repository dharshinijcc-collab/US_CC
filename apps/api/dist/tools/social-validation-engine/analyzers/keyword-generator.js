"use strict";
/**
 * analyzers/keyword-generator.ts
 *
 * Generates 5–10 problem-framed search keywords from a startup idea using Gemini.
 * These keywords drive the Reddit / HN / Product Hunt collectors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeywords = generateKeywords;
const gemini_1 = require("../../../services/gemini");
const config_1 = require("../config");
const SYSTEM_PROMPT = `
You are a search-query strategist helping validate startup ideas.
Your task: given a startup idea, generate 5-10 search keyword phrases that will
find Reddit posts/comments from real people complaining about, discussing, or asking for
solutions to the PROBLEM this idea solves.

Rules:
- List the 3 most important broad, 1-2 word problem search terms FIRST (e.g. 'invoice pain', 'manual billing').
- Follow them with specific, longer problem-framed phrases.
- Phrases must be problem-framed, not idea-branded.
  Good: 'invoice error help', 'accounting entry manual pain'
  Bad:  'AI invoice parser', 'automatic accounting software'
- Output MUST be valid JSON matching the schema.
`.trim();
async function generateKeywords(ideaText) {
    const ai = (0, gemini_1.requireGeminiClient)();
    let lastExc = null;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await (0, gemini_1.withTimeout)(ai.models.generateContent({
                model: config_1.SETTINGS.geminiModel,
                contents: `Idea:\n${ideaText}`,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    maxOutputTokens: 512,
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
            }), config_1.SETTINGS.keywordGenTimeoutMs, 'keyword_generator');
            const raw = response.text?.trim() || '';
            const data = JSON.parse(raw);
            const keywords = data.keywords || [];
            if (keywords.length === 0)
                throw new Error('Gemini returned an empty keyword list.');
            console.log(`keyword_generator: generated ${keywords.length} keywords.`);
            return keywords.slice(0, 10);
        }
        catch (exc) {
            lastExc = exc;
            const msg = String(exc.message || exc);
            const delay = (0, gemini_1.parseRetryDelay)(msg);
            console.warn(`keyword_generator: attempt ${attempt + 1} failed — ${msg.substring(0, 120)}. Retrying in ${delay / 1000}s…`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error(`keyword_generator failed after 3 attempts. Last: ${lastExc?.message || lastExc}`);
}
