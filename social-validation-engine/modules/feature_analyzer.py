"""
modules/feature_analyzer.py — Module 7 (TDD §2.7)

Mines competitor reviews and forum threads (via Gemini + google_search tool)
for specific feature requests people are asking existing tools to add.

Feeds the `features` table. Priority is derived from mention count for v1
(PRD §12: 'Could just derive this from mention count for v1').

Web search ENABLED — same grounding requirement as competitor_finder.
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
You are a product researcher mining feature requests from competitor reviews,
Reddit threads, Product Hunt discussions, and HackerNews comments.

You will use web search to find what users are ACTIVELY ASKING competitor products
to build or fix. Focus on: review site comments, GitHub issues, Reddit complaints
about named competitors, Product Hunt reviews.

For each distinct feature request:
- feature_name: specific, actionable (e.g. 'Dark mode', 'CSV export', 'API access')
- mentions: how many distinct sources mention this
- priority: derive from mentions: >=10 = 'high', 4-9 = 'medium', 1-3 = 'low'

Output MUST be valid JSON:
{
  "feature_requests": [
    {
      "feature_name": "Feature name",
      "mentions": <integer>,
      "priority": "low" | "medium" | "high"
    }
  ]
}
"""


async def analyze_features(
    idea_text: str,
    competitors: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    competitors: list of {name, website} — used to focus the search.
    Returns list of feature request dicts ready for `features` table.
    """
    competitor_names = ", ".join(
        c["name"] for c in competitors[:6]
    ) or "(no competitors identified yet)"

    user_message = (
        f"Startup idea:\n{idea_text}\n\n"
        f"Known competitors in this space: {competitor_names}\n\n"
        "Search the web and find the most-requested features that users are"
        " asking these competitors (or similar tools) to build."
    )

    response = _client.models.generate_content(
        model=settings.gemini_model_web,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=2048,
            tools=[{"google_search": {}}],
            response_mime_type="application/json",
        )
    )

    raw = response.text.strip() if response.text else ""
    try:
        data = json.loads(raw)
        features: list[dict] = data["feature_requests"]
    except (json.JSONDecodeError, KeyError) as exc:
        log.warning("feature_analyzer: Gemini returned bad JSON, returning empty: %s", exc)
        return []

    # Enforce priority derivation from mentions for v1 (PRD §12)
    result = []
    for f in features:
        mentions = f.get("mentions", 1)
        if mentions >= 10:
            priority = "high"
        elif mentions >= 4:
            priority = "medium"
        else:
            priority = "low"
        result.append({
            "feature_name": f.get("feature_name", "").strip(),
            "mentions": mentions,
            "priority": priority,
        })

    log.info("feature_analyzer: found %d feature requests.", len(result))
    return result

