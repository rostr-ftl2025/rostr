from flask import Blueprint, request, jsonify
from database import User, Database
import bcrypt


class UserExistsException(Exception):
    pass


class UserController:
    def __init__(self, db: Database):
        self.user_model = User(db)
        self.bp = Blueprint("users", __name__)

        self.bp.add_url_rule("/api/users/signup", view_func=self.signup, methods=["POST"])
        self.bp.add_url_rule("/api/users/signin", view_func=self.signin, methods=["POST"])

    def signup(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        if not username or not password:
            return jsonify({"error": "username and password are required"}), 400

        try:

            # Check if user exists
            existing_user = self.user_model.get_by_username(username)
            if existing_user:
                raise UserExistsException("This username is already taken.")

            user = self.user_model.create(username, hashed_password)
            return jsonify(user), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def signin(self):
        return jsonify({"error": "Functionality not implemented yet"}), 400