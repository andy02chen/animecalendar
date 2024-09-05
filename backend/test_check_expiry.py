import pytest
from flask import json
from main import app, check_expiry
from unittest.mock import patch, MagicMock
import time

class MockUser:
    def __init__(self, expires_in):
        self.expires_in = expires_in

# Create a pytest fixture for the test client
@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test Session id not found
@patch('main.get_session_id')
def test_session_not_found(mock_session_id, client):
    mock_session_id.return_value = None
    response, status_code = check_expiry()
    assert status_code == 401
    assert response == ''

# Test user not found
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_user_not_found(mock_find_user, mock_session_id, client):
    mock_session_id.return_value = 'fake_session'
    mock_find_user.return_value = None
    response, status_code = check_expiry()
    assert status_code == 401
    assert response == ''

# Sucess (Not expired)
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_success(mock_find_user, mock_session_id, client):
    mock_session_id.return_value = 'fake_session'
    mock_find_user.return_value = MockUser(expires_in=int(time.time()) + 1000)
    response, status_code = check_expiry()
    assert status_code == 100

# Failed to refresh
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshUsersTokens')
def test_failed_to_refresh(mock_refresh_tokens, mock_find_user, mock_session_id, client):
    mock_session_id.return_value = 'fake_session'
    mock_find_user.return_value = MockUser(expires_in=int(time.time()) - 1000)
    mock_refresh_tokens.return_value = '', 403
    response, status_code = check_expiry()
    assert status_code == 403

# Sucess (Refresh Tokens)
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshUsersTokens')
def test_success_to_refresh(mock_refresh_tokens, mock_find_user, mock_session_id, client):
    mock_session_id.return_value = 'fake_session'
    mock_find_user.return_value = MockUser(expires_in=int(time.time()) - 1000)
    mock_refresh_tokens.return_value = '', 204
    response, status_code = check_expiry()
    assert status_code == 204

#Test refresh exception
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshUsersTokens')
def test_refreshException(mock_refresh_tokens, mock_find_user, mock_session_id, client):
    mock_session_id.return_value = 'fake_session'
    mock_find_user.return_value = MockUser(expires_in=int(time.time()) - 1000)
    mock_refresh_tokens.side_effect = Exception()

    response, status_code = check_expiry()
    assert status_code == 401

#Test refresh exception
@patch('main.get_session_id')
def test_function_exception(mock_session_id, client):
    mock_session_id.side_effect = Exception()

    response, status_code = check_expiry()
    assert status_code == 401