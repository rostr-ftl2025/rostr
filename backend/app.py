from dotenv import load_dotenv
import os

from flask import Flask
from flask_cors import CORS

from database import Database

from interactors import UserInteractor, TeamInteractor, PlayerInteractor
from database.data_access_postgresql import (
    UserDataAccess,
    TeamDataAccess,
    PlayerDataAccess
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
user_interactor = UserInteractor(user_data_access, app)
team_interactor = TeamInteractor(team_data_access)
player_interactor = PlayerInteractor(player_data_access)


# Register Flask blueprints
app.register_blueprint(user_interactor.bp)
app.register_blueprint(team_interactor.bp)
app.register_blueprint(player_interactor.bp)


@app.route("/")
def hello_world():
    return "Hello, API is running!"

