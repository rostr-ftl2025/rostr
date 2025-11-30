from flask import Blueprint
from ..controller import PlayerController, AddPlayerController

class PlayerBlueprint:
    def __init__(self, player_controller: PlayerController, add_player_controller: AddPlayerController):
        self.bp = Blueprint("players", __name__)

        # Register routes
        self.bp.add_url_rule("/api/search-pitcher", view_func=player_controller.search_pitcher, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/add-player", view_func=add_player_controller.add_player, methods=["POST"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/remove-player/<string:player_name>", view_func=player_controller.remove_player, methods=["DELETE"])
