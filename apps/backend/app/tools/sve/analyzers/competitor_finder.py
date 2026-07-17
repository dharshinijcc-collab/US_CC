import json
import re
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from google.genai import types
from app.services.gemini_client import require_gemini_client
from app.tools.sve.config import SETTINGS

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
- Output MUST be valid JSON matching the schema.
"""

class CompetitorSchema(BaseModel):
    name: str = Field(description="Name of the competitor product or company")
    website: str = Field(default=None, description="Their main homepage URL if found")
    source_url: str = Field(description="Verifiable source URL proving they exist")
    missing_features: List[str] = Field(default_factory=list, description="Features they are missing which users want")
    confidence: float = Field(description="Confidence score from 0.0 to 1.0")

class CompetitorsResponseSchema(BaseModel):
    competitors: List[CompetitorSchema]

async def find_competitors(idea_text: str, pain_points: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ai = require_gemini_client()

    pain_points_sorted = sorted(pain_points, key=lambda x: x.get("mentions") or 0, reverse=True)
    pain_summary = "; ".join([pp.get("pain_point", "") for pp in pain_points_sorted[:5]])

    user_message = (
        f"Startup idea:\n{idea_text}\n\n"
        f"Top pain points found so far:\n{pain_summary}\n\n"
        f"Search the web and find real existing competitors. Return only those you can verify with a real URL."
    )

    last_exc = None
    competitors = []

    for attempt in range(3):
        try:
            response = await ai.aio.models.generate_content(
                model=SETTINGS["geminiModelWeb"],
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=4096,
                    response_mime_type="application/json",
                    response_schema=CompetitorsResponseSchema,
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )

            raw = (response.text or "").strip()
            
            # Clean JSON markdown blocks if Gemini wraps it
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)

            match = re.search(r"\{[\s\S]*\}", raw)
            if not match:
                raise ValueError("No JSON found in response.")

            data = json.loads(match.group(0))
            competitors = data.get("competitors") or []
            break
        except Exception as e:
            last_exc = e
            print(f"competitor_finder: attempt {attempt + 1} failed: {e}. Retrying...")
            await asyncio.sleep(2.0)

    if not competitors and last_exc:
        print(f"competitor_finder: all attempts exhausted, returning empty: {last_exc}")
        return []

    # Enforce: drop any entry without name or verifiable source_url
    valid = []
    for c in competitors:
        name = c.get("name")
        source_url = c.get("source_url")
        if name and source_url:
            valid.append({
                "name": name,
                "website": c.get("website") or None,
                "source_url": source_url,
                "missing_features": c.get("missing_features") or [],
                "confidence": c.get("confidence") or 0.5
            })

    print(f"competitor_finder: found {len(valid)} verified competitors.")
    return valid
