import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, EmailStr
from app.services.supabase_client import supabase_admin
from app.tools.validator.signal_extractor import extract_signals
from app.tools.validator.rule_engine import run_rule_engine, detect_red_flags
from app.tools.validator.score_calculator import calculate_aggregated_scores
from app.tools.validator.gemini_memo import generate_narrative_memo

router = APIRouter(prefix="/idea-validator", tags=["VC Idea Validator Engine"])

class QAAnswersSchema(BaseModel):
    customer: str
    problem: str
    pain_score: float
    validation_level: str
    market_size_choice: Optional[str] = "medium"
    revenue_model_choice: Optional[str] = "subscription"
    why_now: Optional[str] = ""
    competitors: str
    moat: str
    solo_founder: bool
    has_technical_cofounder: Optional[bool] = None
    technical_background: str
    current_stage: str
    launch_timeline: str
    funding_status: str
    contact_name: str
    contact_email: EmailStr
    need_help: Optional[bool] = False

class SubmitIdeaRequest(BaseModel):
    ideaText: str
    toolType: Optional[str] = "idea-validator"
    answers: QAAnswersSchema

class LinkUserRequest(BaseModel):
    report: Dict[str, Any]

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# In-memory cache matching Node's deduplication check
cache = {}

async def get_user_id_from_request(request: Request) -> Optional[str]:
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    if not supabase_admin:
        return None
    try:
        user_resp = supabase_admin.auth.get_user(token)
        if user_resp.user:
            return user_resp.user.id
    except Exception:
        pass
    return None

