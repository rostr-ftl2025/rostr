import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import Database
from database.models import Player
from controllers.player_controller import PlayerController

from dotenv import load_dotenv

# Load .env variables
load_dotenv(dotenv_path="./.env")

def main():
    # Get DSN from environment
    dsn = os.getenv("DSN")
    if not dsn:
        raise ValueError("DSN not found in environment. Check your .env file.")

    # Initialize database and objects
    db = Database(dsn)
    player = Player(db)
    controller = PlayerController(db)  # assuming your PlayerController takes db in __init__

    # Pick a test player
    name = "Tarik Skubal"
    season = 2025

    print(f"Fetching stats for {name} ({season})...")
    stats = controller.get_pitcher_stats(name, season)

    print(f"\nStats returned:\n{stats}")

    grade = player.calculate_pitcher_grade(stats)
    print(f"\nCalculated Pitcher Grade for {name}: {grade}")

if __name__ == "__main__":
    main()