from flask import request
from ..interactors import AddPlayerInteractor

class AddPlayerController:
    def __init__(self, add_player_interactor: AddPlayerInteractor):
        self.add_player_interactor = add_player_interactor
    
    def add_player(self, team_id):
        data = request.json or {}

        player_name = data.get("player_name")
        mlbid = data.get("mlbid")
        idfg = data.get("idfg")
        position = data.get("position")

        return self.add_player_interactor.execute(team_id, player_name, mlbid, idfg, position)

