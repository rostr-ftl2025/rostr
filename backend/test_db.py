import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()
dsn = os.getenv("DSN")
print(f"Testing connection with DSN: {dsn}")

try:
    conn = psycopg2.connect(dsn)
    print("✓ Database connection successful!")
    conn.close()
except Exception as e:
    print(f"✗ Connection failed: {e}")
