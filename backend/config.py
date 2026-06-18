import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

POSTGRES_URI = os.getenv("POSTGRES_URI")
G_SECRET_KEY = os.getenv("G_SECRET_KEY", "default_secret_key")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Email configuration
GMAIL_USER = os.getenv("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
TEAM_NOTIFICATION_EMAIL = os.getenv("TEAM_NOTIFICATION_EMAIL", "team@crestcode.studio")

if not POSTGRES_URI:
    print("WARNING: POSTGRES_URI not found in environment variables.")
if not GMAIL_USER or not GMAIL_APP_PASSWORD:
    print("WARNING: GMAIL_USER or GMAIL_APP_PASSWORD not found - email sending will be disabled.")
