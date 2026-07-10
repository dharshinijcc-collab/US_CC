"""
config.py — centralised settings and validation scoring weights.

All scoring weights from TDD §4 live here so they can be tuned without
touching pipeline code. The FastAPI app + all modules import from this file.
"""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── Gemini ───────────────────────────────────────────────────────────────
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    gemini_model: str = "gemini-2.5-flash"
    # Web search is enabled only for competitor_finder and feature_analyzer
    # (TDD §7.2: "keeping it off for Keyword Generation keeps that call fast and cheap")
    gemini_model_web: str = "gemini-2.5-flash"  # same model, tool-enabled calls

    # ── Reddit ───────────────────────────────────────────────────────────────
    reddit_client_id: str = Field(..., alias="REDDIT_CLIENT_ID")
    reddit_client_secret: str = Field(..., alias="REDDIT_CLIENT_SECRET")
    reddit_user_agent: str = Field(..., alias="REDDIT_USER_AGENT")

    # How many posts to collect per keyword; capped to control Reddit API budget
    reddit_posts_per_keyword: int = 25
    # Only collect posts with engagement >= this threshold (noise filter, TDD §2.3)
    reddit_min_engagement: int = 2
    # How many top comments to pull per post
    reddit_top_comments_limit: int = 5

    # ── Supabase ─────────────────────────────────────────────────────────────
    supabase_url: str = Field(..., alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(..., alias="SUPABASE_SERVICE_ROLE_KEY")

    # ── App ──────────────────────────────────────────────────────────────────
    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]

    # ── Retry / timeout policy (TDD §7.3) ────────────────────────────────────
    reddit_max_retries: int = 3
    gemini_timeout_seconds: int = 120
    gemini_max_retries: int = 1


# ── Validation Scoring Weights (TDD §4) ──────────────────────────────────────
#
# Factor                Weight   Derived From
# ─────────────────────────────────────────────────────────────────────────────
# Pain Point Frequency   30%     Normalised sum of mention counts
# Buying Intent          25%     buying-intent-flagged posts / total posts
# Competitor Weakness    20%     Gaps between pain points & competitor features
# Feature Demand         15%     Mention count on feature_requests
# Market Activity        10%     Volume + recency of collected posts
#
# Score bands (TDD §4):
#   70-100 → Strong opportunity
#   40-69  → Needs more digging
#   0-39   → Weak signal

SCORING_WEIGHTS = {
    "pain_point_frequency": 0.30,
    "buying_intent":         0.25,
    "competitor_weakness":   0.20,
    "feature_demand":        0.15,
    "market_activity":       0.10,
}

VERDICT_BANDS = [
    (70, 100, "Strong opportunity"),
    (40, 69,  "Needs more digging"),
    (0,  39,  "Weak signal"),
]

settings = Settings()  # type: ignore[call-arg]
