import os
import json
from backend.app.db import DBHelper

class ContentModel:
    @staticmethod
    def get_all_content() -> dict[str, any]:
        """Fetches all content from the database and returns it in the requested format.

        Returns:
            Dict containing status success/error and payload config data.
        """
        try:
            content = DBHelper.find_one(
                "site_content",
                filters={"content_key": "main_config", "active": True}
            )
            if content:
                payload = content.get("payload")
                return {
                    "status": "success",
                    "payload": payload
                }
            else:
                return {
                    "status": "error",
                    "payload": "No content found"
                }
        except Exception as e:
            return {
                "status": "error",
                "payload": str(e)
            }

    @staticmethod
    def get_content_by_key(key: str) -> dict[str, any]:
        """Retrieves specific site content by its unique key.

        Args:
            key: Content key.

        Returns:
            Dict containing status success/error and payload.
        """
        try:
            content = DBHelper.find_one("site_content", filters={"content_key": key})
            if content:
                return {
                    "status": "success",
                    "payload": content
                }
            return {"status": "error", "payload": "Not found"}
        except Exception as e:
            return {"status": "error", "payload": str(e)}

    @staticmethod
    def seed_from_json() -> dict[str, any]:
        """Reads config.json from the backend folder and seeds the database.

        Returns:
            Dict containing status success/error.
        """
        try:
            config_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "..", "config.json")
            )
            
            if not os.path.exists(config_path):
                return {"status": "error", "payload": f"File not found: {config_path}"}

            with open(config_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)

            with DBHelper.cursor() as cur:
                cur.execute("""
                    INSERT INTO site_content (content_key, payload, active)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (content_key) 
                    DO UPDATE SET payload = EXCLUDED.payload, active = EXCLUDED.active
                    RETURNING id;
                """, ("main_config", json.dumps(config_data), True))
                res = cur.fetchone()
                return {
                    "status": "success",
                    "payload": f"Database seeded successfully. ID: {res[0]}"
                }
        except Exception as e:
            return {"status": "error", "payload": str(e)}

    @staticmethod
    def update_content(payload: dict[str, any]) -> dict[str, any]:
        """Updates the main_config payload in the database.

        Args:
            payload: New site configuration dictionary.

        Returns:
            Dict containing status success/error.
        """
        try:
            with DBHelper.cursor() as cur:
                cur.execute("""
                    UPDATE site_content 
                    SET payload = %s 
                    WHERE content_key = 'main_config'
                    RETURNING id;
                """, (json.dumps(payload),))
                res = cur.fetchone()
                if res:
                    return {"status": "success", "payload": "Content updated successfully"}
                else:
                    return {"status": "error", "payload": "No content found to update"}
        except Exception as e:
            return {"status": "error", "payload": str(e)}
