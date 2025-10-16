import datetime
from flask import Blueprint, request, jsonify
from database import Database, models
import pybaseball
from pybaseball import playerid_lookup, statcast_pitcher
import pandas as pd
import rapidfuzz

pybaseball.cache.enable()


class PlayerController:
    def __init__(self, db: Database):
        self.player_model = models.Player(db)
        self.bp = Blueprint("players", __name__)

        self.bp.add_url_rule("/api/search-pitcher", view_func=self.search_pitcher, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/add-player", view_func=self.add_player, methods=["POST"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/remove-player/<string:player_name>", view_func=self.remove_player, methods=["DELETE"])

        self.all_pitcher_data = pybaseball.pitching_stats(2025)

        """
        IDfg: string;
        Name: string;
        Team: string;
        Age: number;
        W: number;
        L: number;
  """

    def search_pitcher(self):
        
        searched_name = request.args.get("name")
        matches = rapidfuzz.process.extract(searched_name, self.all_pitcher_data["Name"], score_cutoff=0.7)
        matched_players_data = self.all_pitcher_data[self.all_pitcher_data["Name"].isin([data[0] for data in matches])]

        data_as_array = matched_players_data[["IDfg", "Name", "Team", "Age", "W", "L"]].to_dict(orient="records")

        return jsonify(data_as_array)

    def add_player(self, team_id):
        data = request.json
        player_name = data.get("player_name")
        mlbid = data.get("mlbid")
        idfg = data.get("idfg")
        position = data.get("position")

        if not player_name:
            return jsonify({"error": "player_name is required"}), 400

        try:
            player = self.player_model.create(team_id, player_name, mlbid, idfg, position)

            player_stats = self.get_pitcher_stats(player_name, 2025)
            player_grade = self.player_model.calculate_pitcher_grade(player_stats)
            
            print(player_grade)

            return jsonify(player), 201
        except Exception as e:
            print(e.with_traceback())
            return jsonify({"error": str(e)}), 400

    def remove_player(self, team_id, player_name):
        result = self.player_model.remove(team_id, player_name)
        if not result:
            return jsonify({"error": "Player not found"}), 404
        return jsonify({"message": f"Removed player {player_name}"}), 200


    def get_pitcher_stats(self, name: str, season: int) -> dict[str,float]:
        """
        Retrieve key Statcast stats for a given pitcher and season using pybaseball.

        Returns a dictionary:
        {
            'BA', 'xBA', 'SLG', 'xSLG', 'wOBA', 'xwOBA', 'ERA', 'xERA'
        }
        """

        try:
            # Get MLB player ID
            first, last = name.split(" ")
            pid = playerid_lookup(last, first).key_mlbam.values[0]

            # Define season range
            start_date = f"{season}-03-01"
            end_date = f"{season}-11-30"

            # Pull raw Statcast data
            df = statcast_pitcher(start_date, end_date, pid)

            if df.empty:
                raise ValueError(f"No Statcast data found for {name} ({season})")

            # Directly use Statcast-calculated expected stats
            stats = {
                "BA": df["ba"].mean(skipna=True),
                "xBA": df["estimated_ba_using_speedangle"].mean(skipna=True),
                "SLG": df["slg"].mean(skipna=True),
                "xSLG": df["estimated_slg_using_speedangle"].mean(skipna=True),
                "wOBA": df["woba_value"].mean(skipna=True),
                "xwOBA": df["estimated_woba_using_speedangle"].mean(skipna=True),
                "ERA": df["era"].mean(skipna=True) if "era" in df.columns else 0.0,
                "xERA": df["pitch_xera"].mean(skipna=True) if "pitch_xera" in df.columns else 0.0,
            }

            # Clean any NaNs
            for k, v in stats.items():
                stats[k] = float(v) if pd.notna(v) else 0.0

            return stats

        except Exception as e:
            print(f"[Error] Could not retrieve Statcast data for {name}: {e}")
            return {
                "BA": 0.0, "xBA": 0.0,
                "SLG": 0.0, "xSLG": 0.0,
                "wOBA": 0.0, "xwOBA": 0.0,
                "ERA": 0.0, "xERA": 0.0
            }
        
        
        