from flask import Blueprint
from database.entities.user_entity import UserEntity
from controller import SignupController, SigninController


class UserBlueprint:
    def __init__(self, signup_controller: SignupController, signin_controller: SigninController):
        self.bp = Blueprint("users", __name__)
        self.bp.add_url_rule("/api/users/signup", view_func=signup_controller.signup, methods=["POST"])
        self.bp.add_url_rule("/api/users/signin", view_func=signin_controller.signin, methods=["POST"])
