import pytest
from unittest.mock import Mock
from flask import Flask
import bcrypt
from ..controller.signup_controller import SignupController


def test_signup_success(monkeypatch):
    # Arrange
    interactor = Mock()
    interactor.signup.return_value = {"id": 1, "username": "alice"}
    monkeypatch.setattr(bcrypt, "hashpw", lambda pw, salt: b"hashed_pw")

    app = Flask(__name__)
    controller = SignupController(interactor)

    # Act
    with app.test_request_context(json={"username": "alice", "password": "secret"}):
        resp, status = controller.signup()

    # Assert
    assert status == 201
    assert resp.get_json() == {"id": 1, "username": "alice"}
    interactor.signup.assert_called_once_with("alice", b"hashed_pw")


def test_signup_error(monkeypatch):
    # Arrange
    interactor = Mock()
    interactor.signup.side_effect = Exception("User exists")
    monkeypatch.setattr(bcrypt, "hashpw", lambda pw, salt: b"hashed_pw")

    app = Flask(__name__)
    controller = SignupController(interactor)

    # Act
    with app.test_request_context(json={"username": "bob", "password": "pw"}):
        resp, status = controller.signup()

    # Assert
    assert status == 400
    assert "error" in resp.get_json()
    assert resp.get_json()["error"] == "User exists"
    interactor.signup.assert_called_once_with("bob", b"hashed_pw")