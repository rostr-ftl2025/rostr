from flask import request
from ..interactors import RecommendLineupInteractor


class RecommendLineupController:
    def __init__(self, recommend_lineup_interactor: RecommendLineupInteractor):
        self.recommend_lineup_interactor = recommend_lineup_interactor

    def recommend_lineup(self, team_id):
        profile = request.args.get("profile", "standard")

        # Forward the request to interactor
        return self.recommend_lineup_interactor.execute(team_id, profile)
