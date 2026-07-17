import math
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.tools.sve.config import SCORING_WEIGHTS, VERDICT_BANDS

def sigmoid_normalize(value: float, midpoint: float = 50.0, steepness: float = 0.05) -> float:
    try:
        return 1.0 / (1.0 + math.exp(-steepness * (value - midpoint)))
    except OverflowError:
        return 0.0 if value < midpoint else 1.0

def clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, value))

def score_pain_point_frequency(pain_points: List[Dict[str, Any]]) -> float:
    if not pain_points:
        return 0.0
    weighted_sum = sum([(pp.get("mentions") or 0) * (pp.get("severity") or 3) / 5.0 for pp in pain_points])
    return clamp(sigmoid_normalize(weighted_sum, 50.0, 0.04))

def score_buying_intent(sentiment: Dict[str, Any]) -> float:
    total = sentiment.get("total_tagged") or 0
    if total == 0:
        return 0.1  # Slight baseline
    bi = sentiment.get("buying_intent_count") or 0
    active = sentiment.get("active_search_count") or 0
    ratio = (bi + 0.5 * active) / total
    return clamp(ratio)

def score_competitor_weakness(pain_points: List[Dict[str, Any]], competitors: List[Dict[str, Any]]) -> float:
    if not competitors:
        return 0.5  # Neutral
    
    all_competitor_features = set()
    for c in competitors:
        missing = c.get("missing_features") or []
        for f in missing:
            all_competitor_features.add(f.lower())

    pain_labels = [pp.get("pain_point", "").lower() for pp in pain_points]
    if not pain_labels:
        return 0.3

    uncovered = 0
    for label in pain_labels:
        # Check if pain label overlaps with any missing features
        is_uncovered = any((cf in label or label in cf) for cf in all_competitor_features)
        if is_uncovered:
            uncovered += 1

    gap_ratio = uncovered / len(pain_labels)
    return clamp(gap_ratio)

def score_feature_demand(features: List[Dict[str, Any]]) -> float:
    if not features:
        return 0.1
    total = sum([f.get("mentions") or 0 for f in features])
    return clamp(sigmoid_normalize(total, 30.0, 0.08))

def score_market_activity(sources: List[Dict[str, Any]]) -> float:
    if not sources:
        return 0.0
    volume_score = clamp(sigmoid_normalize(len(sources), 100.0, 0.02))

    # Recency: fraction of posts in last 180 days
    cutoff_ts = datetime.now(timezone.utc).timestamp() - (180 * 24 * 60 * 60)
    recent = 0
    for s in sources:
        posted = s.get("posted_at")
        if posted:
            try:
                # Handle isoformat conversion
                ts = datetime.fromisoformat(posted.replace("Z", "+00:00")).timestamp()
                if ts > cutoff_ts:
                    recent += 1
            except Exception:
                pass

    recency_score = recent / len(sources)
    return clamp(0.6 * volume_score + 0.4 * recency_score)

def get_verdict_from_score(score: int) -> str:
    for lo, hi, label in VERDICT_BANDS:
        if lo <= score <= hi:
            return label
    return "Weak signal"

def compute_validation_score(
    pain_points: List[Dict[str, Any]],
    sentiment: Dict[str, Any],
    competitors: List[Dict[str, Any]],
    features: List[Dict[str, Any]],
    sources: List[Dict[str, Any]]
) -> Dict[str, Any]:
    f1 = score_pain_point_frequency(pain_points)
    f2 = score_buying_intent(sentiment)
    f3 = score_competitor_weakness(pain_points, competitors)
    f4 = score_feature_demand(features)
    f5 = score_market_activity(sources)

    w = SCORING_WEIGHTS
    raw_score = (
        f1 * w["pain_point_frequency"] +
        f2 * w["buying_intent"] +
        f3 * w["competitor_weakness"] +
        f4 * w["feature_demand"] +
        f5 * w["market_activity"]
    )

    validation_score = round(clamp(raw_score) * 100)
    verdict = get_verdict_from_score(validation_score)

    total_tagged = max(sentiment.get("total_tagged") or 1, 1)
    bi_pct = round((sentiment.get("buying_intent_count") or 0) / total_tagged * 100)

    gap_strength = "significant" if f3 > 0.6 else "moderate" if f3 > 0.3 else "limited"

    reasoning = (
        f"Score: {validation_score}/100 — {verdict}.\n\n"
        f"Pain-point frequency ({round(w['pain_point_frequency'] * 100)}% weight, sub-score {round(f1 * 100)}/100): "
        f"{len(pain_points)} distinct pain points found across {len(sources)} posts.\n"
        f"Buying intent ({round(w['buying_intent'] * 100)}% weight, sub-score {round(f2 * 100)}/100): "
        f"{bi_pct}% of tagged posts show explicit buying intent or active tool-searching.\n"
        f"Competitor weakness ({round(w['competitor_weakness'] * 100)}% weight, sub-score {round(f3 * 100)}/100): "
        f"{len(competitors)} competitor(s) found; gap analysis shows {gap_strength} unmet demand.\n"
        f"Feature demand ({round(w['feature_demand'] * 100)}% weight, sub-score {round(f4 * 100)}/100): "
        f"{len(features)} distinct feature request(s) surfaced from competitor reviews.\n"
        f"Market activity ({round(w['market_activity'] * 100)}% weight, sub-score {round(f5 * 100)}/100): "
        f"{len(sources)} posts collected."
    )

    return {
        "validation_score": validation_score,
        "verdict": verdict,
        "reasoning": reasoning
    }
