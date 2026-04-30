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
