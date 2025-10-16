from flask import Blueprint, request, jsonify
from database import Team, Database


class TeamController:
    def __init__(self, db: Database):
        self.team_model = Team(db)
        self.bp = Blueprint("teams", __name__)

        self.bp.add_url_rule("/api/create-team", view_func=self.create_team, methods=["POST"])
        self.bp.add_url_rule("/api/delete-team/<int:team_id>", view_func=self.delete_team, methods=["DELETE"])
        self.bp.add_url_rule("/api/team-search/<int:user_id>", view_func=self.get_user_teams, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/players", view_func=self.get_team_players, methods=["GET"])

    def create_team(self):
        data = request.json
        user_id = data.get("user_id")
        team_name = data.get("team_name")

        if not user_id or not team_name:
            return jsonify({"error": "user_id and team_name are required"}), 400

        try:
            team = self.team_model.create(user_id, team_name)
            return jsonify(team), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def delete_team(self, team_id):
        query = "DELETE FROM teams WHERE id = %s RETURNING id;"
        result = self.team_model.db.execute(query, (team_id,), fetchone=True)

        if not result:
            return jsonify({"error": "Team not found"}), 404

        return jsonify({"message": f"Deleted team {team_id} and its players"}), 200

    def get_user_teams(self, user_id):
        try:
            results = self.team_model.get_by_user(user_id)
            # map database fields to frontend format
            teams = [{"team_id": r["id"], "team_name": r["team_name"]} for r in results]
            return jsonify(teams), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def get_team_players(self, team_id):
        try:
            players = self.team_model.get_all_players(team_id)
            # return only the fields frontend expects
            result = [
                {
                    "player_name": p["player_name"],
                    "mlbid": p.get("mlbid"),
                    "idfg": p["idfg"],
                    "position": p.get("position"),
                }
                for p in players
            ]
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            