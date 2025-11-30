from flask import jsonify
from ..database.data_access_interface import TeamDataAccessInterface
from ..services.pitcher_recomender_service import PitcherRecommenderService
from pybaseball import pitching_stats

class RecommendLineupInteractor:
    def __init__(self, team_data_access: TeamDataAccessInterface):
        """
        team_data_access: implementation of TeamDataAccessInterface
        """
        self.team_data_access = team_data_access
        
    def execute(self, team_id, profile):
        try:
            # Get all players on this team
            players = self.team_data_access.get_all_players(team_id)
            if not players:
                return jsonify({"error": "No players found for this team"}), 404

            # Fetch MLB pitching stats (2025)
            stats = pitching_stats(2025)
            stats.columns = [c.strip().lower() for c in stats.columns]

            #For each player, try to find matching MLB stat row
            enriched_pitchers = []
            for p in players:
                name = p.get("player_name")
                match = stats[stats["name"].str.contains(name, case=False, na=False)]
                if match.empty:
                    print(f"No stat match found for {name}")
                    continue

                row = match.iloc[0]
                enriched_pitchers.append({
                    "name": row["name"],
                    "team": row.get("team", "Unknown"),
                    "pitching+": row.get("pitching+", 100),
                    "stuff+": row.get("stuff+", 100),
                    "k-bb%": row.get("k-bb%", 0),
                    "xfip-": row.get("xfip-", 100),
                    "barrel%": row.get("barrel%", 0),
                    "hardhit%": row.get("hardhit%", 0),
                    "gb%": row.get("gb%", 0),
                    "swstr%": row.get("swstr%", 0),
                    "wpa/li": row.get("wpa/li", 0),
                })

            # Handle case where none were matched
            if not enriched_pitchers:
                return jsonify({"error": "No matching MLB stats found for team players"}), 404

            # Generate lineup recommendation using the selected profile
            df, explanation = PitcherRecommenderService.recommend_starting_pitchers(enriched_pitchers, 5, profile)

            # Convert DataFrame to list of dicts with consistent key names
            records = df.to_dict(orient="records")

            # Add 'position' and make sure keys are frontend-friendly
            formatted = [
                {
                    "rank": int(r["rank"]),
                    "name": r["name"],
                    "position": "SP", 
                    "score": round(float(r["score"]), 2),
                }
                for r in records
            ]

            return jsonify({
                "lineup": formatted,
                "explanation": explanation
            }), 200

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500