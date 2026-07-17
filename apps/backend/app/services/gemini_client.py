import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_MODEL_WEB = os.getenv("GEMINI_MODEL_WEB", "gemini-2.5-flash")

client = None

if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"⚠️ Failed to initialize Gemini GenAI client: {e}")
else:
    print("⚠️ GEMINI_API_KEY is not set in .env")

def require_gemini_client() -> genai.Client:
    if not client:
        raise ValueError("Gemini client is not initialized. Please configure GEMINI_API_KEY in apps/backend/.env")
    return client
