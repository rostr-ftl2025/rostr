from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas
import pybaseball

app = Flask(__name__)
CORS(app)  # enables CORS for all routes

@app.route("/")
def hello_world():
    return "Hello world"



@app.route("/api/search-player", methods=["GET"])
def search_player():
    first_name = request.args.get("first_name").lower()
    last_name = request.args.get("last_name").lower()

    found_players = pybaseball.playerid_lookup(last_name, first_name)

    # Capitalize name
    found_players["name_last"] = found_players["name_last"].map(str.title)
    found_players["name_first"] = found_players["name_first"].map(str.title)
    
    found_players_dict = found_players[["name_last", "name_first", "key_mlbam"]].to_dict(orient="records")
    print(found_players_dict)
    return jsonify(found_players_dict)

@app.route("/api/get-pitcher-war", methods=["GET"])
def get_pitching_stats():
    player_full_name = request.args.get("full_name")
    start_year = request.args.get("start_year")
    end_year = request.args.get("end_year")

    pitching_stats = pybaseball.pitching_stats(start_year, end_year)
    player_stats = pitching_stats[pitching_stats["Name"] == player_full_name]
    war = player_stats["WAR"].to_list()

    return war


app.run("0.0.0.0", port=6969, debug=True)