from flask import Blueprint
from ..controller import TeamController, RecommendLineupController

class TeamBlueprint:
    def __init__(self, team_controller: TeamController, recommend_lineup_controller: RecommendLineupController):
        self.bp = Blueprint("teams", __name__)

        # Register routes
        self.bp.add_url_rule("/api/create-team", view_func=team_controller.create_team, methods=["POST"])
        self.bp.add_url_rule("/api/delete-team/<int:team_id>", view_func=team_controller.delete_team, methods=["DELETE"])
        self.bp.add_url_rule("/api/team-search/<int:user_id>", view_func=team_controller.get_user_teams, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/players", view_func=team_controller.get_team_players, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/recommend-lineup", view_func=recommend_lineup_controller.recommend_lineup, methods=["GET"])