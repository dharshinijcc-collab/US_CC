from flask import Blueprint, jsonify, request
from backend.db import DBHelper
from .models import WebsiteModel

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({"message": "Welcome to the Flask API!"})

@main_bp.route('/content')
def get_content():
    # Fetch content using the model
    response = WebsiteModel.get_all_content()
    return jsonify(response)

@main_bp.route('/seed-db', methods=['POST'])
def seed_db():
    response = WebsiteModel.seed_from_json()
    return jsonify(response)

@main_bp.route('/test-db')
def test_db():
    try:
        # Example: Try to find a user with id 1
        # This assumes a 'users' table exists. 
        # Adjust table name as needed for your database.
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
        return jsonify({"status": "success", "message": "Idea submitted successfully!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store submission"}), 500

@main_bp.route('/submit-talent', methods=['POST'])
def submit_talent():
    data = request.get_json()
    first_name = data.get('firstName', '').strip()
    email = data.get('email', '').strip()
    interest = data.get('interest', '').strip()
    linkedin = data.get('linkedin', '').strip()

    if not email or not first_name:
        return jsonify({"status": "error", "message": "Name and Email are required"}), 400

    try:
        DBHelper.insert(
            'talent_submissions',
            return_column='id',
            full_name=first_name,
            email=email,
            interest_area=interest,
            linkedin_url=linkedin
        )
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
        return jsonify({"status": "success", "message": "Contact form submitted!"})
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Failed to store contact"}), 500
