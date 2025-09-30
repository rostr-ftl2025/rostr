from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas
from pybaseball import playerid_lookup, pitching_stats

app = Flask(__name__)
CORS(app)  # enables CORS for all routes

@app.route("/")
def hello_world():
    return "Hello world"



@app.route("/api/search-pitcher", methods=["GET"])
def search_pitcher():

    player_full_name = request.args.get("name")
    season = request.args.get("season")
    
    all_data = pitching_stats(season)

    if player_full_name:
        player_data = all_data[all_data["Name"] == player_full_name]
        if len(player_data) > 0:
            return jsonify(player_data[["Name", "Team", "Age", "W", "L"]].to_dict(orient="records"))
        else:
            return []
    else:
        return jsonify(all_data[["Name", "Team", "Age", "W", "L"]].to_dict(orient="records"))


app.run("0.0.0.0", port=6969, debug=True)