import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

POSTGRES_URI = os.getenv("POSTGRES_URI")
G_SECRET_KEY = os.getenv("G_SECRET_KEY", "default_secret_key")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

if not POSTGRES_URI:
    print("WARNING: POSTGRES_URI not found in environment variables.")
