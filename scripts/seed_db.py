import json
import os
import psycopg2
from dotenv import load_dotenv

def seed_database():
    # Load environment variables from the backend folder
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
    db_uri = os.getenv("POSTGRES_URI")
    
    if not db_uri:
        print("[ERROR] POSTGRES_URI not found in .env")
        return

    # Load config.json
    config_path = "backend/config.json"
    if not os.path.exists(config_path):
        print(f"[ERROR] {config_path} not found")
        return

    with open(config_path, 'r', encoding='utf-8') as f:
        config_data = json.load(f)

    try:
        # Connect to Supabase/Postgres
        conn = psycopg2.connect(db_uri)
        cur = conn.cursor()

        # 1. Create the table if it doesn't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS site_content (
                id SERIAL PRIMARY KEY,
                content_key TEXT UNIQUE,
                payload JSONB,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Insert or Update the config
        cur.execute("""
            INSERT INTO site_content (content_key, payload, active)
            VALUES (%s, %s, %s)
            ON CONFLICT (content_key) 
            DO UPDATE SET payload = EXCLUDED.payload, active = EXCLUDED.active;
        """, ("main_config", json.dumps(config_data), True))

        conn.commit()
        print("[OK] Database seeded successfully with config.json content!")

    except Exception as e:
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        if cur: cur.close()
        if conn: conn.close()

if __name__ == "__main__":
    seed_database()
