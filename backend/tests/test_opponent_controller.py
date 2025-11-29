import json
import pandas as pd
from flask import url_for

def test_get_counter_lineup_success_default_strategy(app_with_opponent_blueprint):
    client = app_with_opponent_blueprint.test_client()
    # No profile provided -> strategy determined from opponent weaknesses
    resp = client.get("/api/opponent/1/counter-lineup/2")
    assert resp.status_code == 200
    data = resp.get_json()
    # Validate structure
    assert "lineup" in data and isinstance(data["lineup"], list)
    assert len(data["lineup"]) == 2
    assert data["lineup"][0]["rank"] == 1
    assert data["lineup"][0]["position"] == "SP"
    # Strategy auto-selected from opponent analysis (low K -> strikeout)
    assert data["strategy"] == "strikeout"
    assert "Counter-Strategy Analysis" in data["explanation"]
    assert "Opponent Weaknesses Identified" in data["explanation"]
    assert "opponent_weaknesses" in data
    assert "summary" in data["opponent_weaknesses"]

def test_get_counter_lineup_success_explicit_profile(app_with_opponent_blueprint):
    client = app_with_opponent_blueprint.test_client()
    # Provide explicit profile
    resp = client.get("/api/opponent/1/counter-lineup/2?profile=sabermetrics")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["strategy"] == "sabermetrics"
    # Explanation includes the provided profile
    assert "Profile sabermetrics" in data["explanation"]

def test_get_counter_lineup_error_no_opponent(app_with_opponent_blueprint):
    client = app_with_opponent_blueprint.test_client()
    # team_id 9999 mapped to no opponent players in fixture
    resp = client.get("/api/opponent/9999/counter-lineup/2")
    assert resp.status_code == 404
    data = resp.get_json()
    assert data["error"] == "No opponent players found"

def test_get_counter_lineup_error_no_user_players(app_with_opponent_blueprint):
    client = app_with_opponent_blueprint.test_client()
    # user team 8888 returns empty players
    resp = client.get("/api/opponent/1/counter-lineup/8888")
    assert resp.status_code == 404
    data = resp.get_json()
    assert data["error"] == "No players found for your team"

def test_get_counter_lineup_error_no_matching_stats(app_with_opponent_blueprint, monkeypatch):
    client = app_with_opponent_blueprint.test_client()

    # Override stats to include opponent but exclude user players so enrichment fails
    def stats_only_opponent(year):
        return pd.DataFrame([{
            "name": "Opp Starter One",
            "team": "OPP",
            "k%": 0.18,
            "ip": 120,
            "era": 4.40,
        }])
    monkeypatch.setattr("backend.controller.opponent_controller.pitching_stats", stats_only_opponent)

    resp = client.get("/api/opponent/1/counter-lineup/2")
    assert resp.status_code == 404
    data = resp.get_json()
    assert data["error"] == "No matching MLB stats found for your team"

def test_get_opponent_weaknesses_basic(app_with_opponent_blueprint):
    client = app_with_opponent_blueprint.test_client()
    resp = client.get("/api/opponent/1/weaknesses")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["opponent_team_id"] == 1
    assert isinstance(data["average_grade"], (int, float))
    assert isinstance(data["pitchers"], list)
    assert len(data["pitchers"]) >= 1
    p = data["pitchers"][0]
    assert "player_name" in p and "weaknesses" in p
    # Weaknesses text should include bullets from the extractor logic
    assert "•" in p["weaknesses"]