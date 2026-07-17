import uuid
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from pydantic import BaseModel, Field
from typing import Optional

from app.services.supabase_client import supabase_admin
from app.tools.sve.services.orchestrator import run_pipeline, sve_status_store

router = APIRouter(prefix="/api/social-validation")

class SocialValidationRequest(BaseModel):
    ideaText: str = Field(..., min_length=20)
    ideaName: Optional[str] = None
    targetAudience: Optional[str] = None
    contactName: Optional[str] = None
    contactEmail: Optional[str] = None

@router.post("")
async def start_social_validation(req: SocialValidationRequest, background_tasks: BackgroundTasks):
    project_id = str(uuid.uuid4())
    idea_name = req.ideaName or req.contactName or "Unnamed Idea"
    target_audience = req.targetAudience or "General Audience"
    
    if supabase_admin:
        try:
            # 1. Create project record
            supabase_admin.table("projects").insert([{
                "id": project_id,
                "idea_text": req.ideaText,
                "idea_name": idea_name,
                "target_audience": target_audience,
                "status": "pending"
            }]).execute()
            
            # 2. Create placeholder dd_reports entry
            supabase_admin.table("dd_reports").insert([{
                "id": project_id,
                "user_id": None,
                "overall_score": None,
                "verdict": "Pending",
                "report_data": {
                    "ideaText": req.ideaText,
                    "ideaName": req.ideaName,
                    "targetAudience": req.targetAudience,
                    "contactName": req.contactName or "Anonymous",
                    "contactEmail": req.contactEmail or "anonymous@crestcode.com",
                    "status": "pending",
                    "toolType": "social-validation"
                },
                "is_mock": False
            }]).execute()
        except Exception as e:
            print(f"routes: failed to initialize SVE records: {e}")
            raise HTTPException(status_code=500, detail="Failed to initialize SVE records.")

        # 3. Kick off SVE background pipeline
        background_tasks.add_task(run_pipeline, project_id, req.ideaText)
        return {"id": project_id, "status": "pending"}

    # Mock Fallback if Supabase not configured
    return {
        "id": project_id,
        "status": "done",
        "social_validation": {
            "validation_score": 74,
            "verdict": "Moderate Demand",
            "reasoning": "Simulated SVE (no DB): Decent interest found in online communities.",
            "pain_points": [
                {"pain_point": "No structured feedback loop", "mentions": 12, "severity": 4, "confidence": 0.88, "sources": []}
            ],
            "competitors": [
                {"name": "UserVoice", "website": "https://uservoice.com", "source_url": "", "missing_features": ["In-game SDK"], "confidence": 0.8}
            ],
            "feature_requests": [
                {"feature_name": "Slack Integration", "mentions": 9, "priority": "high"}
            ]
        }
    }

@router.get("/status")
async def get_social_validation_status(id: str = Query(...)):
    if not supabase_admin:
        return {"status": "done"}
        
    try:
        res = supabase_admin.table("projects").select("status, failed_stage").eq("id", id).maybe_single().execute()
        data = res.data
        
        if not data:
            # Check dd_reports
            rep_res = supabase_admin.table("dd_reports").select("id, overall_score").eq("id", id).maybe_single().execute()
            if rep_res.data and rep_res.data.get("overall_score") is not None:
                return {"status": "done"}
            raise HTTPException(status_code=404, detail="SVE project not found.")

        in_memory = sve_status_store.get(id) or {}
        return {
            "status": data.get("status"),
            "failed_stage": data.get("failed_stage"),
            "current_stage": in_memory.get("current_stage")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_social_validation_report(id: str = Query(...)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured.")
        
    try:
        # 1. Check status is done
        p_res = supabase_admin.table("projects").select("status").eq("id", id).maybe_single().execute()
        p_data = p_res.data
        if not p_data:
            raise HTTPException(status_code=404, detail="SVE project not found.")
            
        status = p_data.get("status")
        if status != "done":
            raise HTTPException(status_code=425, detail=f"SVE project is still in status: {status}")

        # 2. Fetch SVE report
        r_res = supabase_admin.table("reports").select("*").eq("project_id", id).order("created_at", desc=True).limit(1).execute()
        sve_report = r_res.data[0] if r_res.data else {}

        # 3. Fetch pain points + sources
        pps_res = supabase_admin.table("pain_points").select("*").eq("project_id", id).execute()
        pps = pps_res.data or []
        
        pain_points_out = []
        for pp in pps:
            pp_id = pp.get("id")
            # Fetch join rows
            join_res = supabase_admin.table("pain_point_sources").select("source_id").eq("pain_point_id", pp_id).execute()
            source_ids = [row.get("source_id") for row in (join_res.data or [])]
            
            urls = []
            if source_ids:
                src_res = supabase_admin.table("sources").select("url").in_("id", source_ids).execute()
                urls = [s.get("url") for s in (src_res.data or [])]
                
            pain_points_out.append({
                "pain_point": pp.get("pain_point"),
                "mentions": pp.get("mentions"),
                "severity": pp.get("severity"),
                "confidence": pp.get("confidence"),
                "sources": urls
            })

        # 4. Fetch competitors
        comps_res = supabase_admin.table("competitors").select("*").eq("project_id", id).execute()
        competitors_out = []
        for c in (comps_res.data or []):
            competitors_out.append({
                "name": c.get("name"),
                "website": c.get("website"),
                "source_url": c.get("source_url"),
                "missing_features": c.get("missing_features") or [],
                "confidence": c.get("confidence")
            })

        # 5. Fetch feature requests
        feats_res = supabase_admin.table("features").select("*").eq("project_id", id).order("mentions", desc=True).execute()
        features_out = []
        for f in (feats_res.data or []):
            features_out.append({
                "feature_name": f.get("feature_name"),
                "mentions": f.get("mentions"),
                "priority": f.get("priority")
            })

        # 6. Compile payload
        final_payload = {
            "id": id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "social_validation": {
                "validation_score": sve_report.get("validation_score") or 0,
                "verdict": sve_report.get("verdict") or "Unknown",
                "reasoning": sve_report.get("reasoning") or "Social validation completed.",
                "pain_points": pain_points_out,
                "competitors": competitors_out,
                "feature_requests": features_out
            }
        }

        # 7. Update dd_reports
        supabase_admin.table("dd_reports").update({
            "overall_score": sve_report.get("validation_score") or 0,
            "verdict": sve_report.get("verdict") or "Done",
            "report_data": final_payload,
            "is_mock": False
        }).eq("id", id).execute()

        return final_payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
