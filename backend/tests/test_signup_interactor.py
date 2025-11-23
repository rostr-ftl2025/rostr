import pytest
from unittest.mock import MagicMock
from ..interactors.signup_interactor import SignupInteractor


@pytest.fixture
def user_data_access():
    return MagicMock()


@pytest.fixture
def team_data_access():
    return MagicMock()


@pytest.fixture
def interactor(user_data_access, team_data_access):
    return SignupInteractor(user_data_access, team_data_access)


def test_signup_missing_username(interactor):
    with pytest.raises(Exception, match="Username and password are required."):
        interactor.signup("", "password")


def test_signup_missing_password(interactor):
    with pytest.raises(Exception, match="Username and password are required."):
        interactor.signup("user", "")


def test_signup_existing_user(interactor, user_data_access):
    user_data_access.read.return_value = MagicMock()  # existing user

    with pytest.raises(Exception, match="same username already exists"):
        interactor.signup("alice", "password")

    user_data_access.read.assert_called_once_with("alice")


def test_signup_success(interactor, user_data_access, team_data_access):
    # No existing user
    user_data_access.read.return_value = None

    # Mock the created user entity
    mock_user_entity = MagicMock()
    mock_user_entity.get_username.return_value = "alice"
    user_data_access.create.return_value = mock_user_entity

    # Mock opponent team creation
    team_data_access.create_opponent_user_and_team.return_value = {
        "opponent_team_id": "team123"
    }

    result = interactor.signup("alice", "pass123")

    # Validating result
    assert result == {"username": "alice"}

    # The right calls were made
    user_data_access.read.assert_called_once_with("alice")
    user_data_access.create.assert_called_once_with("alice", "pass123")
    team_data_access.create_opponent_user_and_team.assert_called_once()
    user_data_access.assign_opponent_team.assert_called_once_with(
        "alice", "team123"
    )
