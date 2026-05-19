import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
dsn = os.getenv("POSTGRES_URI")

print(f"Attempting to connect to: {dsn.split('@')[-1]}")
try:
    conn = psycopg2.connect(dsn, connect_timeout=10)
    print("Connection successful!")
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(f"Server version: {cur.fetchone()}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
