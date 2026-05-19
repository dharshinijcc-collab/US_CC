import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import postgres

def list_tables():
    try:
        conn = postgres.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cur.fetchall()
        print(f"All tables in Supabase: {[t[0] for t in tables]}")
    except Exception as e:
        print(f"Error listing tables: {e}")
    finally:
        try:
            cur.close()
            postgres.release_connection(conn)
        except:
            pass

if __name__ == "__main__":
    list_tables()
