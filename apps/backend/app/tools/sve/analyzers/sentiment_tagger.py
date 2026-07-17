import json
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel
from google.genai import types
from app.services.gemini_client import require_gemini_client
from app.tools.sve.config import SETTINGS

SYSTEM_PROMPT = """
You are a buying-intent and sentiment analyst reviewing social media posts.

For each post, detect:
1. buying_intent: true if the post contains phrases like:
   - 'I would pay for', 'how much would X cost', 'is there a tool that',
   - 'does anyone know of', 'willing to pay', 'I'd subscribe if',
   - 'looking for a product that', 'need a solution for'
2. frustration_level: 1 (mildly annoyed) to 5 (furious / desperate)
3. active_search: true if the person is actively hunting for a solution RIGHT NOW
Output MUST be valid JSON matching the schema.
"""

class SentimentTagSchema(BaseModel):
    source_index: int
    buying_intent: bool
    frustration_level: int
    active_search: bool

class SentimentResponseSchema(BaseModel):
    tags: List[SentimentTagSchema]

MAX_POST_CHARS = 300
MAX_POSTS = 80

async def tag_sentiment(sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    empty_result = {
        "buying_intent_count": 0,
        "active_search_count": 0,
        "total_tagged": 0,
        "per_source": {}
    }

    if not sources:
        return empty_result

    ai = require_gemini_client()

    indexed_posts = []
    for i, src in enumerate(sources[:MAX_POSTS]):
        content = src.get("content") or ""
        indexed_posts.append({
            "source_index": i,
            "content": content[:MAX_POST_CHARS]
        })

    last_exc = None
    tags = []

    for attempt in range(3):
        try:
            response = await ai.aio.models.generate_content(
                model=SETTINGS["geminiModel"],
                contents=json.dumps(indexed_posts),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=4096,
                    response_mime_type="application/json",
                    response_schema=SentimentResponseSchema
                )
            )

            raw = (response.text or "").strip()
            data = json.loads(raw)
            tags = data.get("tags") or []
            break
        except Exception as e:
            last_exc = e
            print(f"sentiment_tagger: attempt {attempt + 1} failed: {e}. Retrying in 2s...")
            await asyncio.sleep(2.0)

    if not tags:
        print(f"sentiment_tagger: all attempts failed, defaulting to zeros. Error: {last_exc}")
        return empty_result

    id_map = {i: src.get("id") for i, src in enumerate(sources[:MAX_POSTS])}
    per_source = {}
    buying_intent_count = 0
    active_search_count = 0

    for tag in tags:
        idx = tag.get("source_index")
        if idx is None or idx not in id_map or not id_map[idx]:
            continue
        source_id = id_map[idx]

        bi = bool(tag.get("buying_intent"))
        active = bool(tag.get("active_search"))
        frust = int(tag.get("frustration_level") or 1)

        per_source[source_id] = {
            "buying_intent": bi,
            "frustration_level": frust,
            "active_search": active
        }

        if bi:
            buying_intent_count += 1
        if active:
            active_search_count += 1

    print(f"sentiment_tagger: {buying_intent_count}/{len(sources[:MAX_POSTS])} posts show buying intent.")
    return {
        "buying_intent_count": buying_intent_count,
        "active_search_count": active_search_count,
        "total_tagged": len(tags),
        "per_source": per_source
    }
