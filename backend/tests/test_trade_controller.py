import pytest
import pandas as pd
from unittest.mock import MagicMock, patch
from flask import Flask

from backend.controller.trade_controller import TradeController


# -------------------------------------------------------------------------
# FIXTURES
# -------------------------------------------------------------------------

@pytest.fixture
def mock_df():
    """Fake 2025 pitching stats so we never hit pybaseball."""
    data = {
        "Name": ["Gerrit Cole", "Zac Gallen", "Scrub Pitcher"],
        "K%":  [0.30, 0.25, 0.10],
        "IP":  [200.0, 180.0, 50.0],
        "ERA": [2.50, 3.50, 5.00],
    }
    return pd.DataFrame(data)


@pytest.fixture
def mock_player_dao():
    """Mock database access layer (unused but required for controller init)."""
    return MagicMock()


@pytest.fixture
def app(mock_player_dao, mock_df):
    """
    Creates a Flask app and registers the TradeController.
    We patch pitching_stats so controller loads our fake DataFrame.
    """
    app = Flask(__name__)

    with patch("backend.controller.trade_controller.pitching_stats") as mock_stats:
        mock_stats.return_value = mock_df
        controller = TradeController(player_data_access=mock_player_dao)
        app.register_blueprint(controller.bp)

    return app


@pytest.fixture
def client(app):
    """Provides a test client for HTTP requests."""
    return app.test_client()


# -------------------------------------------------------------------------
# TESTS — INITIALIZATION
# -------------------------------------------------------------------------

def test_trade_controller_initializes_with_mocked_stats(mock_player_dao, mock_df):
    """Controller should successfully load the fake stats DataFrame."""
    with patch("backend.controller.trade_controller.pitching_stats") as mock_stats:
        mock_stats.return_value = mock_df

        controller = TradeController(mock_player_dao)

        assert controller.season_df is not None
        assert len(controller.season_df) == 3
        assert "Gerrit Cole" in list(controller.season_df["Name"])


# -------------------------------------------------------------------------
# TESTS — EVALUATE TRADE
# -------------------------------------------------------------------------

def test_evaluate_trade_side_a_wins(client):
    """
    Scenario: Side A sends a stronger pitcher.
    Expected winner: "Other Team"
    """

    # Mock grading so we get deterministic output
    with patch("backend.services.pitcher_grading_service.PitcherGradingService.calculate_pitcher_grade") as mock_grade, \
         patch("backend.services.pitcher_grading_service.PitcherGradingService.analyze_pitcher") as mock_analyze:

        def grade_effect(stats):
            if stats["K%"] == 0.30: return 20.0   # Cole
            if stats["K%"] == 0.10: return 5.0    # Scrub
            return 0.0

        mock_grade.side_effect = grade_effect
        mock_analyze.return_value = "Great pitcher"

        payload = {
            "sideA": ["Gerrit Cole"],
            "sideB": ["Scrub Pitcher"],
            "profile": "standard"
        }

        resp = client.post("/api/trade/evaluate", json=payload)
        data = resp.get_json()

        assert resp.status_code == 200
        assert data["sideA"]["total_grade"] == 20.0
        assert data["sideB"]["total_grade"] == 5.0
        assert data["diff"] == 15.0
        assert data["winner"] == "Other Team"   # A > B means Side A is overpaying


def test_evaluate_trade_even(client):
    """Both sides return the same grade → should be perfectly fair."""

    with patch("backend.services.pitcher_grading_service.PitcherGradingService.calculate_pitcher_grade") as mock_grade:
        mock_grade.return_value = 10.0

        payload = {"sideA": ["Gerrit Cole"], "sideB": ["Gerrit Cole"]}

        resp = client.post("/api/trade/evaluate", json=payload)
        data = resp.get_json()

        assert resp.status_code == 200
        assert data["diff"] == 0.0
        assert data["winner"] == "Even"
        assert data["fairness_pct"] == 100.0


def test_evaluate_trade_player_not_found(client):
    """
    If a player doesn't exist in the stats dataframe,
    they should receive a grade of 0.0 with a clear analysis message.
    """

    payload = {
        "sideA": ["Ghost Player"],
        "sideB": ["Zac Gallen"],
    }

    resp = client.post("/api/trade/evaluate", json=payload)
    data = resp.get_json()

    ghost = data["sideA"]["players"][0]

    assert resp.status_code == 200
    assert ghost["player_name"] == "Ghost Player"
    assert ghost["grade"] == 0.0
    assert "No 2025 stats" in ghost["analysis"]


def test_invalid_input_rejected(client):
    """sideA must be a list — sending a string should return 400."""
    payload = {
        "sideA": "Gerrit Cole",   # INVALID
        "sideB": ["Zac Gallen"]
    }

    resp = client.post("/api/trade/evaluate", json=payload)
    assert resp.status_code == 400
    assert "error" in resp.get_json()


def test_profile_explanation_changes(client):
    """Selecting a profile should affect output explanation."""

    payload = {
        "sideA": ["Gerrit Cole"],
        "sideB": ["Zac Gallen"],
        "profile": "strikeout",
    }

    resp = client.post("/api/trade/evaluate", json=payload)
    data = resp.get_json()

    assert resp.status_code == 200
    assert data["profile"] == "strikeout"
    assert len(data["profile_explanation"]) > 0


# -------------------------------------------------------------------------
# EXTRA: Full round-trip integration test 
# -------------------------------------------------------------------------

def test_full_integration_real_grading(client):
    """
    Optional: Uses the REAL grading service without mocks.
    Ensures your grading math and interactor all work together.
    """

    payload = {
        "sideA": ["Gerrit Cole"],
        "sideB": ["Zac Gallen"],
        "profile": "standard",
    }

    resp = client.post("/api/trade/evaluate", json=payload)
    data = resp.get_json()

    assert resp.status_code == 200
    assert "sideA" in data
    assert "sideB" in data
    assert "winner" in data
    assert "fairness_pct" in data
