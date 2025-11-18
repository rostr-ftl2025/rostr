"""
Run this script once to manually seed the Test Opponent team in the database.
Usage: python -m scripts.seed_opponent
"""

import os
import sys
from pathlib import Path

# Add parent directory to path so we can import from backend modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from database import Database
from database.data_access_postgresql import TeamDataAccess

load_dotenv()

def seed_opponent_team():
    """Manually create the Test Opponent team with a fixed roster"""
    
    DSN = os.getenv("DSN")
    if not DSN:
        print("[ERROR] No DSN found in environment variables")
        return
    
    db = Database(DSN)
    team_data_access = TeamDataAccess(db)
    
    print("[INFO] Starting opponent team seeding...")
    
    try:
        # Use the existing ensure_test_opponent method
        result = team_data_access.ensure_test_opponent()
        
        print(f"[SUCCESS] Test Opponent team created/verified:")
        print(f"  Team ID: {result.get('id')}")
        print(f"  Team Name: {result.get('team_name')}")
        print(f"  User ID: {result.get('user_id')}")
        
        # Verify players were added
        players = team_data_access.get_all_players(result.get('id'))
        print(f"[SUCCESS] Roster has {len(players)} players:")
        for p in players:
            print(f"  - {p.get('player_name')} ({p.get('position')})")
        
        db.close()
        print("\n[DONE] Opponent team successfully seeded!")
        
    except Exception as e:
        print(f"[ERROR] Failed to seed opponent team: {e}")
        import traceback
        traceback.print_exc()
        db.close()

if __name__ == "__main__":
    seed_opponent_team()