@router.get("")
def get_idea_validator_report(request: Request, id: str = Query(...)):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured.")

    try:
        user_id = supabase_admin.auth.get_user(request.headers.get("authorization").split(" ")[1]).user.id if request.headers.get("authorization") else None
    except Exception:
        user_id = None

    try:
        response = supabase_admin.table("dd_reports").select("*").eq("id", id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Report not found")

        report = response.data
        if report.get("user_id") and report.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not own this report")

        # If report overall_score is null (SVE draft status), check SVE status first
        if report.get("overall_score") is None:
            proj_resp = supabase_admin.table("projects").select("status").eq("id", id).maybe_single().execute()
            if not proj_resp.data:
                raise HTTPException(status_code=404, detail="SVE project not found.")

            status_val = proj_resp.data.get("status")
            if status_val != "done":
                raise HTTPException(status_code=425, detail=f"Social Validation is in status: {status_val}")

            # Merge SVE results into the draft
            # (In production, the SVE router automatically merges this via status update)
            pass

        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_idea_validator_report(request: Request, payload: SubmitIdeaRequest):
    if payload.toolType == "social-validation":
        raise HTTPException(status_code=400, detail="Use POST /social-validation for Social Validation Engine requests.")

    idea_text = payload.ideaText
    answers = payload.answers.model_dump()
    cache_key = f"{answers['contact_email']}:{idea_text[:100]}"
    
    # Check deduplication cache
    if cache_key in cache:
        return cache[cache_key]

    # Load configurations
    dynamic_config = None
    if supabase_admin:
        try:
            config_resp = supabase_admin.table("tool_configurations") \
                .select("config") \
                .eq("key", "idea_validator") \
                .maybe_single() \
                .execute()
            if config_resp.data:
                dynamic_config = config_resp.data["config"]
        except Exception:
            pass

    # Step 1: Extract signals
    signals = await extract_signals(
        idea_text,
        answers,
        system_prompt=dynamic_config.get("prompt_templates", {}).get("signal_extraction") if dynamic_config else None
    )

    # Step 2: Run rule engine
    dimension_scores = run_rule_engine(
        signals,
        rule_modifiers=dynamic_config.get("rule_modifiers") if dynamic_config else None
    )

    # Step 3: Detect red flags
    red_flags = detect_red_flags(signals)

    # Step 4: Aggregate scores
    aggregated = calculate_aggregated_scores(
        dimension_scores,
        answers,
        len(red_flags),
        dynamic_config
    )

    # Step 5: AI Narrative memo generation
    narrative_report = await generate_narrative_memo(
        idea_text,
        answers,
        aggregated,
        dimension_scores,
        red_flags,
        system_prompt=dynamic_config.get("prompt_templates", {}).get("narrative_generation") if dynamic_config else None
    )

    report_id = str(uuid.uuid4())
    final_payload = {
        **narrative_report,
        "id": report_id,
        "signals": signals,
        "answers": answers,
        "dimensions": narrative_report.get("dimensions"),
        "unlocked": True,
        "created_at": datetime.now().isoformat()
    }

    # Save to dd_reports table
    if supabase_admin:
        try:
            verdict = "Proceed" if final_payload["overall_score"] >= 7.5 else "Needs Work" if final_payload["overall_score"] >= 4.5 else "High Risk"
            supabase_admin.table("dd_reports").insert({
                "id": report_id,
                "overall_score": final_payload["overall_score"],
                "verdict": verdict,
                "report_data": final_payload,
                "is_mock": final_payload.get("is_mock", False)
            }).execute()
        except Exception as e:
            print(f"[Database Error] Failed to save dd_report: {str(e)}")

    cache[cache_key] = final_payload
    return final_payload

@router.post("/submit")
def submit_guest_idea(payload: LinkUserRequest):
    if not supabase_admin:
        return {"success": True, "message": "Mock submit successful"}

    report = payload.report
    try:
        verdict = "Proceed" if report["overall_score"] >= 7.5 else "Needs Work" if report["overall_score"] >= 4.5 else "High Risk"
        # 1. Save dd_report
        supabase_admin.table("dd_reports").insert({
            "id": report["id"],
            "overall_score": report["overall_score"],
            "verdict": verdict,
            "report_data": report,
            "is_mock": report.get("is_mock", False)
        }).execute()
    except Exception:
        pass

    try:
        # 2. Save lead contact
        answers = report.get("answers", {})
        supabase_admin.table("idea_submissions").insert({
            "name": answers.get("contact_name", "Anonymous"),
            "email": answers.get("contact_email", "Anonymous"),
            "idea": report.get("ideaText", "Anonymous")
        }).execute()
    except Exception:
        pass

    return {"success": True}

@router.post("/auth")
def authenticate_validator_user(action: str = Query(...), payload: SignupRequest = None, login_payload: LoginRequest = None):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Auth service not configured.")

    try:
        if action == "signup":
            if not payload:
                raise HTTPException(status_code=400, detail="Missing signup payload")
            
            # Create user confirmation instantly via admin auth
            user_data = supabase_admin.auth.admin.create_user({
                "email": payload.email,
                "password": payload.password,
                "email_confirm": True,
                "user_metadata": {"full_name": payload.name}
            })
            
            # SignIn password to construct real browser session token
            session = supabase_admin.auth.sign_in_with_password({
                "email": payload.email,
                "password": payload.password
            })
            
            return {
                "access_token": session.session.access_token,
                "refresh_token": session.session.refresh_token,
                "user": {"id": user_data.user.id, "email": payload.email, "name": payload.name}
            }
        elif action == "login":
            if not login_payload:
                raise HTTPException(status_code=400, detail="Missing login payload")
                
            session = supabase_admin.auth.sign_in_with_password({
                "email": login_payload.email,
                "password": login_payload.password
            })
            
            return {
                "access_token": session.session.access_token,
                "refresh_token": session.session.refresh_token,
                "user": {"id": session.user.id, "email": login_payload.email}
            }
        else:
            raise HTTPException(status_code=400, detail="Unknown action. Use ?action=signup or ?action=login")
    except Exception as e:
        err_msg = str(e).lower()
        if "already registered" in err_msg or "user already exists" in err_msg:
            raise HTTPException(status_code=409, detail="already_exists")
        raise HTTPException(status_code=401, detail="invalid_credentials")
