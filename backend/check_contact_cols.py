import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import postgres

def check_columns(table_name):
    try:
        conn = postgres.get_connection()
        cur = conn.cursor()
        cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'")
        columns = cur.fetchall()
        print(f"Columns in {table_name}: {[col[0] for col in columns]}")
    except Exception as e:
        print(f"Error checking {table_name}: {e}")
    finally:
        try:
            cur.close()
            postgres.release_connection(conn)
        except:
            pass

if __name__ == "__main__":
    check_columns('contact_inquiries')
