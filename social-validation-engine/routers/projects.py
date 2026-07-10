"""
routers/projects.py — All FastAPI endpoints (TDD §5 + §12.4)

Endpoints implemented:
  POST   /projects                                     Create + start pipeline
  GET    /projects                                     List all projects
  GET    /projects/{id}                                Poll status
  GET    /projects/{id}/report                         Fetch final report
  GET    /projects/{id}/sources                        Raw evidence posts
  DELETE /projects/{id}                                Delete (cascade in DB)
  GET    /projects/{id}/pain-points/{ppid}/sources     Evidence drill-down (TDD §12.4)
  GET    /projects/{id}/competitors/{cid}              Single competitor detail (TDD §12.4)
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from database import db
from models.schemas import (
    ProjectCreate,
    ProjectStatusResponse,
    ProjectListItem,
    SourceRow,
    PainPointWithSources,
    CompetitorRow,
    ValidationReport,
    PainPointOut,
    CompetitorOut,
    FeatureOut,
)
from pipeline.orchestrator import run_pipeline

log = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["projects"])


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _require_project(project_id: str) -> dict:
    """Return the project row or raise 404."""
    result = db.table("projects").select("*").eq("id", project_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result.data


# ─── POST /projects ───────────────────────────────────────────────────────────

@router.post("", status_code=status.HTTP_202_ACCEPTED, response_model=ProjectStatusResponse)
async def create_project(body: ProjectCreate, background_tasks: BackgroundTasks):
    """
    Submit an idea and kick off the validation pipeline as a background job.
    Returns immediately with a project_id for the frontend to poll.
    TDD §5: 'POST /projects — Create a project from a submitted idea; kicks off the pipeline.'
    """
    result = db.table("projects").insert({
        "idea_text": body.idea_text,
        "idea_name": body.idea_name,
        "target_audience": body.target_audience,
        "status": "pending",
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create project.")

    project = result.data[0]
    background_tasks.add_task(run_pipeline, project["id"], body.idea_text)
    log.info("projects: created id=%s, pipeline queued.", project["id"])
    return project


# ─── GET /projects ────────────────────────────────────────────────────────────

@router.get("", response_model=list[ProjectListItem])
async def list_projects():
    """
    Return all projects, joined with their latest report score + verdict.
    TDD §5: 'GET /projects — List a user's past projects.'
    """
    projects = db.table("projects").select("*").order("created_at", desc=True).execute()
    rows = projects.data or []

    # Enrich with latest report data
    enriched = []
    for p in rows:
        report = (
            db.table("reports")
            .select("validation_score,verdict")
            .eq("project_id", p["id"])
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        report_data = report.data[0] if report.data else {}
        enriched.append({**p, **report_data})
    return enriched


# ─── GET /projects/{id} ───────────────────────────────────────────────────────

@router.get("/{project_id}", response_model=ProjectStatusResponse)
async def get_project_status(project_id: str):
    """
    Poll project status: pending / collecting / analyzing / done / failed.
    TDD §5: 'GET /projects/{id} — Poll project status.'
    """
    return _require_project(project_id)


# ─── GET /projects/{id}/report ───────────────────────────────────────────────

@router.get("/{project_id}/report", response_model=ValidationReport)
async def get_project_report(project_id: str):
    """
    Returns the full JSON report once status = done.
    TDD §5: 'GET /projects/{id}/report — Fetch the final report.'
    Shape matches TDD §3.2 output contract exactly.
    """
    project = _require_project(project_id)

    if project["status"] != "done":
        raise HTTPException(
            status_code=status.HTTP_425_TOO_EARLY,
            detail=f"Report not ready yet. Current status: {project['status']}",
        )

    # Load report
    report_res = (
        db.table("reports")
        .select("*")
        .eq("project_id", project_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not report_res.data:
        raise HTTPException(status_code=404, detail="Report not found.")
    report = report_res.data[0]

    # Load pain points + their source URLs (summary view: just URLs, not full rows)
    pp_res = db.table("pain_points").select("*").eq("project_id", project_id).execute()
    pain_points_out: list[PainPointOut] = []
    for pp in (pp_res.data or []):
        # Fetch source URLs via join table
        join_res = (
            db.table("pain_point_sources")
            .select("source_id")
            .eq("pain_point_id", pp["id"])
            .execute()
        )
        source_ids = [r["source_id"] for r in (join_res.data or [])]
        source_urls: list[str] = []
        if source_ids:
            src_res = (
                db.table("sources")
                .select("url")
                .in_("id", source_ids)
                .execute()
            )
            source_urls = [s["url"] for s in (src_res.data or [])]

        pain_points_out.append(PainPointOut(
            pain_point=pp["pain_point"],
            mentions=pp["mentions"],
            severity=pp.get("severity"),
            confidence=pp.get("confidence"),
            sources=source_urls,
        ))

    # Load competitors
    comp_res = db.table("competitors").select("*").eq("project_id", project_id).execute()
    competitors_out = [
        CompetitorOut(
            name=c["name"],
            website=c.get("website"),
            source_url=c["source_url"],
            missing_features=c.get("missing_features") or [],
            confidence=c.get("confidence"),
        )
        for c in (comp_res.data or [])
    ]

    # Load feature requests
    feat_res = (
        db.table("features")
        .select("*")
        .eq("project_id", project_id)
        .order("mentions", desc=True)
        .execute()
    )
    features_out = [
        FeatureOut(
            feature_name=f["feature_name"],
            mentions=f["mentions"],
            priority=f.get("priority"),
        )
        for f in (feat_res.data or [])
    ]

    return ValidationReport(
        idea=project["idea_text"],
        validation_score=report["validation_score"],
        verdict=report["verdict"],
        reasoning=report["reasoning"],
        pain_points=pain_points_out,
        competitors=competitors_out,
        feature_requests=features_out,
    )


# ─── GET /projects/{id}/sources ───────────────────────────────────────────────

@router.get("/{project_id}/sources", response_model=list[SourceRow])
async def get_project_sources(project_id: str):
    """
    Return raw collected posts for evidence drill-down.
    TDD §5: 'GET /projects/{id}/sources — Return the raw collected posts.'
    """
    _require_project(project_id)
    result = (
        db.table("sources")
        .select("*")
        .eq("project_id", project_id)
        .order("engagement", desc=True)
        .execute()
    )
    return result.data or []


# ─── DELETE /projects/{id} ────────────────────────────────────────────────────

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str):
    """
    Delete a project and all child rows (cascade handled by DB foreign keys).
    TDD §5: 'DELETE /projects/{id} — Delete a project and cascade.'
    """
    _require_project(project_id)
    db.table("projects").delete().eq("id", project_id).execute()
    return None


# ─── GET /projects/{id}/pain-points/{ppid}/sources ───────────────────────────
# Evidence Explorer endpoint — TDD §12.4

@router.get("/{project_id}/pain-points/{pain_point_id}/sources",
            response_model=PainPointWithSources)
async def get_pain_point_sources(project_id: str, pain_point_id: str):
    """
    Return the specific source rows evidencing one pain point.
    Powers the per-pain-point evidence drill-down (TDD §12.4).
    """
    _require_project(project_id)

    # Verify pain point belongs to this project
    pp_res = (
        db.table("pain_points")
        .select("*")
        .eq("id", pain_point_id)
        .eq("project_id", project_id)
        .maybe_single()
        .execute()
    )
    if not pp_res.data:
        raise HTTPException(status_code=404, detail="Pain point not found.")
    pp = pp_res.data

    # Fetch source rows via join table
    join_res = (
        db.table("pain_point_sources")
        .select("source_id")
        .eq("pain_point_id", pain_point_id)
        .execute()
    )
    source_ids = [r["source_id"] for r in (join_res.data or [])]
    sources: list[dict] = []
    if source_ids:
        src_res = (
            db.table("sources")
            .select("*")
            .in_("id", source_ids)
            .order("engagement", desc=True)
            .execute()
        )
        sources = src_res.data or []

    return PainPointWithSources(
        **pp,
        sources=[SourceRow(**s) for s in sources],
    )


# ─── GET /projects/{id}/competitors/{cid} ────────────────────────────────────
# Evidence Explorer endpoint — TDD §12.4

@router.get("/{project_id}/competitors/{competitor_id}", response_model=CompetitorRow)
async def get_competitor_detail(project_id: str, competitor_id: str):
    """
    Return a single competitor record including its source_url.
    Powers the competitor evidence drill-down (TDD §12.4).
    """
    _require_project(project_id)
    result = (
        db.table("competitors")
        .select("*")
        .eq("id", competitor_id)
        .eq("project_id", project_id)
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Competitor not found.")
    return result.data
