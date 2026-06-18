from flask import Blueprint, jsonify, request
import os, uuid, requests as http_requests
from backend.db import DBHelper
from .models import WebsiteModel
from .email_service import (
    send_contact_confirmation,
    send_idea_confirmation,
    send_talent_confirmation,
    send_investor_confirmation,
)

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', '')
RESUME_BUCKET = 'resumes'

def upload_resume_to_supabase(file_obj, original_filename: str) -> str:
    """Upload a file object to Supabase Storage and return its public URL.
    Returns empty string if Supabase is not configured or upload fails.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        return ''
    ext = original_filename.rsplit('.', 1)[-1].lower() if '.' in original_filename else 'pdf'
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{RESUME_BUCKET}/{unique_name}"
    headers = {
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': file_obj.content_type or 'application/octet-stream',
        'x-upsert': 'true',
    }
    try:
        resp = http_requests.post(upload_url, headers=headers, data=file_obj.read(), timeout=30)
        if resp.status_code in (200, 201):
            return f"{SUPABASE_URL}/storage/v1/object/public/{RESUME_BUCKET}/{unique_name}"
        print(f"Supabase upload failed {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"Supabase upload error: {e}")
    return ''

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({"message": "Welcome to the Flask API!"})

@main_bp.route('/content')
def get_content():
    response = WebsiteModel.get_all_content()
    return jsonify(response)

@main_bp.route('/seed-db', methods=['POST'])
def seed_db():
    response = WebsiteModel.seed_from_json()
    return jsonify(response)

@main_bp.route('/test-db')
def test_db():
    try:
        data = DBHelper.find_one('users', filters={'id': 1})
        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/content/update', methods=['POST'])
def update_content():
    data = request.get_json()
    if not data or 'payload' not in data:
        return jsonify({"status": "error", "payload": "Missing payload"}), 400
    response = WebsiteModel.update_content(data['payload'])
    return jsonify(response)

@main_bp.route('/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"status": "error", "payload": "Missing email or password"}), 400
    response = WebsiteModel.admin_login(data['email'], data['password'])
    return jsonify(response)

@main_bp.route('/submit-idea', methods=['POST'])
def submit_idea():
    data = request.get_json()
    name = data.get('name', '').strip() if data.get('name') else ''
    email = data.get('email', '').strip() if data.get('email') else ''
    idea = data.get('idea', '').strip() if data.get('idea') else ''

    if not idea or len(idea) < 10:
        return jsonify({"status": "error", "message": "Idea must be at least 10 characters"}), 400

    try:
        DBHelper.insert(
            'idea_submissions',
            return_column='id',
            name=name,
            email=email,
            idea=idea
        )
        # Send confirmation email immediately (no delay — avoids Render free-tier sleep killing the timer)
        if email:
            try:
                send_idea_confirmation(email, name, idea)
                print(f"[EMAIL] Confirmation sent to {email}")
            except Exception as email_err:
                # Email failure must NOT break the submission — just log it
                print(f"[EMAIL ERROR] Failed to send confirmation to {email}: {email_err}")

        return jsonify({"status": "success", "message": "Idea submitted successfully!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": f"Failed to store submission: {str(e)}"}), 500

@main_bp.route('/submit-talent', methods=['POST'])
def submit_talent():
    # Support both multipart/form-data (with file) and application/json
    if request.content_type and 'multipart/form-data' in request.content_type:
        first_name = (request.form.get('firstName') or '').strip()
        email = (request.form.get('email') or '').strip()
        interest = (request.form.get('interest') or '').strip()
        linkedin = (request.form.get('linkedin') or '').strip()
        resume_file = request.files.get('resume')
    else:
        data = request.get_json() or {}
        first_name = data.get('firstName', '').strip()
        email = data.get('email', '').strip()
        interest = data.get('interest', '').strip()
        linkedin = data.get('linkedin', '').strip()
        resume_file = None

    if not email or not first_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    # Upload resume if provided
    resume_url = ''
    if resume_file and resume_file.filename:
        resume_url = upload_resume_to_supabase(resume_file, resume_file.filename)

    try:
        insert_kwargs = dict(
            full_name=first_name,
            email=email,
            interest_area=interest,
            linkedin_url=linkedin,
        )
        if resume_url:
            insert_kwargs['resume_url'] = resume_url

        DBHelper.insert('talent_submissions', return_column='id', **insert_kwargs)
        # Send confirmation email
        send_talent_confirmation(email, first_name, interest)

        return jsonify({"status": "success", "message": "Talent application submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store application"}), 500

@main_bp.route('/submit-contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    first_name = data.get('firstName', '').strip()
    email = data.get('workEmail', '').strip()
    company = data.get('company', '').strip()
    service = data.get('serviceInterest', '').strip()
    stage = data.get('projectStage', '').strip()
    message = data.get('message', '').strip()

    if not email or not first_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    try:
        DBHelper.insert(
            'contact_inquiries',
            return_column='id',
            full_name=first_name,
            work_email=email,
            company_name=company,
            service_interest=service,
            project_stage=stage,
            message=message
        )
        # Send confirmation email
        send_contact_confirmation(email, first_name, service, message)

        return jsonify({"status": "success", "message": "Contact form submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store contact"}), 500

@main_bp.route('/submit-investor', methods=['POST'])
def submit_investor():
    data = request.get_json()
    full_name = data.get('fullName', '').strip()
    email = data.get('email', '').strip()
    expertise = data.get('expertise', '').strip()
    preferred_roles = data.get('preferredRoles', [])
    background = data.get('background', '').strip()

    if not email or not full_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    try:
        DBHelper.insert(
            'investor_submissions',
            return_column='id',
            full_name=full_name,
            email=email,
            expertise=expertise,
            preferred_roles=preferred_roles,
            background=background
        )
        # Send confirmation email
        send_investor_confirmation(email, full_name, expertise)

        return jsonify({"status": "success", "message": "Investor application submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store investor submission"}), 500


