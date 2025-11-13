from flask import Blueprint, request, jsonify
from database.data_access_interface import TeamDataAccessInterface
from database.entities.team_entity import TeamEntity


class TeamController:
    def __init__(self, team_data_access: TeamDataAccessInterface):
        """
        team_data_access: An implementation of TeamDataAccessInterface (e.g., TeamDataAccess)
        """
        self.team_data_access = team_data_access
        self.bp = Blueprint("teams", __name__)

        # Register routes
        self.bp.add_url_rule("/api/create-team", view_func=self.create_team, methods=["POST"])
        self.bp.add_url_rule("/api/delete-team/<int:team_id>", view_func=self.delete_team, methods=["DELETE"])
        self.bp.add_url_rule("/api/team-search/<int:user_id>", view_func=self.get_user_teams, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/players", view_func=self.get_team_players, methods=["GET"])

    # ----------------------------------------------------
    # CREATE TEAM
    # ----------------------------------------------------
    def create_team(self):
        data = request.json or {}
        user_id = data.get("user_id")
        team_name = data.get("team_name")

        if not user_id or not team_name:
            return jsonify({"error": "user_id and team_name are required"}), 400

        try:
            # Create TeamEntity
            team_entity = TeamEntity(user_id=user_id, team_name=team_name)

            # Persist using data access interface
            created_team = self.team_data_access.create(team_entity)
            return jsonify(created_team), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ----------------------------------------------------
    # DELETE TEAM
    # ----------------------------------------------------
    def delete_team(self, team_id):
        if not team_id:
            return jsonify({"error": "Team ID required"}), 400

        try:
            deleted = self.team_data_access.delete(team_id)
            if not deleted:
                return jsonify({"error": "Team not found"}), 404
            return jsonify({"message": f"Deleted team '{team_id}'"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ----------------------------------------------------
    # GET ALL TEAMS FOR USER
    # ----------------------------------------------------
    def get_user_teams(self, user_id):
        try:
            # In SQL data access, you can have a get_by_user() that filters by user_id
            results = self.team_data_access.read(user_id)

            # Map to frontend format
            teams = [
                {"team_id": r["id"], "team_name": r["team_name"]}
                for r in results
            ]
            return jsonify(teams), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ----------------------------------------------------
    # GET PLAYERS IN TEAM
    # ----------------------------------------------------
    def get_team_players(self, team_id):
        try:
            players = self.team_data_access.get_all_players(team_id)

            result = [
                {
                    "player_name": p["player_name"],
                    "mlbid": p.get("mlbid"),
                    "idfg": p.get("idfg"),
                    "position": p.get("position"),
                    "grade": p.get("grade"),
                    "analysis": p.get("analysis")
                }
                for p in players
            ]
            return jsonify(result), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
