from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.app.models.content import ContentModel

content_bp = Blueprint("content", __name__)

@content_bp.route("/content")
def get_content():
    """Retrieve all active site configuration settings."""
    response = ContentModel.get_all_content()
    return jsonify(response)


@content_bp.route("/seed-db", methods=["POST"])
@jwt_required()
def seed_db():
    """Seed the site content table using the local config.json template file."""
    response = ContentModel.seed_from_json()
    return jsonify(response)


@content_bp.route("/content/update", methods=["POST"])
@jwt_required()
def update_content():
    """Update active website copy settings using provided admin payload."""
    data = request.get_json()
    if not data or "payload" not in data:
        return jsonify({"status": "error", "payload": "Missing payload"}), 400
        
    response = ContentModel.update_content(data["payload"])
    return jsonify(response)
