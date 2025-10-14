from flask import Flask, Blueprint, request, jsonify
from database import User, Database
import bcrypt
import jwt
import datetime

class UserExistsException(Exception):
    pass


class UserController:
    def __init__(self, db: Database, app: Flask):
        self.user_model = User(db)
        self.bp = Blueprint("users", __name__)

        self.bp.add_url_rule("/api/users/signup", view_func=self.signup, methods=["POST"])
        self.bp.add_url_rule("/api/users/signin", view_func=self.signin, methods=["POST"])

        self.app = app

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
        data = request.get_json()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        # 1. Check if user exists
        user = self.user_model.get_by_username(username)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # 2. Verify password using bcrypt
        if not bcrypt.checkpw(password.encode(), user["password"]):
            return jsonify({"error": "Invalid password"}), 401
        print(user)

        # 3. Create JWT token
        token = jwt.encode(
            {
                "username": user["username"],
                "userID": user["id"],
                "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
            },
            self.app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        # 4. Return success
        return jsonify({
            "message": "Signed in successfully!",
            "token": token
        }), 200
