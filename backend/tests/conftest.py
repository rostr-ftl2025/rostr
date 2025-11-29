import types
import pandas as pd
import pytest
from flask import Flask

@pytest.fixture
def mock_stats_df():
    # Minimal columns used by controller for matching & enrichment
    return pd.DataFrame([
        {
            "name": "Opp Starter One",
            "team": "OPP",
            "k%": 0.18,
            "ip": 120,
            "era": 4.40,
            "pitching+": 95,
            "stuff+": 92,
            "k-bb%": 10.5,
            "xfip-": 105,
            "barrel%": 8.0,
            "hardhit%": 38.0,
            "gb%": 42.0,
            "swstr%": 9.5,
            "wpa/li": 0.2,
        },
        {
            "name": "User Starter A",
            "team": "USR",
            "k%": 0.27,
            "ip": 160,
            "era": 3.50,
            "pitching+": 110,
            "stuff+": 108,
            "k-bb%": 18.2,
            "xfip-": 92,
            "barrel%": 5.0,
            "hardhit%": 30.0,
            "gb%": 45.0,
            "swstr%": 12.0,
            "wpa/li": 0.8,
        },
        {
            "name": "User Starter B",
            "team": "USR",
            "k%": 0.20,
            "ip": 140,
            "era": 4.10,
            "pitching+": 102,
            "stuff+": 100,
            "k-bb%": 12.0,
            "xfip-": 98,
            "barrel%": 6.5,
            "hardhit%": 32.0,
            "gb%": 44.0,
            "swstr%": 10.0,
            "wpa/li": 0.5,
        },
    ])

@pytest.fixture
def mock_team_data_access():
    # Create a minimal mock implementing the methods used
    class MockTeamDA:
        def __init__(self):
            self._opponent_players = [{"player_name": "Opp Starter One", "position": "SP"}]
            self._user_players = [
                {"player_name": "User Starter A", "position": "SP"},
                {"player_name": "User Starter B", "position": "SP"},
            ]

        def get_all_players(self, team_id):
            if team_id == 9999:  # no opponent players
                return []
            if team_id == 8888:  # no user players
                return []
            if team_id == 1:     # opponent
                return self._opponent_players
            if team_id == 2:     # user
                return self._user_players
            return []

    return MockTeamDA()

@pytest.fixture
def app_with_opponent_blueprint(monkeypatch, mock_team_data_access, mock_stats_df):
    from backend.controller.opponent_controller import OpponentController

    # Monkeypatch pybaseball.pitching_stats to return our dataframe
    def fake_pitching_stats(year):
        df = mock_stats_df.copy()
        # The controller lowercases columns; emulate original names already as needed
        return df
    monkeypatch.setattr("backend.controller.opponent_controller.pitching_stats", fake_pitching_stats)

    # Monkeypatch PitcherRecommenderService to produce deterministic output
    def fake_recommend(pitchers, n, profile):
        # Create a small DataFrame consistent with controller expectations
        return (
            pd.DataFrame([
                {"rank": 1, "name": pitchers[0]["name"], "score": 92.345},
                {"rank": 2, "name": pitchers[1]["name"], "score": 84.123},
            ]),
            f"Profile {profile}: Selected top {n} pitchers to counter weaknesses."
        )
    monkeypatch.setattr(
        "backend.controller.opponent_controller.PitcherRecommenderService.recommend_starting_pitchers",
        staticmethod(fake_recommend),
    )

    # Also stabilize PitcherGradingService to avoid flakiness in weaknesses tests
    class FakeGradingService:
        @staticmethod
        def calculate_pitcher_grade(stats):
            # Simple grade based on K and ERA
            return max(0.0, min(100.0, (stats.get("K%", 0) * 100) - (stats.get("ERA", 0) - 3.5) * 10))

        @staticmethod
        def analyze_pitcher(stats, grade):
            return f"Grade {grade:.1f} analysis based on stats."
    monkeypatch.setattr("backend.controller.opponent_controller.PitcherGradingService", FakeGradingService)

    controller = OpponentController(team_data_access=mock_team_data_access)
    app = Flask(__name__)
    app.register_blueprint(controller.bp)
    app.testing = True
    return app