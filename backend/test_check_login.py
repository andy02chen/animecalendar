import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock
import time

class MockUser:
    def __init__(self, user_id, pfp):
        self.user_id = user_id
        self.pfp = pfp

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test rate limited
@patch('main.is_rate_limited')
def test_rate_limited(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.get('/api/check-login')
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# Test no session
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_no_session(mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = None
    response = client.get('/api/check-login')
    assert response.status_code == 200
    assert response.json == {'loggedIn':False}

# Test guest check login
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_guest_check_login(mock_get_session,mock_rate_limit,client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "guest"
    response = client.get('/api/check-login')
    assert response.status_code == 200
    assert response.json == {
                'loggedIn':True,
                'username': 'Guest',
                'picture': None
            }

# Test no found user
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_user_not_found(mock_find_user, mock_get_session,mock_rate_limit,client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session"
    mock_find_user.return_value = None
    response = client.get('/api/check-login')
    assert response.status_code == 400
    assert response.json == {'loggedIn':False}

# Test found user
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_success(mock_find_user, mock_get_session,mock_rate_limit,client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session"
    mock_find_user.return_value = MockUser(user_id="fake_id", pfp="fake_path")
    response = client.get('/api/check-login')
    assert response.status_code == 200
    assert response.json == {
                'loggedIn':True,
                'username': "fake_id",
                'picture': "fake_path"
            }

# Test API exception
@patch('main.is_rate_limited')
def test_api_exception(mock_rate_limit, client):
    mock_rate_limit.side_effect = Exception()
    response = client.get('/api/check-login')
    assert response.status_code == 400
    assert response.json == {'loggedIn':False}