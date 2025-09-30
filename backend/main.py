from flask import Flask, jsonify, request
from flask_cors import CORS
import fuzzywuzzy.process
import pandas
import fuzzywuzzy
import pybaseball

app = Flask(__name__)
CORS(app)  # enables CORS for all routes

@app.route("/")
def hello_world():
    return "Hello world"



@app.route("/api/search-pitcher", methods=["GET"])
def search_pitcher():

    season = request.args.get("season")
    player_search_name = request.args.get("name")
    
    all_data = pybaseball.pitching_stats(season)

    if player_search_name:

        all_names = all_data["Name"]
        matches = fuzzywuzzy.process.extract(player_search_name, all_names, limit=10)
        matches = filter(lambda x: x[1] > 70, matches)
        matches_names = map(lambda x: x[0], matches)

        player_data = all_data[all_data["Name"].isin(matches_names)]
        if len(player_data) > 0:
            return jsonify(player_data[["Name", "Team", "Age", "W", "L", "IDfg"]].to_dict(orient="records"))
        else:
            return []
    else:
        return jsonify(all_data[["Name", "Team", "Age", "W", "L", "IDfg"]].to_dict(orient="records"))
    

@app.route("/api/get-player-years", methods=["GET"])
def get_player_years():
    fangraph_id = request.args.get("fangraph_id")
    print(fangraph_id)
    players = pybaseball.playerid_reverse_lookup([int(fangraph_id)], key_type="fangraphs")
    print(players)
    if len(players) > 0:
        return jsonify({"start": int(players.iloc[0]["mlb_played_first"]), "end": int(players.iloc[0]["mlb_played_last"])})
    else:
        return jsonify({})


app.run("0.0.0.0", port=6969, debug=True)