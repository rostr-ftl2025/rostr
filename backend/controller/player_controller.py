from flask import Blueprint, request, jsonify
from database.data_access_interface import PlayerDataAccessInterface
from database.entities.player_entity import PlayerEntity
import pybaseball
from pybaseball import pitching_stats
import rapidfuzz
from controller.pitcher_grading_service import PitcherGradingService


class PlayerController:
    def __init__(self, player_data_access: PlayerDataAccessInterface):
        """
        player_data_access: an instance of a class that implements PlayerDataAccessInterface
        """
        self.player_data_access = player_data_access
        self.bp = Blueprint("players", __name__)

        # Register routes
        self.bp.add_url_rule("/api/search-pitcher", view_func=self.search_pitcher, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/add-player", view_func=self.add_player, methods=["POST"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/remove-player/<string:player_name>", view_func=self.remove_player, methods=["DELETE"])

        # Preload all pitcher data (same as before)
        self.all_pitcher_data = pybaseball.pitching_stats(2025)

    # ----------------------------------------------------
    # SEARCH PITCHER
    # ----------------------------------------------------
    def search_pitcher(self):
        searched_name = request.args.get("name")
        if not searched_name:
            return jsonify({"error": "Missing 'name' parameter"}), 400

        matches = rapidfuzz.process.extract(
            searched_name,
            self.all_pitcher_data["Name"],
            score_cutoff=0.7
        )

        matched_players_data = self.all_pitcher_data[
            self.all_pitcher_data["Name"].isin([data[0] for data in matches])
        ]

        data_as_array = matched_players_data[
            ["IDfg", "Name", "Team", "Age", "W", "L"]
        ].to_dict(orient="records")

        return jsonify(data_as_array)

    # ----------------------------------------------------
    # ADD PLAYER (CREATE)
    # ----------------------------------------------------
    def add_player(self, team_id):
        data = request.json or {}

        player_name = data.get("player_name")
        mlbid = data.get("mlbid")
        idfg = data.get("idfg")
        position = data.get("position")

        if not player_name or not team_id or not position or not mlbid or not idfg:
            return jsonify({"error": "All fields are required"}), 400
        
        # Check it here
        try:
            # Use the new method to fetch existing players on this team
            existing_players = self.player_data_access.list_by_team(team_id)

            # Consider a player duplicate if FanGraphs ID matches or names match case-insensitively
            name_lower = str(player_name).strip().lower()
            idfg_str = str(idfg).strip()

            already_on_team = any(
                (str(p.get("idfg")).strip() == idfg_str) or
                (str(p.get("player_name")).strip().lower() == name_lower)
                for p in existing_players
            )

            if already_on_team:
                return jsonify({"error": "Player already exists on this team"}), 409
            
            #Get the pitcher's stats
            data = pitching_stats(2025)
            player_data = data[data['Name'].str.lower() == player_name.lower()]

            if player_data.empty:
                return jsonify({"error": f"No stats found for {player_name}"}), 404
            
            strikeout_rate = float(player_data.iloc[0]['K%'])
            innings_pitched = float(player_data.iloc[0]['IP'])
            era = float(player_data.iloc[0]['ERA'])

            stats = {
                "K%": strikeout_rate,
                "IP": innings_pitched,
                "ERA": era
            }

            # Calculate grade
            grade = PitcherGradingService.calculate_pitcher_grade(stats)

            # Create entity
            player_entity = PlayerEntity(
                team_id=team_id,
                player_name=player_name,
                mlbid=mlbid,
                idfg=idfg,
                position=position,
                grade = grade
            )

            # Use interface (SQL or other)
            created_player = self.player_data_access.create(player_entity)
            return jsonify(created_player), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ----------------------------------------------------
    # REMOVE PLAYER (DELETE)
    # ----------------------------------------------------
    def remove_player(self, team_id, player_name):
        if not player_name:
            return jsonify({"error": "Player name required"}), 400

        try:
            result = self.player_data_access.delete(player_name, team_id)
            if not result:
                return jsonify({"error": "Player not found"}), 404
            return jsonify({"idfg": result["idfg"]}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400
