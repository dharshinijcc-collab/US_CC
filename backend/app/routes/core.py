from flask import Blueprint, jsonify
from backend.app.db import DBHelper

core_bp = Blueprint("core", __name__)

@core_bp.route("/")
def index():
    """Welcome index endpoint."""
    return jsonify({"message": "Welcome to the Flask API!"})


@core_bp.route("/test-db")
def test_db():
    """Healthcheck endpoint verifying connection to database backend."""
    try:
        data = DBHelper.find_one("site_content", filters={"content_key": "main_config"})
        return jsonify({"status": "success", "message": "Database connection healthy", "sample": bool(data)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
