from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from backend.app.models.admin import AdminModel

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/auth/admin-login", methods=["POST"])
def admin_login():
    """Verify administrator login credentials and return an access token."""
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"status": "error", "payload": "Missing email or password"}), 400
        
    response = AdminModel.login(data["email"], data["password"])
    
    if response.get("status") == "success":
        email = response["payload"]["user"]["email"]
        token = create_access_token(identity=email)
        response["payload"]["token"] = token
        
    return jsonify(response)
