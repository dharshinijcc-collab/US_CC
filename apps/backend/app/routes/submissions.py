from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from app.services.supabase_client import supabase_admin
from app.services.email_client import send_email
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/submissions", tags=["Admin Submissions Control"])

class SubmissionUpdateRequest(BaseModel):
    id: str
    status: Optional[str] = None
    assigned_reviewer: Optional[str] = None
    internal_notes: Optional[str] = None

class NoteCreateRequest(BaseModel):
    submission_id: str
    note: str

async def send_workflow_email(
    to_email: str,
    name: str,
    form_type: str,
    prev_status: str,
    current_status: str,
    internal_notes: Optional[str] = None
):
    try:
        subject = ""
        headline = ""
        body = ""

        display_form_type = form_type.capitalize()

        if prev_status == "new" and current_status == "under_review":
            subject = "Your CrestCode submission is now Under Review"
            headline = "We've started reviewing your details"
            body = f"Hi {name}, our investment and venture builder team is actively reviewing your <strong>{display_form_type}</strong> details. We will reach back out to you within 1-2 business days with next steps."
        elif prev_status == "under_review" and current_status == "approved":
            subject = "Good news! Your CrestCode submission has been Approved"
            headline = "Submission Approved 🎉"
            
            if form_type == "idea":
                body = f"Hi {name},<br/><br/>Congratulations! Our venture team has completed the evaluation of your startup idea. We see high potential and would love to schedule a briefing call to discuss backing your concept and building this out together."
            elif form_type == "talent":
                body = f"Hi {name},<br/><br/>Thank you for submitting your application to join the team. Our talent acquisition specialists have approved your profile. We will reach out to you shortly to schedule an initial interview."
            else:
                body = f"Hi {name},<br/><br/>Your <strong>{display_form_type}</strong> submission has been approved. A representative from our investor relations/operations division will connect with you shortly for next steps."
        elif prev_status == "under_review" and current_status == "rejected":
            subject = "Update regarding your CrestCode submission"
            headline = "Review Decision"
            body = f"Hi {name}, thank you for taking the time to share your details with CrestCode. After careful consideration, we have decided not to proceed at this stage. We appreciate your interest and wish you the best of luck in your endeavors."
        elif current_status == "need_more_information":
            subject = "Action Required: More information needed for your CrestCode submission"
            headline = "Additional Details Requested"
            body = f"Hi {name}, our review team requires some additional details to complete the evaluation of your <strong>{display_form_type}</strong> submission. Please reply directly to this email or send details to contact@cctps.com."
        elif current_status == "contacted":
            subject = "Following up on your CrestCode submission"
            headline = "Let's Connect"
            body = f"Hi {name}, we are following up on your recent <strong>{display_form_type}</strong> submission. Our team is excited to connect with you. Please let us know your availability for a brief call."

        if not subject:
            return

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #F1F5F9; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 11px; font-weight: 800; color: #005AE2; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">CRESTCODE WORKFLOW</span>
            <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">{headline}</h2>
          </div>
          <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px;">
            {body}
          </p>
          {f'''<div style="background: #F8FAFC; border-left: 4px solid #64748B; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <strong style="font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Notes / Instructions</strong>
              <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">{internal_notes}</p>
            </div>''' if internal_notes and current_status == 'need_more_information' else ''}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated status update regarding your CrestCode account.</p>
        </div>
        """
        await send_email(to=to_email, subject=subject, html=html_content)
    except Exception as err:
        print(f"[Workflow Email Error] Failed to send workflow email: {str(err)}")

@router.get("")
def get_submissions(
    formType: str = "all",
    status: str = "all",
    query: str = "",
    page: int = 1,
    limit: int = 10,
    current_user: dict = Depends(get_current_admin)
):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")

    from_offset = (page - 1) * limit
    to_offset = from_offset + limit - 1

    try:
        db_query = supabase_admin.table("submissions").select("*", count="exact")

        if formType != "all":
            db_query = db_query.eq("form_type", formType)
        if status != "all":
            db_query = db_query.eq("status", status)
        if query:
            db_query = db_query.or_(f"name.ilike.%{query}%,email.ilike.%{query}%,company.ilike.%{query}%")

        db_query = db_query.order("created_at", descending=True).range(from_offset, to_offset)
        response = db_query.execute()

        # Fetch stats
        stats_resp = supabase_admin.table("submissions").select("status, form_type").execute()
        stats_data = stats_resp.data or []

        stats = {
            "total": len(stats_data),
            "new": len([s for s in stats_data if s["status"] == "new"]),
            "under_review": len([s for s in stats_data if s["status"] == "under_review"]),
            "need_info": len([s for s in stats_data if s["status"] == "need_more_information"]),
            "approved": len([s for s in stats_data if s["status"] == "approved"]),
            "rejected": len([s for s in stats_data if s["status"] == "rejected"]),
            "contacted": len([s for s in stats_data if s["status"] == "contacted"]),
        }

        return {
            "status": "success",
            "payload": {
                "submissions": response.data or [],
                "count": response.count or 0,
                "stats": stats
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/details")
def get_submission_details(
    id: str = Query(...),
    current_user: dict = Depends(get_current_admin)
):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        sub_resp = supabase_admin.table("submissions").select("*").eq("id", id).maybe_single().execute()
        if not sub_resp.data:
            raise HTTPException(status_code=404, detail="Submission not found")

        notes_resp = supabase_admin.table("submission_notes").select("*").eq("submission_id", id).order("created_at", descending=True).execute()
        history_resp = supabase_admin.table("submission_status_history").select("*").eq("submission_id", id).order("changed_at", descending=True).execute()

        return {
            "status": "success",
            "payload": {
                "submission": sub_resp.data,
                "notes": notes_resp.data or [],
                "history": history_resp.data or []
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update")
async def update_submission(
    payload: SubmissionUpdateRequest,
    current_user: dict = Depends(get_current_admin)
):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")

    admin_email = current_user.get("email")

    try:
        sub_resp = supabase_admin.table("submissions").select("*").eq("id", payload.id).maybe_single().execute()
        if not sub_resp.data:
            raise HTTPException(status_code=404, detail="Submission not found")

        current = sub_resp.data
        prev_status = current["status"]
        is_status_changed = payload.status and payload.status != prev_status

        update_data = {
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        if payload.status:
            update_data["status"] = payload.status
        if payload.assigned_reviewer is not None:
            update_data["assigned_reviewer"] = payload.assigned_reviewer
        if payload.internal_notes is not None:
            update_data["internal_notes"] = payload.internal_notes

        supabase_admin.table("submissions").update(update_data).eq("id", payload.id).execute()

        if is_status_changed:
            supabase_admin.table("submission_status_history").insert({
                "submission_id": payload.id,
                "previous_status": prev_status,
                "current_status": payload.status,
                "changed_by": admin_email,
                "internal_notes": payload.internal_notes or f"Status transitioned from {prev_status} to {payload.status}"
            }).execute()

            await send_workflow_email(
                to_email=current["email"],
                name=current["name"],
                form_type=current["form_type"],
                prev_status=prev_status,
                current_status=payload.status,
                internal_notes=payload.internal_notes
            )

        return {
            "status": "success",
            "payload": {
                "message": "Submission updated successfully!"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notes")
def add_submission_note(
    payload: NoteCreateRequest,
    current_user: dict = Depends(get_current_admin)
):
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database not configured")

    admin_email = current_user.get("email")

    try:
        supabase_admin.table("submission_notes").insert({
            "submission_id": payload.submission_id,
            "note": payload.note,
            "created_by": admin_email
        }).execute()

        return {
            "status": "success",
            "payload": {
                "message": "Note added successfully!"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
