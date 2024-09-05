import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock
import time

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# test rate limited
@patch('main.is_rate_limited')
def test_rate_limited(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.put('/api/refresh-token')
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# test session not found
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_no_session(mock_user_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_user_session.return_value = None
    response = client.put('/api/refresh-token')

    assert response.status_code == 401
    assert response.data.decode() == ''

# Test guest session
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_guest_session(mock_user_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_user_session.return_value = "guest"
    response = client.put('/api/refresh-token')

    assert response.status_code == 204
    assert response.data.decode() == ''

# test user not found
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_no_user(mock_find_user, mock_user_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_user_session.return_value = "fake_session"
    mock_find_user.return_value = None

    response = client.put('/api/refresh-token')

    assert response.status_code == 401
    assert response.data.decode() == ''

# Error refreshing tokens
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshTokens')
def test_error_refresh(mock_refresh, mock_find_user, mock_user_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_user_session.return_value = "fake_session"
    mock_find_user.return_value = "fake_user"
    mock_refresh.return_value = False
    response = client.put('/api/refresh-token')

    assert response.status_code == 403
    assert response.data.decode() == 'There was an error from MAL servers. Please try logging in again later. If this error persists, please report bug.'

# refresh success
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshTokens')
def test_refresh_sucess(mock_refresh, mock_find_user, mock_user_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_user_session.return_value = "fake_session"
    mock_find_user.return_value = "fake_user"
    mock_refresh.return_value = True
    response = client.put('/api/refresh-token')

    assert response.status_code == 204
    assert response.data.decode() == ''

# refresh exception
@patch('main.is_rate_limited')
def test_refresh_exception(mock_rate_limit, client):
    mock_rate_limit.side_effect = Exception()
    response = client.put('/api/refresh-token')

    assert response.status_code == 401
    assert response.data.decode() == ''