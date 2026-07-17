import json
import asyncio
from google.genai import types
from app.services.gemini_client import require_gemini_client
from app.tools.sve.config import SETTINGS

SYSTEM_PROMPT = "Generate 5 short, problem-focused search query phrases for this startup idea. Output JSON: {\"keywords\": [\"string\"]}"

async def generate_keywords(idea_text: str) -> list[str]:
    ai = require_gemini_client()
    last_exc = None

    for attempt in range(3):
        try:
            # Call Gemini using async client.aio namespace
            response = await ai.aio.models.generate_content(
                model=SETTINGS["geminiModel"],
                contents=f"Idea: {idea_text}",
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=128,
                    response_mime_type="application/json",
                    response_schema={
                        "type": "OBJECT",
                        "properties": {
                            "keywords": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            }
                        },
                        "required": ["keywords"]
                    }
                )
            )

            raw = (response.text or "").strip()
            data = json.loads(raw)
            keywords = data.get("keywords") or []
            if not keywords:
                raise ValueError("Gemini returned an empty keyword list.")
            print(f"keyword_generator: generated {len(keywords)} keywords.")
            return keywords[:10]
        except Exception as e:
            last_exc = e
            print(f"keyword_generator: attempt {attempt + 1} failed: {e}. Retrying in 2s...")
            await asyncio.sleep(2.0)

    raise RuntimeError(f"keyword_generator failed after 3 attempts. Last error: {last_exc}")
