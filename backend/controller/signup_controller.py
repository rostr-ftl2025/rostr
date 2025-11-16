from flask import request, jsonify
from interactors import SignupInteractor
import bcrypt


class SignupController:
    def __init__(self, signup_interactor: SignupInteractor):
        self.signup_interactor = signup_interactor

    def signup(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        try:
            user_data = self.signup_interactor.signup(username, hashed_password)
            return jsonify(user_data), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

