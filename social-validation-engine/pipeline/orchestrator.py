"""
pipeline/orchestrator.py — Full pipeline runner (TDD §3.1 + §10)

Runs modules 2-9 in sequence, updating project.status at each stage so
the frontend can poll GET /projects/{id} and see where execution is.

Status transitions:
  pending → collecting → analyzing → done
                                   → failed  (+ failed_stage recorded)

Background execution: called from FastAPI BackgroundTasks (TDD §5, §9).
For Phase 1 volume, in-process backgroundtasks are sufficient.
Move to Celery/Redis if concurrent projects become common (TDD §9).
"""
from __future__ import annotations

import logging
from typing import Any

from database import db
from modules.keyword_generator import generate_keywords
from modules.reddit_collector import collect_posts
from modules.pain_point_extractor import extract_pain_points
from modules.sentiment_tagger import tag_sentiment
from modules.competitor_finder import find_competitors
from modules.feature_analyzer import analyze_features
from modules.validation_engine import compute_validation_score

log = logging.getLogger(__name__)


# ─── Status helpers ───────────────────────────────────────────────────────────

def _set_status(project_id: str, status: str, failed_stage: str | None = None) -> None:
    payload: dict[str, Any] = {"status": status}
    if failed_stage:
        payload["failed_stage"] = failed_stage
    db.table("projects").update(payload).eq("id", project_id).execute()


# ─── DB write helpers ─────────────────────────────────────────────────────────

def _insert_sources(project_id: str, raw_posts: list[dict]) -> list[dict]:
    """Insert source rows and return the full rows (with generated UUIDs)."""
    if not raw_posts:
        return []
    rows = [{"project_id": project_id, **p} for p in raw_posts]
    result = db.table("sources").insert(rows).execute()
    return result.data or []


def _insert_pain_points(project_id: str, pain_points: list[dict]) -> list[dict]:
    """Insert pain_points rows, then populate pain_point_sources join table."""
    if not pain_points:
        return []
    rows = [
        {
            "project_id": project_id,
            "pain_point": pp["pain_point"],
            "mentions": pp["mentions"],
            "severity": pp.get("severity"),
            "confidence": pp.get("confidence"),
        }
        for pp in pain_points
    ]
    result = db.table("pain_points").insert(rows).execute()
    inserted: list[dict] = result.data or []

    # Populate join table — map inserted UUID back to source_ids
    join_rows: list[dict] = []
    for inserted_pp, original_pp in zip(inserted, pain_points):
        for source_id in original_pp.get("source_ids", []):
            join_rows.append({
                "pain_point_id": inserted_pp["id"],
                "source_id": source_id,
            })
    if join_rows:
        db.table("pain_point_sources").insert(join_rows).execute()

    return inserted


def _insert_competitors(project_id: str, competitors: list[dict]) -> list[dict]:
    if not competitors:
        return []
    rows = [{"project_id": project_id, **c} for c in competitors]
    result = db.table("competitors").insert(rows).execute()
    return result.data or []


def _insert_features(project_id: str, features: list[dict]) -> list[dict]:
    if not features:
        return []
    rows = [{"project_id": project_id, **f} for f in features]
    result = db.table("features").insert(rows).execute()
    return result.data or []


def _insert_report(project_id: str, score_result: dict) -> None:
    db.table("reports").insert({
        "project_id": project_id,
        **score_result,
    }).execute()


# ─── Main orchestrator ────────────────────────────────────────────────────────

async def run_pipeline(project_id: str, idea_text: str) -> None:
    """
    Full pipeline for one project. Called as a FastAPI BackgroundTask.
    All exceptions are caught so the background task doesn't silently vanish —
    the project is marked failed with which stage broke.
    """
    log.info("pipeline: starting project_id=%s", project_id)

    # ── Module 2: Keyword Generation ─────────────────────────────────────────
    try:
        keywords = await generate_keywords(idea_text)
        log.info("pipeline: %d keywords generated.", len(keywords))
    except Exception as exc:
        log.error("pipeline: keyword_generator failed: %s", exc)
        _set_status(project_id, "failed", failed_stage="keyword_generator")
        return

    # ── Module 3: Reddit Collection ───────────────────────────────────────────
    _set_status(project_id, "collecting")
    try:
        raw_posts = await collect_posts(keywords)
        source_rows = _insert_sources(project_id, raw_posts)
        log.info("pipeline: %d source rows inserted.", len(source_rows))
    except Exception as exc:
        log.error("pipeline: reddit_collector failed: %s", exc)
        _set_status(project_id, "failed", failed_stage="reddit_collector")
        return

    if not source_rows:
        log.warning("pipeline: no sources collected — marking as failed.")
        _set_status(project_id, "failed", failed_stage="reddit_collector")
        return

    _set_status(project_id, "analyzing")

    # ── Module 4: Pain Point Extraction ──────────────────────────────────────
    try:
        pain_points_raw = await extract_pain_points(idea_text, source_rows)
        inserted_pps = _insert_pain_points(project_id, pain_points_raw)
        log.info("pipeline: %d pain points inserted.", len(inserted_pps))
    except Exception as exc:
        log.error("pipeline: pain_point_extractor failed: %s", exc)
        _set_status(project_id, "failed", failed_stage="pain_point_extractor")
        return

    # ── Module 5: Sentiment / Buying-Intent Tagging ───────────────────────────
    try:
        sentiment = await tag_sentiment(source_rows)
    except Exception as exc:
        log.warning("pipeline: sentiment_tagger failed (non-fatal), defaulting: %s", exc)
        sentiment = {"buying_intent_count": 0, "active_search_count": 0,
                     "total_tagged": 0, "per_source": {}}

    # ── Module 6: Competitor Discovery ───────────────────────────────────────
    try:
        competitors_raw = await find_competitors(idea_text, pain_points_raw)
        inserted_competitors = _insert_competitors(project_id, competitors_raw)
        log.info("pipeline: %d competitors inserted.", len(inserted_competitors))
    except Exception as exc:
        log.error("pipeline: competitor_finder failed: %s", exc)
        _set_status(project_id, "failed", failed_stage="competitor_finder")
        return

    # ── Module 7: Feature Request Analysis ───────────────────────────────────
    try:
        features_raw = await analyze_features(idea_text, competitors_raw)
        _insert_features(project_id, features_raw)
        log.info("pipeline: %d feature requests inserted.", len(features_raw))
    except Exception as exc:
        log.warning("pipeline: feature_analyzer failed (non-fatal), skipping: %s", exc)
        features_raw = []

    # ── Module 8: Validation Scoring ─────────────────────────────────────────
    try:
        score_result = compute_validation_score(
            pain_points=pain_points_raw,
            sentiment=sentiment,
            competitors=competitors_raw,
            features=features_raw,
            sources=source_rows,
        )
        _insert_report(project_id, score_result)
        log.info(
            "pipeline: report saved. score=%d verdict='%s'",
            score_result["validation_score"],
            score_result["verdict"],
        )
    except Exception as exc:
        log.error("pipeline: validation_engine/report failed: %s", exc)
        _set_status(project_id, "failed", failed_stage="validation_engine")
        return

    _set_status(project_id, "done")
    log.info("pipeline: project_id=%s complete.", project_id)
