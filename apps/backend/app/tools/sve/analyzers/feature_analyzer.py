import json
import re
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from google.genai import types
from app.services.gemini_client import require_gemini_client
from app.tools.sve.config import SETTINGS

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
- Output MUST be valid JSON matching the schema.
"""

class FeatureRequestSchema(BaseModel):
    feature_name: str = Field(description="Actionable name of the requested feature")
    mentions: int = Field(description="Number of mentions found across reviews/comments")
    priority: str = Field(description="Derived priority level: low, medium, or high")

class FeaturesResponseSchema(BaseModel):
    feature_requests: List[FeatureRequestSchema]

async def analyze_features(idea_text: str, competitors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ai = require_gemini_client()

    competitor_names = ", ".join([c.get("name", "") for c in competitors[:6]]) or "(no competitors identified yet)"
    user_message = f"Startup idea:\n{idea_text}\n\nKnown competitors in this space: {competitor_names}\n\nSearch the web and find the most-requested features that users are asking these competitors (or similar tools) to build."

    last_exc = None
    features = []

    for attempt in range(3):
        try:
            response = await ai.aio.models.generate_content(
                model=SETTINGS["geminiModelWeb"],
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=2048,
                    response_mime_type="application/json",
                    response_schema=FeaturesResponseSchema,
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )

            raw = (response.text or "").strip()
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)

            match = re.search(r"\{[\s\S]*\}", raw)
            if not match:
                raise ValueError("No JSON found in response.")

            data = json.loads(match.group(0))
            features = data.get("feature_requests") or []
            break
        except Exception as e:
            last_exc = e
            print(f"feature_analyzer: attempt {attempt + 1} failed: {e}. Retrying...")
            await asyncio.sleep(2.0)

    if not features:
        print(f"feature_analyzer: all attempts failed, returning empty. Error: {last_exc}")
        return []

    # Enforce priority derivation rules from mentions
    result = []
    for f in features:
        mentions = int(f.get("mentions") or 1)
        priority = "low"
        if mentions >= 10:
            priority = "high"
        elif mentions >= 4:
            priority = "medium"

        result.append({
            "feature_name": (f.get("feature_name") or "").strip(),
            "mentions": mentions,
            "priority": priority
        })

    print(f"feature_analyzer: found {len(result)} feature requests.")
    return result
