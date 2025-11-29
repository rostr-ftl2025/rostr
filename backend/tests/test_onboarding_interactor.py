# ---------------------------------------
# test_onboarding_interactor.py
# ---------------------------------------
import pytest
from unittest.mock import MagicMock
from ..interactors.onboarding_interactor import (
    OnboardingInteractor,
    OnboardingRequest,
    OnboardingResponse,
)

# -----------------------------
# FIXTURES
# -----------------------------

@pytest.fixture
def interactor():
    return OnboardingInteractor()

@pytest.fixture
def mock_request():
    req = MagicMock(spec=OnboardingRequest)
    req.user_id = "123"
    return req


# -----------------------------
# TESTS
# -----------------------------

def test_onboarding_missing_user_id(interactor):
    request = OnboardingRequest(user_id="")
    with pytest.raises(ValueError, match="user_id is required"):
        interactor.handle(request)


def test_onboarding_success(interactor):
    request = OnboardingRequest(user_id="123")
    response = interactor.handle(request)
    assert response.steps_completed == 1
    assert response.next_step == "open_home_page"


def test_onboarding_user_id_none(interactor):
    request = OnboardingRequest(user_id=None)
    with pytest.raises(ValueError):
        interactor.handle(request)


def test_onboarding_type_check_response(interactor):
    request = OnboardingRequest(user_id="abc")
    response = interactor.handle(request)
    assert isinstance(response, OnboardingResponse)


def test_onboarding_unique_users(interactor):
    r1 = interactor.handle(OnboardingRequest(user_id="1"))
    r2 = interactor.handle(OnboardingRequest(user_id="2"))
    assert r1.next_step == "open_home_page"
    assert r2.next_step == "open_home_page"


def test_onboarding_long_user_id(interactor):
    long_id = "x" * 500
    request = OnboardingRequest(user_id=long_id)
    response = interactor.handle(request)
    assert response.steps_completed == 1


def test_onboarding_special_chars(interactor):
    request = OnboardingRequest(user_id="user_@!#%")
    response = interactor.handle(request)
    assert response.next_step == "open_home_page"


def test_onboarding_handles_magicmock_request(interactor, mock_request):
    response = interactor.handle(mock_request)
    assert response.steps_completed == 1


def test_onboarding_raises_on_wrong_request_type(interactor):
    with pytest.raises(AttributeError):
        interactor.handle({})  # not a request object


def test_onboarding_request_object_properties(interactor):
    req = OnboardingRequest(user_id="678")
    assert req.user_id == "678"


def test_onboarding_no_mutation(interactor):
    req = OnboardingRequest(user_id="id1")
    before = req.user_id
    interactor.handle(req)
    assert req.user_id == before


def test_onboarding_response_fields(interactor):
    r = interactor.handle(OnboardingRequest(user_id="x"))
    assert hasattr(r, "steps_completed")
    assert hasattr(r, "next_step")


def test_onboarding_response_types(interactor):
    r = interactor.handle(OnboardingRequest(user_id="x"))
    assert isinstance(r.steps_completed, int)
    assert isinstance(r.next_step, str)


def test_onboarding_stable_step_count(interactor):
    r = interactor.handle(OnboardingRequest(user_id="x"))
    assert r.steps_completed == 1


def test_onboarding_case_sensitive_user_id(interactor):
    r1 = interactor.handle(OnboardingRequest(user_id="User"))
    r2 = interactor.handle(OnboardingRequest(user_id="user"))
    # Behavior should treat these as different unless code says otherwise
    assert r1.next_step == "open_home_page"
    assert r2.next_step == "open_home_page"


def test_onboarding_extremely_small_id(interactor):
    r = interactor.handle(OnboardingRequest(user_id="a"))
    assert r.steps_completed == 1


def test_onboarding_extremely_large_id(interactor):
    r = interactor.handle(OnboardingRequest(user_id="9" * 2000))
    assert r.steps_completed == 1
