import os
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO

from backend.config import G_SECRET_KEY, REDIS_URL
from backend.app.db import postgres

api = Api()
jwt = JWTManager()
socketio = SocketIO()


def create_app(test_config=None):
    """Application factory for Flask app."""
    app = Flask(
        __name__,
        instance_relative_config=True,
    )
    
    # Configuration
    app.secret_key = G_SECRET_KEY
    app.config["JWT_SECRET_KEY"] = G_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    
    # Initialize Extensions
    CORS(app, resources={
        r"/server/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
        }
    })
    
    # Initialize database connection pool
    postgres.init_app()
    
    # Initialize security extension
    jwt.init_app(app)
    api.init_app(app)
    # socketio.init_app(app, message_queue=REDIS_URL, cors_allowed_origins="*")

    # Register blueprints under unified /server/api prefix
    from backend.app.routes import core_bp, auth_bp, content_bp, submissions_bp
    
    app.register_blueprint(core_bp, url_prefix="/server/api")
    app.register_blueprint(auth_bp, url_prefix="/server/api")
    app.register_blueprint(content_bp, url_prefix="/server/api")
    app.register_blueprint(submissions_bp, url_prefix="/server/api")

    return app
