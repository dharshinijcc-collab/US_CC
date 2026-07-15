"use strict";
/**
 * tools/social-validation-engine/config.ts
 *
 * All SVE configuration in one place.
 * Model names are driven by environment variables — change them in .env,
 * not here.  Business logic should import SETTINGS (not GEMINI_MODELS
 * directly) so this file remains the single source of truth for SVE tuning.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = exports.VERDICT_BANDS = exports.SCORING_WEIGHTS = void 0;
const gemini_1 = require("../../services/gemini");
// ─── Scoring weights ──────────────────────────────────────────────────────────
exports.SCORING_WEIGHTS = {
    pain_point_frequency: 0.30,
    buying_intent: 0.25,
    competitor_weakness: 0.20,
    feature_demand: 0.15,
    market_activity: 0.10,
};
// ─── Verdict bands ────────────────────────────────────────────────────────────
exports.VERDICT_BANDS = [
    [70, 100, 'Strong opportunity'],
    [40, 69, 'Needs more digging'],
    [0, 39, 'Weak signal'],
];
// ─── Runtime settings ─────────────────────────────────────────────────────────
exports.SETTINGS = {
    // Model names — resolved from env vars via centralized service
    geminiModel: gemini_1.GEMINI_MODELS.standard, // GEMINI_MODEL env var
    geminiModelWeb: gemini_1.GEMINI_MODELS.search, // GEMINI_MODEL_WEB env var
    // Reddit collection
    redditPostsPerKeyword: 25,
    redditMinEngagement: 2,
    redditTopCommentsLimit: 5,
    redditMaxRetries: 3,
    // Gemini timeouts (milliseconds)
    keywordGenTimeoutMs: 20_000, // 20 s
    painPointTimeoutMs: 50_000, // 50 s  (large prompt)
    sentimentTimeoutMs: 50_000, // 50 s  (large prompt)
    competitorTimeoutMs: 60_000, // 60 s  (search-grounded)
    featureTimeoutMs: 60_000, // 60 s  (search-grounded)
};
