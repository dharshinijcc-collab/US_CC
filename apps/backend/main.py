import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Import all API Routers
# SOCIAL VALIDATION ENGINE — TEMPORARILY DISABLED
# from app.routes.social_validation import router as social_val_router
from app.routes.auth import router as auth_router
from app.routes.submit import router as submit_router
from app.routes.submissions import router as submissions_router
from app.routes.auxiliary import router as auxiliary_router
from app.routes.idea_validator import router as idea_val_router

app = FastAPI(
    title="CrestCode Venture Studio API",
    description="Python FastAPI backend orchestrating AI validators, submissions, auth and CMS.",
    version="1.0.0"
)

# Configure CORS (permits React frontend cross-origin requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under standard /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(submit_router, prefix="/api")
app.include_router(submissions_router, prefix="/api")
app.include_router(auxiliary_router, prefix="/api")
app.include_router(idea_val_router, prefix="/api")
# app.include_router(social_val_router) # DISABLED — social validation engine off

@app.get("/")
def root():
    return {"status": "online", "message": "CrestCode Venture Studio Python API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
