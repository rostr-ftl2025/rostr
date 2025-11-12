from dotenv import load_dotenv
import os

from flask import Flask
from flask_cors import CORS

from database import Database

from interactors import (
    SignupInteractor,
    SigninInteractor
)

from controller import (
    SignupController,
    SigninController,
    TeamController,
    PlayerController
)

from database.data_access_postgresql import (
    UserDataAccess,
    TeamDataAccess,
    PlayerDataAccess
)

from blueprint import (
    UserBlueprint
)



# Load environment variables from .env
load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


# Initialize database
DSN = os.getenv("DSN")
db = Database(DSN)


# Initialize data access
user_data_access = UserDataAccess(db)
team_data_access = TeamDataAccess(db)
player_data_access = PlayerDataAccess(db)


# Register interactors
signup_interactor = SignupInteractor(user_data_access)
signin_interactor = SigninInteractor(user_data_access,)


# Register controllers
signup_controller = SignupController(signup_interactor)
signin_controller = SigninController(signin_interactor, app)


# Register blueprints
user_blueprint = UserBlueprint(signup_controller, signin_controller)
team_controller = TeamController(team_data_access)
player_controller = PlayerController(player_data_access)


# Register Flask blueprints
app.register_blueprint(user_blueprint.bp)
app.register_blueprint(team_controller.bp)
app.register_blueprint(player_controller.bp)


@app.route("/")
def hello_world():
    return "Hello, API is running!"

