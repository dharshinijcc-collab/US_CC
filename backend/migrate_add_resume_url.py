"""
Migration: Add resume_url column to talent_submissions table.
Run this once: python backend/migrate_add_resume_url.py
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
        # Add column if it doesn't already exist
        cur.execute("""
            ALTER TABLE talent_submissions
            ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT NULL;
        """)
        conn.commit()
        cur.close()
        print("Migration complete: resume_url column added to talent_submissions.")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        postgres.release_connection(conn)

if __name__ == '__main__':
    migrate()
