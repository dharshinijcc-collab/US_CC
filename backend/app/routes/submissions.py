from flask import Blueprint, request, jsonify
from backend.app.models.submissions import SubmissionModel
from backend.app.utils.helpers import run_async, upload_resume_to_supabase
from backend.app.services.email import (
    send_idea_confirmation,
    send_talent_confirmation,
    send_contact_confirmation,
    send_investor_confirmation,
)

submissions_bp = Blueprint("submissions", __name__)


@submissions_bp.route("/submit-idea", methods=["POST"])
def submit_idea():
    """Submit a startup idea concept and queue email verification."""
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    idea = (data.get("idea") or "").strip()

    if not idea or len(idea) < 10:
        return jsonify({"status": "error", "message": "Idea must be at least 10 characters"}), 400

    try:
        SubmissionModel.save_idea(name=name, email=email, idea=idea)
        
        if email:
            run_async(send_idea_confirmation, email, name, idea)

        return jsonify({"status": "success", "message": "Idea submitted successfully!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": f"Failed to store submission: {str(e)}"}), 500


@submissions_bp.route("/submit-talent", methods=["POST"])
def submit_talent():
    """Submit candidate details for the talent pool."""
    if request.content_type and "multipart/form-data" in request.content_type:
        first_name = (request.form.get("firstName") or "").strip()
        email = (request.form.get("email") or "").strip()
        interest = (request.form.get("interest") or "").strip()
        linkedin = (request.form.get("linkedin") or "").strip()
        resume_file = request.files.get("resume")
    else:
        data = request.get_json() or {}
        first_name = (data.get("firstName") or "").strip()
        email = (data.get("email") or "").strip()
        interest = (data.get("interest") or "").strip()
        linkedin = (data.get("linkedin") or "").strip()
        resume_file = None

    if not email or not first_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    # Upload resume if provided
    resume_url = ""
    if resume_file and resume_file.filename:
        resume_url = upload_resume_to_supabase(resume_file, resume_file.filename)

    try:
        interest_val = (interest or "engineer").strip()
        if interest_val.lower() == "engineering":
            interest_val = "engineer"

        SubmissionModel.save_talent(
            full_name=first_name,
            email=email,
            interest_area=interest_val,
            linkedin_url=linkedin,
            resume_url=resume_url
        )
        
        if email:
            run_async(send_talent_confirmation, email, first_name, interest_val)

        return jsonify({"status": "success", "message": "Talent application submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store application"}), 500


@submissions_bp.route("/submit-contact", methods=["POST"])
def submit_contact():
    """Submit business details and support inquiries."""
    data = request.get_json() or {}
    first_name = (data.get("firstName") or "").strip()
    email = (data.get("workEmail") or "").strip()
    company = (data.get("company") or "").strip()
    service = (data.get("serviceInterest") or "").strip()
    stage = (data.get("projectStage") or "").strip()
    message = (data.get("message") or "").strip()

    if not email or not first_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    try:
        SubmissionModel.save_contact(
            full_name=first_name,
            work_email=email,
            company_name=company,
            service_interest=service,
            project_stage=stage,
            message=message
        )
        
        if email:
            run_async(
                send_contact_confirmation,
                email,
                first_name,
                service,
                message,
                company,
                stage
            )

        return jsonify({"status": "success", "message": "Contact form submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store contact"}), 500


@submissions_bp.route("/submit-investor", methods=["POST"])
def submit_investor():
    """Submit investor profiles for potential partnership opportunities."""
    data = request.get_json() or {}
    full_name = (data.get("fullName") or "").strip()
    email = (data.get("email") or "").strip()
    expertise = (data.get("expertise") or "").strip()
    preferred_roles = data.get("preferredRoles") or []
    background = (data.get("background") or "").strip()

    if not email or not full_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    try:
        SubmissionModel.save_investor(
            full_name=full_name,
            email=email,
            expertise=expertise,
            preferred_roles=preferred_roles,
            background=background
        )
        
        if email:
            run_async(send_investor_confirmation, email, full_name, expertise)

        return jsonify({"status": "success", "message": "Investor profile submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store investor profile"}), 500
