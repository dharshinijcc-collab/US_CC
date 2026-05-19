import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()
dsn = os.getenv("POSTGRES_URI")

try:
    conn = psycopg2.connect(dsn, connect_timeout=10)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT content_key, active, payload FROM site_content WHERE content_key = 'main_config';")
    row = cur.fetchone()
    if row:
        import json
        # Print a snippet of the payload to verify
        payload_str = json.dumps(row['payload'])
        print(f"Main Config Found. Payload length: {len(payload_str)}")
        if 'Ideate' in payload_str:
            print("SUCCESS: 'Ideate' found in payload.")
        else:
            print("FAILURE: 'Ideate' NOT found in payload.")
    else:
        print("Main Config NOT found.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
