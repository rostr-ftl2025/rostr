from flask import Blueprint, request, jsonify
from database import User, Database


class UserController:
    def __init__(self, db: Database):
        self.user_model = User(db)
        self.bp = Blueprint("users", __name__)

        self.bp.add_url_rule("/api/users", view_func=self.create_user, methods=["POST"])

    def create_user(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        print(f"Username: {username}")
        print(f"Password: {password}")

        if not username or not password:
            return jsonify({"error": "username and password are required"}), 400

        try:
            user = self.user_model.create(username, password)
            return jsonify(user), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
