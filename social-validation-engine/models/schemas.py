"""
models/schemas.py — All Pydantic request/response shapes for the API.

Mirrors the JSON output contract in TDD §3.2 and the table columns in TDD §6.2.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ─── Inbound ──────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    """Body for POST /projects — TDD §5."""
    idea_text: str = Field(..., min_length=20, max_length=5000,
                           description="Free-text idea or pitch paragraph.")
    idea_name: Optional[str] = Field(None, max_length=120,
                                     description="Optional short label.")
    target_audience: Optional[str] = Field(None, max_length=200)


# ─── Database row shapes (used internally + in responses) ────────────────────

class ProjectRow(BaseModel):
    id: str
    idea_text: str
    idea_name: Optional[str] = None
    target_audience: Optional[str] = None
    status: str            # pending | collecting | analyzing | done | failed
    failed_stage: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class SourceRow(BaseModel):
    """Raw social post row from the `sources` table."""
    id: str
    project_id: str
    platform: str          # reddit | x (x reserved Phase 2)
    url: str
    content: str
    engagement: int
    posted_at: Optional[datetime] = None
    collected_at: datetime


class PainPointRow(BaseModel):
    id: str
    project_id: str
    pain_point: str
    mentions: int
    severity: Optional[int] = None    # 1-5
    confidence: Optional[float] = None
    created_at: datetime


class PainPointWithSources(PainPointRow):
    """Pain point + its evidence posts — used by the Evidence Explorer endpoint."""
    sources: list[SourceRow] = []


class CompetitorRow(BaseModel):
    id: str
    project_id: str
    name: str
    website: Optional[str] = None
    source_url: str
    missing_features: Optional[list[str]] = None
    positive_mentions: Optional[int] = None
    negative_mentions: Optional[int] = None
    confidence: Optional[float] = None
    created_at: datetime


class FeatureRow(BaseModel):
    id: str
    project_id: str
    feature_name: str
    mentions: int
    priority: Optional[str] = None    # low | medium | high
    created_at: datetime


class ReportRow(BaseModel):
    id: str
    project_id: str
    validation_score: Optional[int] = None   # 0-100
    verdict: Optional[str] = None
    reasoning: Optional[str] = None
    created_at: datetime


# ─── Outbound — full report shape (TDD §3.2 output contract) ─────────────────

class PainPointOut(BaseModel):
    pain_point: str
    mentions: int
    severity: Optional[int] = None
    confidence: Optional[float] = None
    sources: list[str] = []     # list of URLs, not full rows, for the summary view


class CompetitorOut(BaseModel):
    name: str
    website: Optional[str] = None
    source_url: str
    missing_features: list[str] = []
    confidence: Optional[float] = None


class FeatureOut(BaseModel):
    feature_name: str
    mentions: int
    priority: Optional[str] = None


class ValidationReport(BaseModel):
    """
    Full JSON report shape, matching TDD §3.2 exactly.
    Returned by GET /projects/{id}/report.
    """
    idea: str
    validation_score: int
    verdict: str
    reasoning: str
    pain_points: list[PainPointOut]
    competitors: list[CompetitorOut]
    feature_requests: list[FeatureOut]


class ProjectStatusResponse(BaseModel):
    """Returned by GET /projects/{id} — for frontend polling."""
    id: str
    status: str
    failed_stage: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    idea_name: Optional[str] = None


class ProjectListItem(BaseModel):
    id: str
    idea_name: Optional[str] = None
    idea_text: str
    status: str
    validation_score: Optional[int] = None
    verdict: Optional[str] = None
    created_at: datetime
