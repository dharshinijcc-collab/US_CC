"""
modules/pain_point_extractor.py — Module 4 (TDD §2.4)

Gemini call over the collected sources text.
Returns a deduped list of pain points with:
  - mention count
  - severity (1-5)
  - confidence (0.0-1.0)
  - source IDs evidencing this pain point (for pain_point_sources join table)

PRD §12 requires source linkage on every pain point — source_ids are matched
by index into the sources list passed in.

Web search is OFF — all content comes from the Reddit collector.
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

Output MUST be valid JSON:
{
  "pain_points": [
    {
      "pain_point": "Brief descriptive label (max 80 chars)",
      "mentions": <integer: number of posts evidencing this>,
      "severity": <1-5>,
      "confidence": <0.00-1.00>,
      "source_indexes": [<post index>, ...]
    }
  ]
}
"""

# Max characters of post content sent to Gemini to control token cost
_MAX_POST_CHARS = 400
# Max posts sent in one call — prevents context overflow
_MAX_POSTS = 80


async def extract_pain_points(
    idea_text: str,
    sources: list[dict[str, Any]],   # rows already inserted into `sources` table
) -> list[dict[str, Any]]:
    """
    sources: list of dicts with keys: id, content, engagement
    Returns list of pain-point dicts, each with a `source_ids` key
    mapping back to the source UUIDs (not just indexes).
    """
    if not sources:
        log.warning("pain_point_extractor: no sources provided, returning empty.")
        return []

    # Truncate and index posts for the prompt
    indexed_posts = [
        {
            "index": i,
            "content": src["content"][:_MAX_POST_CHARS],
            "engagement": src.get("engagement", 0),
        }
        for i, src in enumerate(sources[:_MAX_POSTS])
    ]

    user_message = (
        f"Startup idea:\n{idea_text}\n\n"
        f"Social posts (JSON):\n{json.dumps(indexed_posts, ensure_ascii=False)}"
    )

    response = _client.models.generate_content(
        model=settings.gemini_model,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=2048,
            response_mime_type="application/json",
        )
    )

    raw = response.text.strip() if response.text else ""
    try:
        data = json.loads(raw)
        raw_pain_points: list[dict] = data["pain_points"]
    except (json.JSONDecodeError, KeyError) as exc:
        raise ValueError(
            f"pain_point_extractor: Gemini returned unparseable JSON: {raw[:300]}"
        ) from exc

    # Map source indexes → source UUIDs
    id_map = {i: src["id"] for i, src in enumerate(sources[:_MAX_POSTS])}
    enriched = []
    for pp in raw_pain_points:
        indexes: list[int] = pp.get("source_indexes", [])
        source_ids = [id_map[i] for i in indexes if i in id_map]
        enriched.append({
            "pain_point": pp["pain_point"],
            "mentions": pp.get("mentions", len(source_ids)),
            "severity": pp.get("severity"),
            "confidence": pp.get("confidence"),
            "source_ids": source_ids,
        })

    log.info("pain_point_extractor: extracted %d pain points.", len(enriched))
    return enriched

