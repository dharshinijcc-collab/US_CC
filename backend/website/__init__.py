import os
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
from backend.config import G_SECRET_KEY, REDIS_URL
from backend.db import postgres

api = Api()
jwt = JWTManager()
socketio = SocketIO()

def create_app(test_config=None):
    app = Flask(
        __name__,
        instance_relative_config=True,
    )
    
    # Configuration
    app.secret_key = G_SECRET_KEY
    app.config['JWT_SECRET_KEY'] = G_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # Initialize Extensions
    CORS(app)
    postgres.init_app()
    jwt.init_app(app)
    api.init_app(app)
    # socketio.init_app(app, message_queue=REDIS_URL, cors_allowed_origins="*")

    # Register Blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp, url_prefix='/server/api')

    return app
