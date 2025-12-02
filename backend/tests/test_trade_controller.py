import pytest
import pandas as pd
import json
from unittest.mock import MagicMock, patch
from flask import Flask

from backend.controller.trade_controller import TradeController 

# -------------------------------------------------------------------------
# FIXTURES (Setup)
# -------------------------------------------------------------------------

@pytest.fixture
def mock_df():
    """Creates a fake dataframe so we don't hit the MLB API."""
    data = {
        "Name": ["Gerrit Cole", "Zac Gallen", "Scrub Pitcher"],
        "K%": [0.30, 0.25, 0.10],
        "IP": [200.0, 180.0, 50.0],
        "ERA": [2.50, 3.50, 5.00]
    }
    return pd.DataFrame(data)

@pytest.fixture
def mock_player_dao():
    """Mocks the database interface."""
    return MagicMock()

@pytest.fixture
def app(mock_player_dao, mock_df):
    """
    Creates a Flask app with the TradeController registered.
    We patch 'pitching_stats' here so it applies during controller init.
    """
    app = Flask(__name__)
    
    # We patch the import inside the controller file
    with patch("backend.controller.trade_controller.pitching_stats") as mock_stats:
        mock_stats.return_value = mock_df
        
        # Initialize controller
        controller = TradeController(player_data_access=mock_player_dao)
        
        # Register the blueprint
        app.register_blueprint(controller.bp)
    
    return app

@pytest.fixture
def client(app):
    """Test client to make HTTP requests."""
    return app.test_client()

# -------------------------------------------------------------------------
# TESTS
# -------------------------------------------------------------------------

def test_trade_controller_init_success(mock_player_dao, mock_df):
    """Test that controller loads stats DF correctly on startup."""
    with patch("backend.controller.trade_controller.pitching_stats") as mock_stats:
        mock_stats.return_value = mock_df
        controller = TradeController(mock_player_dao)
        assert controller.season_df is not None
        assert len(controller.season_df) == 3

def test_evaluate_trade_success_side_a_wins(client):
    """
    Scenario: Side A (Gerrit Cole) is better than Side B (Scrub Pitcher).
    """
    # We mock the grading service to return predictable math
    # PitcherGradingService.calculate_pitcher_grade logic is complex, 
    # so we can either mock it or rely on the real one if it's pure math.
    # Here we let it run (integration test) or we could mock it.
    # Let's mock it for precise assertions.
    
    with patch("backend.services.pitcher_grading_service.PitcherGradingService.calculate_pitcher_grade") as mock_grade, \
         patch("backend.services.pitcher_grading_service.PitcherGradingService.analyze_pitcher") as mock_analyze:
        
        # Setup specific grades
        def grade_side_effect(stats):
            if stats['K%'] == 0.30: return 20.0 # Cole
            if stats['K%'] == 0.10: return 5.0  # Scrub
            return 0.0
        
        mock_grade.side_effect = grade_side_effect
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
        
        # Since A > B, the winner is the "Other Team" (Side B is usually the "Other Team" in your UI, 
        # but check your controller logic: 
        # if A_total > B_total: winner = "Other Team" (Assuming Side A is the one being TRADED AWAY)
        assert data["winner"] == "Other Team"

def test_evaluate_trade_success_even(client):
    """Scenario: Exact same stats on both sides."""
    
    with patch("backend.services.pitcher_grading_service.PitcherGradingService.calculate_pitcher_grade") as mock_grade:
        mock_grade.return_value = 10.0

        payload = {
            "sideA": ["Gerrit Cole"],
            "sideB": ["Gerrit Cole"], # Same player, logic shouldn't care
        }

        resp = client.post("/api/trade/evaluate", json=payload)
        data = resp.get_json()

        assert resp.status_code == 200
        assert data["diff"] == 0.0
        assert data["winner"] == "Even"
        assert data["fairness_pct"] == 100.0

def test_evaluate_trade_player_not_found(client):
    """Scenario: User inputs a player that isn't in the 2025 stats."""
    
    payload = {
        "sideA": ["Ghost Player"],
        "sideB": ["Zac Gallen"]
    }
    
    # We don't need to patch grade here because _grade_player returns early if stats are None
    resp = client.post("/api/trade/evaluate", json=payload)
    data = resp.get_json()

    assert resp.status_code == 200
    
    # Ghost player should have grade 0
    player_a_result = data["sideA"]["players"][0]
    assert player_a_result["player_name"] == "Ghost Player"
    assert player_a_result["grade"] == 0.0
    assert "No 2025 stats found" in player_a_result["analysis"]

def test_evaluate_trade_invalid_input(client):
    """Scenario: Sending strings instead of lists."""
    payload = {
        "sideA": "Gerrit Cole", # Should be ["Gerrit Cole"]
        "sideB": ["Zac Gallen"]
    }

    resp = client.post("/api/trade/evaluate", json=payload)
    
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_profile_explanation_selection(client):
    """Test that selecting 'strikeout' profile changes the explanation text."""
    payload = {
        "sideA": ["Gerrit Cole"],
        "sideB": ["Zac Gallen"],
        "profile": "strikeout"
    }
    
    resp = client.post("/api/trade/evaluate", json=payload)
    data = resp.get_json()
    
    # We can't assert the exact text unless we import the service, 
    # but we can ensure it's not empty
    assert resp.status_code == 200
    assert data["profile"] == "strikeout"
    assert len(data["profile_explanation"]) > 0