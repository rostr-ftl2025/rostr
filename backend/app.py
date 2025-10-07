from flask import Flask
from flask_cors import CORS
from database import Database
from controllers import UserController, TeamController, PlayerController
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # enables CORS for all routes

# Get DSN from environment
DSN = os.getenv("DSN")
if not DSN:
    raise ValueError("No DSN found in .env file")

db = Database(DSN)

# Register controllers
user_controller = UserController(db)
team_controller = TeamController(db)
player_controller = PlayerController(db)

app.register_blueprint(user_controller.bp)
app.register_blueprint(team_controller.bp)
app.register_blueprint(player_controller.bp)


@app.route("/")
def hello_world():
    return "Hello, API is running!"

