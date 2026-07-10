"""
modules/competitor_finder.py — Module 6 (TDD §2.6)

Gemini call with google_search tool ENABLED.

This is the module the PRD singles out as highest hallucination risk (PRD §2, §13).
Web search is NON-OPTIONAL here. The rule enforced at write time:
  - If a competitor entry lacks a source_url, it is dropped before DB insert.
  - If a competitor entry lacks a name, it is dropped.
This is the concrete implementation of TDD §7.2:
  'if a call returns an entry without one, the backend should drop that entry'

Returns a list of competitor dicts ready for the `competitors` table.
"""
from __future__ import annotations

import json
import logging
from typing import Any

from google import genai
from google.genai import types
from config import settings

log = logging.getLogger(__name__)
_client = genai.Client(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """
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

Output MUST be valid JSON:
{
  "competitors": [
    {
      "name": "Product Name",
      "website": "https://...",
      "source_url": "https://... (search result or review page that confirms this exists)",
      "missing_features": ["feature1", "feature2"],
      "confidence": 0.00
    }
  ]
}
"""


async def find_competitors(
    idea_text: str,
    pain_points: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    pain_points: list of {pain_point, mentions} — provides context for the search.
    Returns list of competitor dicts (source_url guaranteed non-null).
    """
    pain_summary = "; ".join(
        pp["pain_point"] for pp in sorted(
            pain_points, key=lambda p: p.get("mentions", 0), reverse=True
        )[:5]
    )

    user_message = (
        f"Startup idea:\n{idea_text}\n\n"
        f"Top pain points found so far:\n{pain_summary}\n\n"
        "Search the web and find real existing competitors. "
        "Return only those you can verify with a real URL."
    )

    response = _client.models.generate_content(
        model=settings.gemini_model_web,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=4096,
            tools=[{"google_search": {}}],
            response_mime_type="application/json",
        )
    )

    raw = response.text.strip() if response.text else ""
    try:
        data = json.loads(raw)
        competitors: list[dict] = data["competitors"]
    except (json.JSONDecodeError, KeyError) as exc:
        raise ValueError(
            f"competitor_finder: Gemini returned unparseable JSON: {raw[:300]}"
        ) from exc

    # ── Enforce: drop any entry without a real source_url (TDD §7.2) ──────────
    valid = []
    for c in competitors:
        if not c.get("name") or not c.get("source_url"):
            log.warning(
                "competitor_finder: dropping '%s' — missing name or source_url.",
                c.get("name", "<unnamed>"),
            )
            continue
        valid.append({
            "name": c["name"],
            "website": c.get("website"),
            "source_url": c["source_url"],
            "missing_features": c.get("missing_features") or [],
            "confidence": c.get("confidence"),
        })

    log.info("competitor_finder: found %d verified competitors.", len(valid))
    return valid

