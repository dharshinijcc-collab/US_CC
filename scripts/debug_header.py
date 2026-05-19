import json
import os
import psycopg2
from dotenv import load_dotenv

def get_db_config():
    # Load environment variables from the backend folder
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
    db_uri = os.getenv("POSTGRES_URI")
    
    if not db_uri:
        print("[ERROR] POSTGRES_URI not found in .env")
        return

    try:
        # Connect to Supabase/Postgres
        conn = psycopg2.connect(db_uri)
        cur = conn.cursor()

        # Fetch the config
        cur.execute("SELECT payload FROM site_content WHERE content_key = 'main_config' AND active = TRUE LIMIT 1")
        row = cur.fetchone()
        
        if row:
            config = row[0]
            header = config.get('global', {}).get('header', {})
            print("--- CURRENT DB HEADER CONFIG ---")
            print(json.dumps(header, indent=2))
        else:
            print("[ERROR] No config found in DB")

    except Exception as e:
        print(f"[ERROR] {e}")
    finally:
        if cur: cur.close()
        if conn: conn.close()

if __name__ == "__main__":
    get_db_config()
