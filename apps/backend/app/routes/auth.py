import os
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.supabase_client import supabase_admin
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/admin-login")
def admin_login(payload: AdminLoginRequest):
    secret_key = os.getenv("G_SECRET_KEY")
    if not secret_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="G_SECRET_KEY configuration is missing on the server."
        )

    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured."
        )

    try:
        # 1. Fetch user from admin_users
        response = supabase_admin.table("admin_users") \
            .select("id, email, password_hash") \
            .eq("email", payload.email) \
            .maybe_single() \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email or password"
            )

        user_data = response.data
        # 2. Compare password using bcrypt
        password_hash = user_data["password_hash"].encode('utf-8')
        if not bcrypt.checkpw(payload.password.encode('utf-8'), password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email or password"
            )

        # 3. Generate JWT access token with 24h expiry
        expiry = datetime.now(timezone.utc) + timedelta(hours=24)
        token = jwt.encode(
            {"email": user_data["email"], "exp": int(expiry.timestamp())},
            secret_key,
            algorithm="HS256"
        )

        return {
            "status": "success",
            "payload": {
                "user": {"email": user_data["email"], "id": user_data["id"]},
                "token": token
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/check")
def auth_check(current_user: dict = Depends(get_current_admin)):
    return {
        "status": "success",
        "authenticated": True,
        "user": current_user,
        "payload": current_user
    }

@router.post("/logout")
def auth_logout():
    return {"status": "success", "payload": "Logged out successfully"}


class SetupAdminRequest(BaseModel):
    email: EmailStr
    password: str
    setup_key: str  # Must match SETUP_KEY env var as a one-time guard


@router.post("/setup-admin")
def setup_first_admin(payload: SetupAdminRequest):
    """
    One-time bootstrap endpoint to create the first admin user.
    Only works if NO admin users exist yet in the database.
    Requires SETUP_KEY env var to match payload.setup_key.
    """
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured.")

    # Guard: require SETUP_KEY from env
    setup_key = os.getenv("SETUP_KEY", "")
    if not setup_key or payload.setup_key != setup_key:
        raise HTTPException(status_code=403, detail="Invalid setup key.")

    try:
        # Only allow if no admin users exist yet
        existing = supabase_admin.table("admin_users").select("id", count="exact").limit(1).execute()
        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=409,
                detail="Admin user already exists. Use the login endpoint instead."
            )

        # Hash password with bcrypt
        password_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        result = supabase_admin.table("admin_users").insert({
            "email": payload.email,
            "password_hash": password_hash
        }).execute()

        return {
            "status": "success",
            "payload": f"Admin user '{payload.email}' created successfully. You can now log in."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin-status")
def admin_status():
    """Check if any admin user has been set up (no credentials exposed)."""
    if not supabase_admin:
        raise HTTPException(status_code=503, detail="Database client not configured.")
    try:
        existing = supabase_admin.table("admin_users").select("id", count="exact").limit(1).execute()
        has_admin = bool(existing.data and len(existing.data) > 0)
        return {"status": "success", "has_admin": has_admin}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
