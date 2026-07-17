import os
from app.services.gemini_client import GEMINI_MODEL, GEMINI_MODEL_WEB

SCORING_WEIGHTS = {
    "pain_point_frequency": 0.30,
    "buying_intent":         0.25,
    "competitor_weakness":   0.20,
    "feature_demand":        0.15,
    "market_activity":       0.10,
}

VERDICT_BANDS = [
    (70, 100, "Strong opportunity"),
    (40, 69, "Needs more digging"),
    (0, 39, "Weak signal"),
]

SETTINGS = {
    "geminiModel": GEMINI_MODEL,
    "geminiModelWeb": GEMINI_MODEL_WEB,

    # Reddit collection
    "redditPostsPerKeyword": 25,
    "redditMinEngagement": 2,
    "redditTopCommentsLimit": 5,
    "redditMaxRetries": 3,

    # Gemini timeouts (seconds)
    "keywordGenTimeoutSeconds": 20.0,
    "painPointTimeoutSeconds": 50.0,
    "sentimentTimeoutSeconds": 50.0,
    "competitorTimeoutSeconds": 60.0,
    "featureTimeoutSeconds": 60.0,
}
