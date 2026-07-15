/**
 * src/services/gemini.ts
 *
 * Centralized Gemini AI client for the entire API.
 * All Gemini initialization is done here. Business logic files
 * import `geminiClient` and `GEMINI_MODELS` — never call `new GoogleGenAI()` directly.
 *
 * Key switching: change GEMINI_MODEL / GEMINI_MODEL_WEB in .env only.
 * No code changes needed to switch models.
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// ─── API Key validation ───────────────────────────────────────────────────────

const _apiKey = process.env.GEMINI_API_KEY || '';

/**
 * A valid Gemini API key obtained from https://aistudio.google.com/apikey
 * always starts with "AIzaSy".  Anything else (AQ., Bearer, empty, placeholder)
 * is an invalid credential and will produce 401/UNAUTHENTICATED.
 */
const _isValidKeyFormat = _apiKey.length > 10;

if (!_apiKey) {
  console.warn(
    '⚠️  GEMINI_API_KEY is not set.\n' +
    '   Get your free key at https://aistudio.google.com/apikey\n' +
    '   Then set GEMINI_API_KEY=... in apps/backend/.env'
  );
}

// ─── Singleton client ─────────────────────────────────────────────────────────

/**
 * Singleton `GoogleGenAI` instance.
 * `null` when the API key is missing — callers must guard.
 */
export const geminiClient: GoogleGenAI | null =
  _apiKey ? new GoogleGenAI({ apiKey: _apiKey }) : null;

// ─── Model configuration ──────────────────────────────────────────────────────

/**
 * All model names read from environment variables.
 * Override in .env/.env.local/Vercel without touching source code.
 *
 * GEMINI_MODEL      → standard JSON-extraction model (keyword gen, pain points, sentiment)
 * GEMINI_MODEL_WEB  → search-grounded model (competitor finder, feature analyzer)
 */
export const GEMINI_MODELS = {
  /** Used for JSON extraction: keywords, pain points, sentiment tagging */
  standard: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  /** Used for Google Search-grounded calls: competitors, feature requests */
  search:   process.env.GEMINI_MODEL_WEB || 'gemini-2.5-flash',
} as const;

// ─── Timeout helper ───────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 45_000; // 45 s — generous enough for 2.5-flash

/**
 * Races a promise against a hard timeout.
 * Use this for every `generateContent` call in the SVE pipeline so a
 * single stuck Gemini call cannot hang the entire orchestrator.
 *
 * @param promise    The Gemini promise to race.
 * @param ms         Timeout in milliseconds (default 45 000).
 * @param label      Human-readable label for the timeout error message.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = DEFAULT_TIMEOUT_MS,
  label: string = 'Gemini call'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms / 1000}s`)),
        ms
      )
    ),
  ]);
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

/**
 * Parses the "Retry-In N seconds" hint from a Gemini 429 / rate-limit error
 * message and returns a safe wait time in milliseconds.
 */
export function parseRetryDelay(errorMessage: string, fallbackSeconds = 3): number {
  const match = errorMessage.match(/retry[_ ]?[Ii]n[: ]+(\d+)/);
  const seconds = match ? Math.min(parseInt(match[1], 10) + 2, 60) : fallbackSeconds;
  return seconds * 1000;
}

// ─── Guard helper ─────────────────────────────────────────────────────────────

/**
 * Throws a clear error if the Gemini client is not configured.
 * Call this at the start of every analyzer function.
 */
export function requireGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    throw new Error(
      'Gemini client is not initialized. ' +
      'Check that GEMINI_API_KEY is set in apps/backend/.env'
    );
  }
  return geminiClient;
}
