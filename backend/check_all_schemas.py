import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import postgres

def check_all_schemas():
    try:
        conn = postgres.get_connection()
        cur = conn.cursor()
        
        tables = ['site_content', 'idea_submissions', 'talent_submissions', 'contact_inquiries', 'investor_submissions']
        
        for table_name in tables:
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}'")
            columns = cur.fetchall()
            print(f"\n--- {table_name} ---")
            for col in columns:
                print(f" - {col[0]}: {col[1]}")
                
    except Exception as e:
        print(f"Error checking schemas: {e}")
    finally:
        try:
            cur.close()
            postgres.release_connection(conn)
        except:
            pass

if __name__ == "__main__":
    check_all_schemas()
