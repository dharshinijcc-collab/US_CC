"""
Migration: Add admin_users table for storing encrypted admin credentials.
Run this once: python backend/migrate_add_admin_users.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import postgres

def migrate():
    postgres.init_app()
    conn = postgres.get_connection()
    try:
        cur = conn.cursor()
        # Create admin_users table if it doesn't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
        print("Migration complete: admin_users table created.")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        postgres.release_connection(conn)

if __name__ == '__main__':
    migrate()
