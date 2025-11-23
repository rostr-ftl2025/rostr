# ---------------------------------------
# test_signin_interactor.py
# ---------------------------------------
import pytest
import bcrypt
from unittest.mock import MagicMock
from ..interactors.signin_interactor import SigninInteractor


@pytest.fixture
def user_data_access():
    return MagicMock()


@pytest.fixture
def team_data_access():
    return MagicMock()


@pytest.fixture
def interactor(user_data_access, team_data_access):
    return SigninInteractor(user_data_access, team_data_access)


@pytest.fixture
def mock_user():
    user = MagicMock()
    user.get_username.return_value = "alice"
    user.get_id.return_value = 42
    return user


# -----------------------------
# TESTS
# -----------------------------

def test_signin_missing_username(interactor):
    with pytest.raises(Exception, match="required"):
        interactor.signin("", "pass")


def test_signin_missing_password(interactor):
    with pytest.raises(Exception, match="required"):
        interactor.signin("alice", "")


def test_signin_user_not_found(interactor, user_data_access):
    user_data_access.read.return_value = None

    with pytest.raises(Exception, match="Incorrect username or password"):
        interactor.signin("alice", "pw")

    user_data_access.read.assert_called_once_with("alice")


def test_signin_incorrect_password(interactor, user_data_access, mock_user, monkeypatch):
    mock_user.get_password.return_value = b"hashed"
    user_data_access.read.return_value = mock_user

    # Mock bcrypt.checkpw to return False
    monkeypatch.setattr(bcrypt, "checkpw", lambda pw, hashed: False)

    with pytest.raises(Exception, match="Incorrect username or password"):
        interactor.signin("alice", "wrongpw")


def test_signin_success_with_existing_opponent(
    interactor, user_data_access, mock_user, monkeypatch
):
    mock_user.get_password.return_value = b"hashed"
    mock_user.get_opponent_team_id.return_value = "team123"
    user_data_access.read.return_value = mock_user

    # Mock valid password
    monkeypatch.setattr(bcrypt, "checkpw", lambda pw, hashed: True)

    result = interactor.signin("alice", "correctpw")

    assert result == {
        "username": "alice",
        "id": 42,
        "opponent_team_id": "team123",
    }

    user_data_access.assign_opponent_team.assert_not_called()


def test_signin_assigns_new_opponent_team(
    interactor, user_data_access, team_data_access, mock_user, monkeypatch
):
    mock_user.get_password.return_value = b"hashed"
    mock_user.get_opponent_team_id.return_value = None
    user_data_access.read.return_value = mock_user

    # Password is correct
    monkeypatch.setattr(bcrypt, "checkpw", lambda pw, hashed: True)

    team_data_access.create_opponent_user_and_team.return_value = {
        "opponent_team_id": "team999"
    }

    result = interactor.signin("alice", "correctpw")

    assert result["opponent_team_id"] == "team999"
    team_data_access.create_opponent_user_and_team.assert_called_once()
    user_data_access.assign_opponent_team.assert_called_once_with("alice", "team999")
