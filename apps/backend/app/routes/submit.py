import uuid
from typing import Optional, List
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.supabase_client import supabase_admin
from app.services.email_client import send_email

router = APIRouter(tags=["Form Submissions"])

class ContactRequest(BaseModel):
    firstName: str
    workEmail: EmailStr
    company: Optional[str] = ""
    serviceInterest: Optional[str] = ""
    projectStage: Optional[str] = ""
    message: Optional[str] = ""

class IdeaRequest(BaseModel):
    name: Optional[str] = "Anonymous"
    email: EmailStr
    idea: str

class InvestorRequest(BaseModel):
    fullName: str
    email: EmailStr
    expertise: Optional[str] = ""
    preferredRoles: Optional[List[str]] = []
    background: Optional[str] = ""

# POST /submit-contact
@router.post("/submit-contact")
async def submit_contact(payload: ContactRequest):
    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured."
        )

    first_name = payload.firstName.strip()
    email = payload.workEmail.strip()
    company = payload.company.strip() if payload.company else ""
    service = payload.serviceInterest.strip() if payload.serviceInterest else ""
    stage = payload.projectStage.strip() if payload.projectStage else ""
    message = payload.message.strip() if payload.message else ""

    if not email or not first_name:
        raise HTTPException(status_code=400, detail="Name and Email are required.")

    # 1. Insert into contact_inquiries table
    try:
        if supabase_admin:
            supabase_admin.table("contact_inquiries").insert({
                "full_name": first_name,
                "work_email": email,
                "company_name": company,
                "service_interest": service,
                "project_stage": stage,
                "message": message
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] contact_inquiries insert failed: {str(e)}")

    # 2. Insert into unified submissions table
    try:
        if supabase_admin:
            supabase_admin.table("submissions").insert({
                "form_type": "contact",
                "name": first_name,
                "email": email,
                "company": company or None,
                "payload": {
                    "service_interest": service,
                    "project_stage": stage,
                    "message": message
                }
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] submissions insert failed: {str(e)}")

    # 3. Send email to user
    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #020617;">
        Thanks for reaching out, {first_name}!
      </h2>
      <p style="margin: 0 0 24px; color: #64748B; font-size: 15px; line-height: 1.6;">
        We've received your inquiry and our team is reviewing it now. We'll get back to you within <strong style="color:#005AE2;">1-2 business days</strong>.
      </p>
      <div style="background: #F0F7FF; border-left: 4px solid #005AE2; border-radius: 4px 12px 12px 4px; padding: 20px 24px; margin-bottom: 32px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #005AE2; text-transform: uppercase; letter-spacing: 0.08em;">Your Submission</p>
        <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Company:</strong> {company or 'Not specified'}</p>
        <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Service:</strong> {service or 'Not specified'}</p>
        <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Stage:</strong> {stage or 'Not specified'}</p>
        <p style="margin: 0 0 6px; font-size: 14px; color: #334155;"><strong>Message:</strong> {message or 'Not specified'}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
    </div>
    """
    send_email(to_email=email, subject="Thank you for reaching out", html_content=email_html)

    return {"success": True, "message": "Contact form submitted!"}

# POST /submit-idea
@router.post("/submit-idea")
async def submit_idea(payload: IdeaRequest):
    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured."
        )

    email = payload.email.strip()
    idea = payload.idea.strip()
    name = payload.name.strip() if payload.name else "Anonymous"

    if len(idea) < 10:
        raise HTTPException(status_code=400, detail="Idea must be at least 10 characters.")

    try:
        if supabase_admin:
            supabase_admin.table("idea_submissions").insert({
                "name": name,
                "email": email,
                "idea": idea
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] idea_submissions insert failed: {str(e)}")

    # Send confirmation email
    email_html = f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 32px; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #005AE2; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">CRESTCODE</h1>
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B;">Product Studio</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Hi {name},</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
        Thank you for submitting your startup idea to CrestCode. We have successfully received your submission!
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
        Our team is currently evaluating the concept and overall market opportunity. We will update you via email as we progress.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 0;">
        Best regards,<br />
        <strong>The CrestCode Team</strong>
      </p>
    </div>
    """
    send_email(to_email=email, subject="Idea Submission Received", html_content=email_html)

    return {"success": True, "message": "Idea submitted successfully!"}

# POST /submit-investor
@router.post("/submit-investor")
async def submit_investor(payload: InvestorRequest):
    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured."
        )

    full_name = payload.fullName.strip()
    email = payload.email.strip()
    expertise = payload.expertise.strip() if payload.expertise else ""
    background = payload.background.strip() if payload.background else ""

    try:
        if supabase_admin:
            supabase_admin.table("investor_submissions").insert({
                "full_name": full_name,
                "email": email,
                "expertise": expertise,
                "preferred_roles": payload.preferredRoles,
                "background": background
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] investor_submissions insert failed: {str(e)}")

    try:
        if supabase_admin:
            supabase_admin.table("submissions").insert({
                "form_type": "investor",
                "name": full_name,
                "email": email,
                "payload": {
                    "expertise": expertise,
                    "preferred_roles": payload.preferredRoles,
                    "background": background
                }
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] submissions (investor) insert failed: {str(e)}")

    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #005AE2; text-align: center;">CrestCode Investor Circle</h2>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi {full_name},</p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for submitting your application to join the CrestCode Investor Circle.</p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">We have successfully received your investor profile details. Our investment relations team will review your application and contact you directly if there is alignment.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
    </div>
    """
    send_email(to_email=email, subject="Application Received - CrestCode Investor Circle", html_content=email_html)

    return {"success": True, "message": "Investor application submitted!"}

# POST /submit-talent
@router.post("/submit-talent")
async def submit_talent(
    firstName: str = Form(...),
    email: str = Form(...),
    interest: str = Form(...),
    linkedin: str = Form(""),
    resume: Optional[UploadFile] = File(None)
):
    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured."
        )

    first_name = firstName.strip()
    email_val = email.strip()
    interest_val = interest.strip()
    linkedin_val = linkedin.strip()
    resume_url = ""

    # Upload resume if provided
    if resume:
        # Check size (max 8MB)
        file_bytes = await resume.read()
        if len(file_bytes) > 8 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Resume file size exceeds 8MB limit")
        
        ext = resume.filename.split('.')[-1] if '.' in resume.filename else "pdf"
        unique_name = f"{uuid.uuid4()}.{ext}"

        try:
            supabase_admin.storage.from_("resumes").upload(
                path=unique_name,
                file=file_bytes,
                file_options={"content-type": resume.content_type or "application/pdf"}
            )
            # Retrieve public URL
            public_url_resp = supabase_admin.storage.from_("resumes").get_public_url(unique_name)
            resume_url = public_url_resp or ""
        except Exception as e:
            # Continue without resume if storage upload fails
            print(f"[Upload Error] Resume upload failed: {str(e)}")

    interest_area = interest_val.lower() if interest_val else "engineer"
    if interest_area == "engineering":
        interest_area = "engineer"

    try:
        if supabase_admin:
            supabase_admin.table("talent_pool").insert({
                "full_name": first_name,
                "email": email_val,
                "interest_area": interest_area,
                "linkedin_url": linkedin_val,
                "resume_url": resume_url
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] talent_pool insert failed: {str(e)}")

    try:
        if supabase_admin:
            supabase_admin.table("submissions").insert({
                "form_type": "talent",
                "name": first_name,
                "email": email_val,
                "payload": {
                    "interest_area": interest_area,
                    "linkedin_url": linkedin_val,
                    "resume_url": resume_url
                }
            }).execute()
    except Exception as e:
        print(f"[Supabase Error] submissions (talent) insert failed: {str(e)}")

    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #005AE2; text-align: center;">CrestCode Talent Pool</h2>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hi {first_name},</p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for submitting your profile to join the CrestCode team as a <strong>{interest_area}</strong>.</p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">We have successfully received your information, and our talent team will review your application when opportunities matching your background open up.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
    </div>
    """
    send_email(to_email=email_val, subject="Application Received - CrestCode Talent Pool", html_content=email_html)

    return {"success": True, "message": "Talent application submitted!"}
