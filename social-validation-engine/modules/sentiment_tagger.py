"""
modules/sentiment_tagger.py — Module 5 (TDD §2.5)

Runs as a second Gemini call over the same sources to detect:
  1. Buying intent — phrases like 'I'd pay for', 'does anyone know a tool'
  2. Frustration level — how agitated the tone is (beyond polarity)

Returns structured tags per source post.
These tags feed the Validation Engine's buying_intent factor (weight 25%, TDD §4).

Web search is OFF — all content is from the already-collected sources.
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
You are a buying-intent and sentiment analyst reviewing social media posts.

For each post, detect:
1. buying_intent: true if the post contains phrases like:
   - 'I would pay for', 'how much would X cost', 'is there a tool that',
   - 'does anyone know of', 'willing to pay', 'I'd subscribe if',
   - 'looking for a product that', 'need a solution for'
2. frustration_level: 1 (mildly annoyed) to 5 (furious / desperate)
3. active_search: true if the person is actively hunting for a solution RIGHT NOW

Output MUST be valid JSON:
{
  "tags": [
    {
      "source_index": <integer>,
      "buying_intent": <boolean>,
      "frustration_level": <1-5>,
      "active_search": <boolean>
    }
  ]
}
"""

_MAX_POST_CHARS = 300
_MAX_POSTS = 80


async def tag_sentiment(
    sources: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Returns a summary dict:
    {
      'buying_intent_count': int,
      'active_search_count': int,
      'total_tagged': int,
      'per_source': {source_id: {buying_intent, frustration_level, active_search}}
    }
    """
    if not sources:
        return {"buying_intent_count": 0, "active_search_count": 0,
                "total_tagged": 0, "per_source": {}}

    indexed_posts = [
        {"source_index": i, "content": src["content"][:_MAX_POST_CHARS]}
        for i, src in enumerate(sources[:_MAX_POSTS])
    ]

    response = _client.models.generate_content(
        model=settings.gemini_model,
        contents=json.dumps(indexed_posts, ensure_ascii=False),
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=2048,
            response_mime_type="application/json",
        )
    )

    raw = response.text.strip() if response.text else ""
    try:
        data = json.loads(raw)
        tags: list[dict] = data["tags"]
    except (json.JSONDecodeError, KeyError) as exc:
        log.warning("sentiment_tagger: Gemini returned bad JSON, defaulting to zeros: %s", exc)
        return {"buying_intent_count": 0, "active_search_count": 0,
                "total_tagged": 0, "per_source": {}}

    id_map = {i: src["id"] for i, src in enumerate(sources[:_MAX_POSTS])}
    per_source: dict[str, Any] = {}
    buying_intent_count = 0
    active_search_count = 0

    for tag in tags:
        idx = tag.get("source_index")
        if idx not in id_map:
            continue
        source_id = id_map[idx]
        per_source[source_id] = {
            "buying_intent": tag.get("buying_intent", False),
            "frustration_level": tag.get("frustration_level", 1),
            "active_search": tag.get("active_search", False),
        }
        if tag.get("buying_intent"):
            buying_intent_count += 1
        if tag.get("active_search"):
            active_search_count += 1

    log.info(
        "sentiment_tagger: %d/%d posts show buying intent.",
        buying_intent_count,
        len(sources[:_MAX_POSTS]),
    )
    return {
        "buying_intent_count": buying_intent_count,
        "active_search_count": active_search_count,
        "total_tagged": len(tags),
        "per_source": per_source,
    }

