from flask import Blueprint, request, jsonify
from database import Player, Database


class PlayerController:
    def __init__(self, db: Database):
        self.player_model = Player(db)
        self.bp = Blueprint("players", __name__)

        self.bp.add_url_rule("/api/teams/<int:team_id>/players", view_func=self.add_player, methods=["POST"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/players/<string:player_name>", view_func=self.remove_player, methods=["DELETE"])

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
        query = """
        DELETE FROM players 
        WHERE team_id = %s AND player_name = %s
        RETURNING id, player_name;
        """
        result = self.player_model.db.execute(query, (team_id, player_name), fetchone=True)

        if not result:
            return jsonify({"error": "Player not found"}), 404

        return jsonify({"message": f"Removed player {player_name}"}), 200
