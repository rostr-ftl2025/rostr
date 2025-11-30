from dotenv import load_dotenv
import os

from flask import Flask
from flask_cors import CORS

from .database import Database

from .interactors import (
    SignupInteractor,
    SigninInteractor,
    AddPlayerInteractor,
    RecommendLineupInteractor
)

from .controller import (
    SignupController,
    SigninController,
    TeamController,
    PlayerController,
    TradeController,
    OpponentController,
    AddPlayerController,
    RecommendLineupController
)

from .database.data_access_postgresql import (
    UserDataAccess,
    TeamDataAccess,
    PlayerDataAccess
)

from .blueprint import (
    UserBlueprint,
    PlayerBlueprint,
    TeamBlueprint
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
signup_interactor = SignupInteractor(user_data_access, team_data_access)
signin_interactor = SigninInteractor(user_data_access, team_data_access)
add_player_interactor = AddPlayerInteractor(player_data_access)
recommend_lineup_interactor = RecommendLineupInteractor(team_data_access)


# Register controllers
signup_controller = SignupController(signup_interactor)
signin_controller = SigninController(signin_interactor, app)
player_controller = PlayerController(player_data_access)
add_player_controller = AddPlayerController(add_player_interactor)
team_controller = TeamController(team_data_access)
recommend_lineup_controller = RecommendLineupController(recommend_lineup_interactor)


# Register blueprints
user_blueprint = UserBlueprint(signup_controller, signin_controller)
player_blueprint = PlayerBlueprint(player_controller, add_player_controller)
team_blueprint = TeamBlueprint(team_controller, recommend_lineup_controller)
trade_controller = TradeController(player_data_access)
opponent_controller = OpponentController(team_data_access)


# Register Flask blueprints
app.register_blueprint(user_blueprint.bp)
app.register_blueprint(player_blueprint.bp)
app.register_blueprint(team_blueprint.bp)
app.register_blueprint(trade_controller.bp)
app.register_blueprint(opponent_controller.bp)


@app.route("/")
def hello_world():
    return "Hello, API is running!"

