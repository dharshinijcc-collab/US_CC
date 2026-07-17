import json
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from google.genai import types
from app.services.gemini_client import require_gemini_client
from app.tools.sve.config import SETTINGS

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
- Output MUST be valid JSON matching the schema.
"""

class PainPointSchema(BaseModel):
    pain_point: str = Field(description="Description of the extracted pain point")
    mentions: int = Field(description="Number of times this pain point is mentioned")
    severity: int = Field(description="Severity rating from 1 to 5")
    confidence: float = Field(description="Confidence score from 0.0 to 1.0")
    source_indexes: List[int] = Field(description="List of matching post indexes supporting this pain point")

class PainPointsResponseSchema(BaseModel):
    pain_points: List[PainPointSchema]

MAX_POST_CHARS = 400
MAX_POSTS = 80

async def extract_pain_points(idea_text: str, sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not sources:
        print("pain_point_extractor: no sources provided, returning empty.")
        return []

    ai = require_gemini_client()

    # Index and truncate posts for the prompt
    indexed_posts = []
    for i, src in enumerate(sources[:MAX_POSTS]):
        content = src.get("content") or ""
        indexed_posts.append({
            "index": i,
            "content": content[:MAX_POST_CHARS],
            "engagement": src.get("engagement") or 0
        })

    user_message = f"Startup idea:\n{idea_text}\n\nSocial posts (JSON):\n{json.dumps(indexed_posts)}"

    last_exc = None
    raw_pain_points = []

    for attempt in range(3):
        try:
            response = await ai.aio.models.generate_content(
                model=SETTINGS["geminiModel"],
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=4096,
                    response_mime_type="application/json",
                    response_schema=PainPointsResponseSchema
                )
            )

            raw = (response.text or "").strip()
            data = json.loads(raw)
            raw_pain_points = data.get("pain_points") or []
            break
        except Exception as e:
            last_exc = e
            print(f"pain_point_extractor: attempt {attempt + 1} failed: {e}. Retrying...")
            await asyncio.sleep(2.0)

    if not raw_pain_points and last_exc:
        raise RuntimeError(f"pain_point_extractor failed after 3 attempts. Last error: {last_exc}")

    # Map source indexes to actual source IDs
    id_map = {i: src.get("id") for i, src in enumerate(sources[:MAX_POSTS])}

    enriched = []
    for pp in raw_pain_points:
        indexes = pp.get("source_indexes") or []
        source_ids = [id_map[idx] for idx in indexes if idx in id_map and id_map[idx]]
        
        enriched.append({
            "pain_point": pp.get("pain_point"),
            "mentions": pp.get("mentions") or len(source_ids),
            "severity": pp.get("severity"),
            "confidence": pp.get("confidence"),
            "source_ids": source_ids
        })

    print(f"pain_point_extractor: extracted {len(enriched)} pain points.")
    return enriched
