import pytest
from unittest.mock import MagicMock, patch
from flask import Flask
from backend.interactors.recommend_lineup_interactor import RecommendLineupInteractor


@pytest.fixture
def app():
    """Creates a minimal Flask app for testing."""
    app = Flask(__name__)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def mock_team_data():
    """Mocked TeamDataAccessInterface."""
    return MagicMock()


@pytest.fixture
def interactor(mock_team_data):
    return RecommendLineupInteractor(team_data_access=mock_team_data)


# ------------------------------------------
# TEST 1 — No players found
# ------------------------------------------
def test_no_players_found(app, client, interactor, mock_team_data):
    mock_team_data.get_all_players.return_value = []

    with app.app_context():
        response, status = interactor.execute(1, "standard")

    assert status == 404
    assert response.json["error"] == "No players found for this team"


# ------------------------------------------
# TEST 2 — No MLB stat match for any player
# ------------------------------------------
@patch("backend.interactors.recommend_lineup_interactor.pitching_stats")
def test_no_mlb_stats_match(mock_pitching_stats, app, interactor, mock_team_data):
    # Team has players
    mock_team_data.get_all_players.return_value = [
        {"player_name": "John Smith"},
        {"player_name": "Random Guy"},
    ]

    # MLB stats returned but no name matches
    mock_pitching_stats.return_value = (
        __import__("pandas").DataFrame({"name": ["Different Pitcher"]})
    )

    with app.app_context():
        response, status = interactor.execute(1, "standard")

    assert status == 404
    assert response.json["error"] == "No matching MLB stats found for team players"


# ------------------------------------------
# TEST 3 — Successful recommendation
# ------------------------------------------
@patch("backend.interactors.recommend_lineup_interactor.pitching_stats")
@patch("backend.interactors.recommend_lineup_interactor.PitcherRecommenderService")
def test_success_recommendation(mock_recommender, mock_pitching_stats, app, interactor, mock_team_data):
    # Team players
    mock_team_data.get_all_players.return_value = [
        {"player_name": "Jacob deGrom"}
    ]

    # MLB stats with match
    mock_pitching_stats.return_value = __import__("pandas").DataFrame(
        {
            "name": ["Jacob deGrom"],
            "team": ["NYM"],
            "pitching+": [120],
            "stuff+": [130],
            "k-bb%": [0.25],
            "xfip-": [80],
            "barrel%": [5],
            "hardhit%": [28],
            "gb%": [45],
            "swstr%": [18],
            "wpa/li": [2.5],
        }
    )

    # Mock recommender output
    import pandas as pd
    result_df = pd.DataFrame([{"rank": 1, "name": "Jacob deGrom", "score": 1.88}])
    mock_recommender.recommend_starting_pitchers.return_value = (
        result_df,
        "standard strategy selected",
    )

    with app.app_context():
        response, status = interactor.execute(1, "standard")

    assert status == 200
    assert "lineup" in response.json
    assert response.json["lineup"][0]["name"] == "Jacob deGrom"
    assert response.json["lineup"][0]["rank"] == 1
    assert response.json["explanation"] == "standard strategy selected"


# ------------------------------------------
# TEST 4 — Some players match, some don't
# ------------------------------------------
@patch("backend.interactors.recommend_lineup_interactor.pitching_stats")
@patch("backend.interactors.recommend_lineup_interactor.PitcherRecommenderService")
def test_partial_player_match(mock_recommender, mock_pitching_stats, app, interactor, mock_team_data):
    mock_team_data.get_all_players.return_value = [
        {"player_name": "Jacob deGrom"},
        {"player_name": "Unknown Pitcher"},
    ]

    mock_pitching_stats.return_value = __import__("pandas").DataFrame(
        {"name": ["Jacob deGrom"], "pitching+": [120]}
    )

    import pandas as pd
    result_df = pd.DataFrame([{"rank": 1, "name": "Jacob deGrom", "score": 1.88}])
    mock_recommender.recommend_starting_pitchers.return_value = (result_df, "standard strategy selected")

    with app.app_context():
        response, status = interactor.execute(1, "standard")

    assert status == 200
    assert len(response.json["lineup"]) == 1


# ------------------------------------------
# TEST 5 — Service raises an exception → returns 500
# ------------------------------------------
@patch("backend.interactors.recommend_lineup_interactor.pitching_stats")
def test_exception_handling(mock_pitching_stats, app, interactor, mock_team_data):
    mock_team_data.get_all_players.return_value = [{"player_name": "Pitcher"}]

    # Raise error in pitching_stats
    mock_pitching_stats.side_effect = Exception("API error")

    with app.app_context():
        response, status = interactor.execute(1, "standard")

    assert status == 500
    assert "API error" in response.json["error"]
