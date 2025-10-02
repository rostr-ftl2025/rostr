from flask import Blueprint, request, jsonify
from database import Team, Database


class TeamController:
    def __init__(self, db: Database):
        self.team_model = Team(db)
        self.bp = Blueprint("teams", __name__)

        self.bp.add_url_rule("/api/teams", view_func=self.create_team, methods=["POST"])
        self.bp.add_url_rule("/api/teams/<int:team_id>", view_func=self.delete_team, methods=["DELETE"])

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
