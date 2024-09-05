import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock

# Create a pytest fixture for the test client
@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test rate limited
@patch('main.is_rate_limited')
def test_logout_rate_limited(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.delete('/api/logout')
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# Test no session id
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_logout_no_session_id(mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = None
    response = client.delete('/api/logout')
    assert response.status_code == 401

# Test guest logout
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_guest_logout(mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = 'guest'
    response = client.delete('/api/logout')
    assert response.status_code == 200

# Test not found user id
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_not_found_user_logout(mock_found_user, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = 'fake_session_id'
    mock_found_user.return_value = None
    response = client.delete('/api/logout')
    assert response.status_code == 401

# Test logout success
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_logout_success(mock_found_user, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = 'fake_session_id'
    mock_found_user.return_value = MagicMock(session_id=mock_session_id)
    response = client.delete('/api/logout')
    assert response.status_code == 200

# Test logout exception
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.db.session.commit')
def test_logout_commit_exception(mock_commit, mock_found_user, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = 'fake_session_id'
    mock_found_user.side_effect = MagicMock(session_id=mock_session_id)
    mock_commit.side_effect = Exception()
    response = client.delete('/api/logout')
    assert response.status_code == 200
    mock_commit.assert_called_once()

# Test API exception
@patch('main.is_rate_limited')
def test_api_exception(mock_rate_limit, client):
    mock_rate_limit.side_effect = Exception()

    response = client.delete('/api/logout')
    assert response.status_code == 200