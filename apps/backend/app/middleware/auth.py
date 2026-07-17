import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import supabase_admin

auth_scheme = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> dict:
    """
    FastAPI dependency to verify admin JWT token and check credentials against admin_users.
    """
    secret_key = os.getenv("G_SECRET_KEY")
    if not secret_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error: G_SECRET_KEY is missing"
        )

    token = credentials.credentials
    try:
        # Decode token using PyJWT matching standard HS256 algorithm
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
        email = decoded.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid token payload"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid token"
        )

    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not configured"
        )

    try:
        # Query db to verify email matches active admin profile
        response = supabase_admin.table("admin_users").select("id").eq("email", email).maybe_single().execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Access denied"
            )
        return decoded
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized: Access verification failed ({str(e)})"
        )
