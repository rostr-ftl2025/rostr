from flask import Flask, Blueprint, request, jsonify
from database.entities.user_entity import UserEntity
from database.data_access_interface import UserDataAccessInterface
import bcrypt, jwt, datetime


class UserInteractor:
    def __init__(self, user_data_access: UserDataAccessInterface, app: Flask):
        self.user_data_access = user_data_access
        self.app = app
        self.bp = Blueprint("users", __name__)
        self.bp.add_url_rule("/api/users/signup", view_func=self.signup, methods=["POST"])
        self.bp.add_url_rule("/api/users/signin", view_func=self.signin, methods=["POST"])

    def signup(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "username and password are required"}), 400

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf-8")

        existing = self.user_data_access.read(username)
        if existing:
            return jsonify({"error": "Username already exists"}), 409

        user_entity = UserEntity(username, hashed_password)
        new_user = self.user_data_access.create(user_entity)

        return jsonify(new_user), 201

    def signin(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = self.user_data_access.read(username)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.checkpw(password.encode(), user["password"].encode()):
            return jsonify({"error": "Invalid password"}), 401

        token = jwt.encode(
            {
                "username": user["username"],
                "userID": user["id"],
                "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
            },
            self.app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({"token": token}), 200
