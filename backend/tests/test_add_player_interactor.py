import pytest
from unittest.mock import MagicMock, patch
from flask import Flask
from backend.interactors.add_player_interactor import AddPlayerInteractor
from backend.database.entities.player_entity import PlayerEntity


@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def mock_player_data():
    return MagicMock()


@pytest.fixture
def interactor(mock_player_data):
    return AddPlayerInteractor(player_data_access=mock_player_data)


# ---------------------------------------------------------
# TEST 1 — Missing required fields
# ---------------------------------------------------------
def test_missing_required_fields(app, interactor):
    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="",
            mlbid=123,
            idfg=456,
            position="P"
        )

    assert status == 400
    assert "error" in response.json


# ---------------------------------------------------------
# TEST 2 — Duplicate player by name or idfg
# ---------------------------------------------------------
def test_duplicate_player(app, interactor, mock_player_data):
    mock_player_data.list_by_team.return_value = [
        {"player_name": "Shohei Ohtani", "idfg": "999"}
    ]

    # Case: same name
    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="Shohei Ohtani",
            mlbid=123,
            idfg=888,
            position="P"
        )
    assert status == 409

    # Case: same idfg
    mock_player_data.list_by_team.return_value = [
        {"player_name": "Random", "idfg": "456"}
    ]

    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="Different Name",
            mlbid=999,
            idfg=456,
            position="P"
        )
    assert status == 409


# ---------------------------------------------------------
# TEST 3 — No MLB stat match
# ---------------------------------------------------------
@patch("backend.interactors.add_player_interactor.pitching_stats")
def test_no_mlb_stats(mock_pitching_stats, app, interactor, mock_player_data):
    mock_player_data.list_by_team.return_value = []

    import pandas as pd
    # Must include valid values for columns referenced in code to avoid pandas exceptions
    mock_pitching_stats.return_value = pd.DataFrame({
        "Name": ["Different Pitcher"],
        "K%": [20.0],
        "IP": [120.0],
        "ERA": [3.50],
    })

    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="Unknown Player",
            mlbid=111,
            idfg=222,
            position="P"
        )

    assert status == 404
    assert "No stats found" in response.json["error"]


# ---------------------------------------------------------
# TEST 4 — Successful add
# ---------------------------------------------------------
@patch("backend.interactors.add_player_interactor.pitching_stats")
@patch("backend.interactors.add_player_interactor.PitcherGradingService")
def test_successful_add(mock_grading, mock_pitching_stats, app, interactor, mock_player_data):
    mock_player_data.list_by_team.return_value = []

    # MLB stats mock
    import pandas as pd
    mock_pitching_stats.return_value = pd.DataFrame(
        {
            "Name": ["Gerrit Cole"],
            "K%": [32.1],
            "IP": [180.2],
            "ERA": [2.63],
        }
    )

    # Grade service mock
    mock_grading.calculate_pitcher_grade.return_value = 92.5
    mock_grading.analyze_pitcher.return_value = "Elite strikeout ability."

    # Mock DB create → should return dict
    mock_player_data.create.return_value = {
        "team_id": 1,
        "player_name": "Gerrit Cole",
        "mlbid": 123,
        "idfg": 999,
        "position": "P",
        "grade": 92.5,
        "analysis": "Elite strikeout ability.",
    }

    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="Gerrit Cole",
            mlbid=123,
            idfg=999,
            position="P",
        )

    assert status == 201
    assert response.json["player_name"] == "Gerrit Cole"
    assert response.json["grade"] == 92.5


# ---------------------------------------------------------
# TEST 5 — Exception inside execution → returns 400
# ---------------------------------------------------------
@patch("backend.interactors.add_player_interactor.pitching_stats")
def test_exception_handling(mock_pitching_stats, app, interactor, mock_player_data):
    mock_player_data.list_by_team.return_value = []

    # Force exception
    mock_pitching_stats.side_effect = Exception("Test exception")

    with app.app_context():
        response, status = interactor.execute(
            team_id=1,
            player_name="Any Player",
            mlbid=123,
            idfg=456,
            position="P",
        )

    assert status == 400
    assert "Test exception" in response.json["error"]
