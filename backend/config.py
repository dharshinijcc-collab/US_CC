import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

POSTGRES_URI = os.getenv("POSTGRES_URI")
G_SECRET_KEY = os.getenv("G_SECRET_KEY", "default_secret_key")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Email configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Crestcode <contact@cctps.com>")
TEAM_NOTIFICATION_EMAIL = os.getenv("TEAM_NOTIFICATION_EMAIL", "contact@cctps.com")
REPLY_TO_EMAIL = os.getenv("REPLY_TO_EMAIL", "contact@cctps.com")

if not POSTGRES_URI:
    print("WARNING: POSTGRES_URI not found in environment variables.")
if not RESEND_API_KEY:
    print("WARNING: RESEND_API_KEY not found - Resend email sending will be disabled.")

