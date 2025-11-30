from flask import Blueprint, request, jsonify
from ..database.data_access_interface import PlayerDataAccessInterface
from ..database.entities.player_entity import PlayerEntity
import pybaseball
from pybaseball import pitching_stats
import rapidfuzz
from ..services.pitcher_grading_service import PitcherGradingService


class PlayerController:
    def __init__(self, player_data_access: PlayerDataAccessInterface):
        """
        player_data_access: an instance of a class that implements PlayerDataAccessInterface
        """
        self.player_data_access = player_data_access
        
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
            score_cutoff=0.7,
            limit=1000
        )

        # Preserve the match order returned by rapidfuzz
        matched_names = [m[0] for m in matches]

        # Filter and then sort according to matched_names order
        matched_players_data = self.all_pitcher_data[self.all_pitcher_data["Name"].isin(matched_names)].copy()
        order_map = {name: idx for idx, name in enumerate(matched_names)}
        matched_players_data["__match_order"] = matched_players_data["Name"].map(order_map)
        matched_players_data = matched_players_data.sort_values("__match_order").drop(columns="__match_order")

        data_as_array = matched_players_data[
            ["IDfg", "Name", "Team", "Age", "W", "L"]
        ].to_dict(orient="records")

        return jsonify(data_as_array)
    
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
