"""
modules/validation_engine.py — Module 8 (TDD §2.8)

Fully DETERMINISTIC scoring layer — no AI call.
Takes structured outputs of all previous modules and produces:
  - validation_score: 0-100
  - verdict: 'Strong opportunity' | 'Needs more digging' | 'Weak signal'
  - reasoning: plain-English explanation of the score

Weights from config.py / TDD §4:
  pain_point_frequency  30%
  buying_intent         25%
  competitor_weakness   20%
  feature_demand        15%
  market_activity       10%

Verdict bands (TDD §4):
  70-100 → Strong opportunity
  40-69  → Needs more digging
  0-39   → Weak signal
"""
from __future__ import annotations

import math
import logging
from typing import Any

from config import SCORING_WEIGHTS, VERDICT_BANDS

log = logging.getLogger(__name__)

# ── Sub-score normalisation helpers ──────────────────────────────────────────

def _sigmoid_normalize(value: float, midpoint: float = 50.0, steepness: float = 0.05) -> float:
    """Maps any positive float onto [0, 1] using a sigmoid curve."""
    return 1 / (1 + math.exp(-steepness * (value - midpoint)))


def _clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, value))


# ── Factor scorers (each returns a float in [0, 1]) ──────────────────────────

def _score_pain_point_frequency(
    pain_points: list[dict[str, Any]],
) -> float:
    """
    Normalised sum of mention counts, weighted by severity.
    Baseline: 100 weighted mentions = 1.0 score.
    """
    if not pain_points:
        return 0.0
    weighted = sum(
        pp.get("mentions", 0) * (pp.get("severity") or 3) / 5
        for pp in pain_points
    )
    return _clamp(_sigmoid_normalize(weighted, midpoint=50, steepness=0.04))


def _score_buying_intent(
    sentiment: dict[str, Any],
) -> float:
    """
    buying_intent_count / total_tagged.  Bonus for active_search signals.
    """
    total = sentiment.get("total_tagged", 0)
    if total == 0:
        return 0.1   # slight baseline — no data ≠ definitely zero demand
    bi = sentiment.get("buying_intent_count", 0)
    active = sentiment.get("active_search_count", 0)
    ratio = (bi + 0.5 * active) / total
    return _clamp(ratio)


def _score_competitor_weakness(
    pain_points: list[dict[str, Any]],
    competitors: list[dict[str, Any]],
) -> float:
    """
    Measures the gap: what pain points are NOT covered by any competitor's features?
    More uncovered pain → more opportunity.
    """
    if not competitors:
        # No known competitors = either blue ocean or no validated market yet
        # Neutral score — let other factors decide
        return 0.5

    all_competitor_features = set()
    for c in competitors:
        for f in (c.get("missing_features") or []):
            all_competitor_features.add(f.lower())

    pain_labels = [pp["pain_point"].lower() for pp in pain_points]
    uncovered = sum(
        1 for label in pain_labels
        if not any(cf in label or label in cf for cf in all_competitor_features)
    )
    if not pain_labels:
        return 0.3
    gap_ratio = uncovered / len(pain_labels)
    return _clamp(gap_ratio)


def _score_feature_demand(
    features: list[dict[str, Any]],
) -> float:
    """
    Total feature mention count, normalised.
    Baseline: 30 total feature mentions = 1.0.
    """
    total = sum(f.get("mentions", 0) for f in features)
    if total == 0:
        return 0.1
    return _clamp(_sigmoid_normalize(total, midpoint=30, steepness=0.08))


def _score_market_activity(
    sources: list[dict[str, Any]],
) -> float:
    """
    Volume + recency of collected posts.
    Baseline: 200 posts = 1.0 volume score.
    Recency: fraction of posts in the last 180 days.
    """
    from datetime import datetime, timezone, timedelta
    if not sources:
        return 0.0
    volume_score = _clamp(_sigmoid_normalize(len(sources), midpoint=100, steepness=0.02))

    cutoff = datetime.now(tz=timezone.utc) - timedelta(days=180)
    recent = 0
    for s in sources:
        posted = s.get("posted_at")
        if posted:
            try:
                if isinstance(posted, str):
                    from datetime import datetime as dt
                    ts = dt.fromisoformat(posted.replace("Z", "+00:00"))
                else:
                    ts = posted
                if ts > cutoff:
                    recent += 1
            except ValueError:
                pass
    recency_score = recent / len(sources) if sources else 0.0
    return _clamp(0.6 * volume_score + 0.4 * recency_score)


# ── Verdict band lookup ───────────────────────────────────────────────────────

def _verdict_from_score(score: int) -> str:
    for lo, hi, label in VERDICT_BANDS:
        if lo <= score <= hi:
            return label
    return "Weak signal"


# ── Main entry point ──────────────────────────────────────────────────────────

def compute_validation_score(
    pain_points: list[dict[str, Any]],
    sentiment: dict[str, Any],
    competitors: list[dict[str, Any]],
    features: list[dict[str, Any]],
    sources: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Returns: {validation_score (int 0-100), verdict (str), reasoning (str)}
    """
    f1 = _score_pain_point_frequency(pain_points)
    f2 = _score_buying_intent(sentiment)
    f3 = _score_competitor_weakness(pain_points, competitors)
    f4 = _score_feature_demand(features)
    f5 = _score_market_activity(sources)

    w = SCORING_WEIGHTS
    raw_score = (
        f1 * w["pain_point_frequency"]
        + f2 * w["buying_intent"]
        + f3 * w["competitor_weakness"]
        + f4 * w["feature_demand"]
        + f5 * w["market_activity"]
    )
    # Scale 0-1 → 0-100
    validation_score = round(_clamp(raw_score) * 100)
    verdict = _verdict_from_score(validation_score)

    # Build plain-English reasoning
    pain_count = len(pain_points)
    bi_pct = round(sentiment.get("buying_intent_count", 0) / max(sentiment.get("total_tagged", 1), 1) * 100)
    competitor_count = len(competitors)
    feature_count = len(features)
    source_count = len(sources)

    reasoning = (
        f"Score: {validation_score}/100 — {verdict}.\n\n"
        f"Pain-point frequency ({round(w['pain_point_frequency']*100)}% weight, sub-score {round(f1*100)}/100): "
        f"{pain_count} distinct pain points found across {source_count} posts.\n"
        f"Buying intent ({round(w['buying_intent']*100)}% weight, sub-score {round(f2*100)}/100): "
        f"{bi_pct}% of tagged posts show explicit buying intent or active tool-searching.\n"
        f"Competitor weakness ({round(w['competitor_weakness']*100)}% weight, sub-score {round(f3*100)}/100): "
        f"{competitor_count} competitor(s) found; gap analysis shows {'significant' if f3 > 0.6 else 'moderate' if f3 > 0.3 else 'limited'} unmet demand.\n"
        f"Feature demand ({round(w['feature_demand']*100)}% weight, sub-score {round(f4*100)}/100): "
        f"{feature_count} distinct feature request(s) surfaced from competitor reviews.\n"
        f"Market activity ({round(w['market_activity']*100)}% weight, sub-score {round(f5*100)}/100): "
        f"{source_count} posts collected from Reddit."
    )

    log.info("validation_engine: score=%d verdict='%s'", validation_score, verdict)
    return {
        "validation_score": validation_score,
        "verdict": verdict,
        "reasoning": reasoning,
    }
