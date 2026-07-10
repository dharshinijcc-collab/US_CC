"""
main.py — FastAPI application entry point.

Architecture: TDD §1.1 / §5 / §9
- CORS configured for the Next.js frontend (origin list from config).
- Router registered under /api/v1 prefix.
- BackgroundTasks (in-process) used for Phase 1 volume. TDD §9:
  'can run in-process with FastAPI BackgroundTasks for Phase 1 volume;
   move to a real queue only if concurrent projects become common.'
- Lifespan: no warm-up needed for Phase 1 (Supabase client is module-level).

Run locally:
  uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers.projects import router as projects_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Social Validation Engine starting up. env=%s", settings.app_env)
    yield
    log.info("Social Validation Engine shutting down.")


app = FastAPI(
    title="Social Validation Engine",
    description=(
        "Paste a startup idea. Get Pain Points, Competitors, Feature Requests "
        "and a Validation Score — grounded in real Reddit posts and verified competitors. "
        "Phase 1: Reddit + Gemini. See PRD §18 for scope."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(projects_router, prefix="/api/v1")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "0.1.0"}
