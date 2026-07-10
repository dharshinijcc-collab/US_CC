"""
modules/keyword_generator.py — Module 2 (TDD §2.2)

Gemini call: idea_text → 5-10 search-ready keyword phrases.

Web search is OFF for this call — per TDD §7.2:
  "keeping it off for Keyword Generation keeps that call fast and cheap."

Keywords are problem-framed (e.g. 'AI interview copilot' also produces
'interview anxiety', 'mock interview feedback') so the Reddit Collector can
find pain-point posts, not just idea-branded ones.
"""
from __future__ import annotations

import json
from google import genai
from google.genai import types
from config import settings

_client = genai.Client(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """
You are a search-query strategist helping validate startup ideas.
Your task: given a startup idea, generate 5-10 search keyword phrases that will
find Reddit posts from real people complaining about, discussing, or asking for
solutions to the PROBLEM this idea solves.

Rules:
- Phrases must be problem-framed, not idea-branded.
  Good: 'interview anxiety reddit', 'need mock interview feedback'
  Bad:  'AI interview copilot', 'interview coach app'
- Include both broad and specific variants.
- Include at least one 'does anyone know a tool that...' style phrase.
- Output MUST be valid JSON: {"keywords": ["phrase1", "phrase2", ...]}
"""


async def generate_keywords(idea_text: str) -> list[str]:
    """
    Returns a list of 5-10 search keyword phrases for the given idea.
    Raises ValueError if Gemini returns unparseable output.
    """
    # Using Client in synchronous/blocking mode is fine since background_tasks handles threading,
    # but we can wrap it or call it directly.
    response = _client.models.generate_content(
        model=settings.gemini_model,
        contents=f"Idea:\n{idea_text}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=512,
            response_mime_type="application/json",
        )
    )

    raw = response.text.strip() if response.text else ""
    try:
        data = json.loads(raw)
        keywords: list[str] = data["keywords"]
    except (json.JSONDecodeError, KeyError) as exc:
        raise ValueError(f"keyword_generator: Gemini returned unparseable JSON: {raw[:200]}") from exc

    if not keywords:
        raise ValueError("keyword_generator: Gemini returned an empty keyword list.")

    return keywords[:10]   # hard cap at 10 to control downstream API budget

