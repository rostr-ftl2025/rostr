import datetime
from flask import Blueprint, request, jsonify
from database import Database, models
import pybaseball
from pybaseball import pitching_stats
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
            player_stats = self.get_pitcher_stats(player_name, 2025)
            player_grade = self.player_model.calculate_pitcher_grade(player_stats)
            
            player = self.player_model.create(
            team_id=team_id,
            player_name=player_name,
            mlbid=mlbid,
            idfg=idfg,
            position=position,
            grade=player_grade)

            print(f"✅ Added {player_name} with grade {player_grade}")
            return jsonify(player), 201

        except Exception as e:
            print(f"❌ Error adding player: {e}")
            return jsonify({"error": str(e)}), 400


    def remove_player(self, team_id, player_name):
        result = self.player_model.remove(team_id, player_name)
        if not result:
            return jsonify({"error": "Player not found"}), 404
        return jsonify({"message": f"Removed player {player_name}"}), 200


    def get_pitcher_stats(self, name: str, season: int) -> dict[str, float]:
        """
        Fetch basic pitching stats for a given player and season.
        Returns a dictionary with K%, IP, and ERA.
        """
        try:
            # Get all pitchers' stats for that season
            data = pitching_stats(season)

            # Match by name (case-insensitive)
            player_data = data[data['Name'].str.lower() == name.lower()]

            if player_data.empty:
                print(f"No data found for {name} in {season}.")
                return {}

            # Extract only relevant fields
            strikeout_rate = float(player_data.iloc[0]['K%'])
            innings_pitched = float(player_data.iloc[0]['IP'])
            era = float(player_data.iloc[0]['ERA'])

            return {
                "K%": strikeout_rate,
                "IP": innings_pitched,
                "ERA": era
            }

        except Exception as e:
            print(f"Error fetching stats for {name}: {e}")
            return {}