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
