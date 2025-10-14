from flask import Blueprint, request, jsonify
from database import Player, Database
import pybaseball
import rapidfuzz


class PlayerController:
    def __init__(self, db: Database):
        self.player_model = Player(db)
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
            return jsonify(player), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def remove_player(self, team_id, player_name):
        result = self.player_model.remove(team_id, player_name)
        if not result:
            return jsonify({"error": "Player not found"}), 404
        return jsonify({"message": f"Removed player {player_name}"}), 200
