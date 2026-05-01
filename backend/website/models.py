from backend.db import DBHelper

class WebsiteModel:
    @staticmethod
    def get_all_content():
        """
        Fetches all content from the database and returns it in the requested format.
        """
        try:
            # Assuming a 'content' table exists. Adjust table name as needed.
            # find_one might not be enough if there's multiple, but user asked for 'the website content'
            # I'll use a generic fetch. Since DBHelper only has find_one and insert, 
            # I'll use find_one for now or assume they want a single config object.
            content = DBHelper.find_one('site_content', filters={'content_key': 'main_config', 'active': True})
            if content:
                # Return the payload directly if it's already a dict (from RealDictCursor)
                # or parse it if it's a string. psycopg2 usually handles jsonb automatically.
                payload = content.get('payload')
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
    def get_content_by_key(key):
        try:
            content = DBHelper.find_one('site_content', filters={'content_key': key})
            if content:
                return {
                    "status": "success",
                    "payload": content
                }
            return {"status": "error", "payload": "Not found"}
        except Exception as e:
            return {"status": "error", "payload": str(e)}

    @staticmethod
    def seed_from_json():
        """
        Reads config.json from the backend folder and seeds the database.
        """
        import os
        import json
        from backend.db import postgres, _local
        try:
            # Path to backend/config.json
            # __file__ is backend/website/models.py, so go up two levels
            config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "config.json"))
            
            if not os.path.exists(config_path):
                return {"status": "error", "payload": f"File not found: {config_path}"}

            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)

            # Use a direct query for ON CONFLICT support
            conn = postgres.get_connection()
            cur = conn.cursor()
            try:
                cur.execute("""
                    INSERT INTO site_content (content_key, payload, active)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (content_key) 
                    DO UPDATE SET payload = EXCLUDED.payload, active = EXCLUDED.active
                    RETURNING id;
                """, ("main_config", json.dumps(config_data), True))
                res = cur.fetchone()
                conn.commit()
                return {"status": "success", "payload": f"Database seeded successfully. ID: {res[0]}"}
            finally:
                cur.close()
                postgres.release_connection(conn)
        except Exception as e:
            return {"status": "error", "payload": str(e)}

    @staticmethod
    def update_content(payload):
        """
        Updates the main_config payload in the database.
        """
        from backend.db import postgres
        import json
        try:
            conn = postgres.get_connection()
            cur = conn.cursor()
            try:
                cur.execute("""
                    UPDATE site_content 
                    SET payload = %s 
                    WHERE content_key = 'main_config'
                    RETURNING id;
                """, (json.dumps(payload),))
                res = cur.fetchone()
                conn.commit()
                if res:
                    return {"status": "success", "payload": "Content updated successfully"}
                else:
                    return {"status": "error", "payload": "No content found to update"}
            finally:
                cur.close()
                postgres.release_connection(conn)
        except Exception as e:
            return {"status": "error", "payload": str(e)}

    @staticmethod
    def admin_login(email, password):
        """
        Simple admin login check.
        """
        # Hardcoded for demonstration as requested
        admin_email = "admin@ccus.com"
        admin_pass = "admin123"
        
        if email == admin_email and password == admin_pass:
            return {"status": "success", "payload": {"user": {"email": email}, "token": "mock-admin-token"}}
        else:
            return {"status": "error", "payload": "Invalid email or password"}
