"""
Migration script to add opponent_team_id column to users table.
Run this once if you have an existing database.
Usage: python -m scripts.migrate_add_opponent_team
"""

import os
import sys
from pathlib import Path

# Add parent directory to path so we can import from backend modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from ..database import Database

load_dotenv()

def migrate_add_opponent_team():
    """Add opponent_team_id column to users table if it doesn't exist"""
    
    DSN = os.getenv("DSN")
    if not DSN:
        print("[ERROR] No DSN found in environment variables")
        return
    
    db = Database(DSN)
    
    print("[INFO] Starting migration to add opponent_team_id column...")
    
    try:
        # Check if column already exists
        check_query = """
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name='opponent_team_id';
        """
        result = db.execute(check_query, fetchone=True)
        
        if result:
            print("[INFO] Column opponent_team_id already exists. Migration not needed.")
        else:
            # Add the column
            alter_query = """
            ALTER TABLE users 
            ADD COLUMN opponent_team_id INT;
            """
            db.execute(alter_query, fetchone=False)
            print("[SUCCESS] Added opponent_team_id column to users table.")
        
        db.close()
        print("\n[DONE] Migration completed successfully!")
        
    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        import traceback
        traceback.print_exc()
        db.close()

if __name__ == "__main__":
    migrate_add_opponent_team()
