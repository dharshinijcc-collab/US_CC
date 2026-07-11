import bcrypt
from backend.app.db import DBHelper

class AdminModel:
    @staticmethod
    def login(email: str, password: str) -> dict[str, any]:
        """Admin login check against database with encrypted password verification.

        Args:
            email: Admin user's email address.
            password: Raw plain text password.

        Returns:
            Dict containing status success/error and payload data.
        """
        try:
            with DBHelper.cursor() as cur:
                # Fetch admin user from database
                cur.execute(
                    "SELECT id, email, password_hash FROM admin_users WHERE email = %s",
                    (email,)
                )
                admin_user = cur.fetchone()

                if not admin_user:
                    return {"status": "error", "payload": "Invalid email or password"}

                user_id, user_email, password_hash = admin_user

                # Verify password using bcrypt
                password_bytes = password.encode("utf-8")
                hash_bytes = password_hash.encode("utf-8")

                if bcrypt.checkpw(password_bytes, hash_bytes):
                    return {
                        "status": "success",
                        "payload": {
                            "user": {"email": user_email, "id": user_id},
                            "token": "mock-admin-token"
                        }
                    }
                else:
                    return {"status": "error", "payload": "Invalid email or password"}
        except Exception as e:
            return {"status": "error", "payload": str(e)}
