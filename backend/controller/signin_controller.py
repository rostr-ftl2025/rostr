from flask import Flask, request, jsonify
from interactors import SigninInteractor
import bcrypt, jwt, datetime


class SigninController:
    def __init__(self, signin_interactor: SigninInteractor, app: Flask):
        self.signin_interactor = signin_interactor
        self.app = app

    def signin(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        try:

            user = self.signin_interactor.signin(username, password)

            token = jwt.encode(
                {
                    "username": user["username"],
                    "userID": user["id"],
                    "opponentTeamID": user.get("opponent_team_id"),
                    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
                },
                self.app.config["SECRET_KEY"],
                algorithm="HS256"
            )

            return jsonify({"token": token}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 401