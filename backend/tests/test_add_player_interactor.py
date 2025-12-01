import json
import pandas as pd
from flask import Flask

from backend.interactors.add_player_interactor import AddPlayerInteractor

# ------------------------------------------------------------
# Fake Data Access Layer
# ------------------------------------------------------------

class FakePlayerDAO:
    def __init__(self):
        self.players = []
        self.force_exception = False

    def list_by_team(self, team_id):
        return [p for p in self.players if p["team_id"] == team_id]

    def create(self, entity):
        if self.force_exception:
            raise Exception("DB error")

        player_dict = {
            "team_id": entity.team_id,
            "player_name": entity.player_name,
            "mlbid": entity.mlbid,
            "idfg": entity.idfg,
            "position": entity.position,
            "grade": entity.grade,
            "analysis": entity.analysis,
        }
        self.players.append(player_dict)
        return player_dict


# ------------------------------------------------------------
# Fake grading service
# ------------------------------------------------------------

class FakeGradingService:
    @staticmethod
    def calculate_pitcher_grade(stats):
        return 90

    @staticmethod
    def analyze_pitcher(stats, grade):
        return "Elite pitcher"


# ------------------------------------------------------------
# Monkey-patch real grading service
# ------------------------------------------------------------

import backend.services.pitcher_grading_service
backend.services.pitcher_grading_service.PitcherGradingService = FakeGradingService


# ------------------------------------------------------------
# Monkey-patch pybaseball.pitching_stats
# ------------------------------------------------------------
from backend.interactors import add_player_interactor as interactor_module


def fake_pitching_stats(year):
    df = pd.DataFrame([
        {"Name": "Gerrit Cole", "K%": 33.0, "IP": 200.0, "ERA": 2.44}
    ])
    df["Name"] = df["Name"].astype(str)   # <-- IMPORTANT FIX
    return df

interactor_module.pybaseball.pitching_stats = fake_pitching_stats


# ============================================================
#                     TEST CASES
# ============================================================

def make_interactor():
    """Helper to create interactor + app context."""
    dao = FakePlayerDAO()
    interactor = AddPlayerInteractor(dao)
    app = Flask(__name__)
    return interactor, dao, app


# ------------------------------------------------------------
# 1. Missing input → 400
# ------------------------------------------------------------

def test_missing_fields():
    interactor, dao, app = make_interactor()

    with app.app_context():
        resp, status = interactor.execute(
            team_id=None,
            player_name="Test",
            mlbid="1",
            idfg="2",
            position="P"
        )

    assert status == 400
    data = json.loads(resp.get_data())
    assert "required" in data["error"].lower()


# ------------------------------------------------------------
# 2. Duplicate by idfg → 409
# ------------------------------------------------------------

def test_duplicate_idfg():
    interactor, dao, app = make_interactor()

    dao.players.append({
        "team_id": 1,
        "player_name": "Someone Else",
        "mlbid": "500",
        "idfg": "456",
        "position": "P",
        "grade": 80,
        "analysis": "Good"
    })

    with app.app_context():
        resp, status = interactor.execute(
            team_id=1,
            player_name="New Pitcher",
            mlbid="111",
            idfg="456",   # same IDFG
            position="P"
        )

    assert status == 409


# ------------------------------------------------------------
# 3. Duplicate by name (case-insensitive) → 409
# ------------------------------------------------------------

def test_duplicate_name():
    interactor, dao, app = make_interactor()

    dao.players.append({
        "team_id": 1,
        "player_name": "GERRIT COLE",
        "mlbid": "500",
        "idfg": "999",
        "position": "P",
        "grade": 80,
        "analysis": "Good"
    })

    with app.app_context():
        resp, status = interactor.execute(
            team_id=1,
            player_name="gerrit cole",  # same lowercase
            mlbid="111",
            idfg="123",
            position="P"
        )

    assert status == 409


# ------------------------------------------------------------
# 4. No pitching stats for this player → 404
# ------------------------------------------------------------

def test_no_stats_found():
    interactor, dao, app = make_interactor()

    # Monkeypatch stats to return empty
    def empty_stats(year):
        return pd.DataFrame([])

    interactor_module.pitching_stats = empty_stats

    with app.app_context():
        resp, status = interactor.execute(
            team_id=1,
            player_name="Unknown Guy",
            mlbid="111",
            idfg="123",
            position="P"
        )

    assert status == 404
    data = json.loads(resp.get_data())
    assert "no stats" in data["error"].lower()


# ------------------------------------------------------------
# 5. Successful addition → 201
# ------------------------------------------------------------

def test_add_player_success():
    interactor, dao, app = make_interactor()

    # Restore working fake stats
    interactor_module.pitching_stats = fake_pitching_stats

    with app.app_context():
        resp, status = interactor.execute(
            team_id=1,
            player_name="Gerrit Cole",
            mlbid="123",
            idfg="456",
            position="P"
        )

    assert status == 201
    data = json.loads(resp.get_data())
    assert data["player_name"] == "Gerrit Cole"
    assert data["grade"] == 90
    assert len(dao.players) == 1


# ------------------------------------------------------------
# 6. DAO.create() throws exception → 400
# ------------------------------------------------------------

def test_database_exception():
    interactor, dao, app = make_interactor()
    dao.force_exception = True

    with app.app_context():
        resp, status = interactor.execute(
            team_id=1,
            player_name="Gerrit Cole",
            mlbid="123",
            idfg="456",
            position="P"
        )

    assert status == 400
    data = json.loads(resp.get_data())
    assert "db error" in data["error"].lower()
