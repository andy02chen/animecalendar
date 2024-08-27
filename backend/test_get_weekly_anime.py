import pytest
from flask import json
from main import app, check_expiry
from unittest.mock import patch, MagicMock
import time

class MockUser:
    def __init__(self, access_token):
        self.access_token = access_token

# Create a pytest fixture for the test client
@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test rate limited
@patch('main.is_rate_limited')
def test_rate_limited(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# Test no session
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_no_session(mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = None
    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 302
    assert response.headers['Location'] == '/'

# Test guest session success
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.requests.get')
def test_guest_session_success(mock_request_get, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "guest"

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_request_get.return_value = mock_response

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 200
    mock_request_get.assert_called_once()

# Test guest session + MAL server error
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.requests.get')
def test_guest_session_mal_error(mock_request_get, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "guest"

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_request_get.return_value = mock_response

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 500
    mock_request_get.assert_called_once()

# Test Not found user
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_user_not_found(mock_find_user, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session_id"
    mock_find_user.return_value = None

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 302
    assert response.headers['Location'] == '/'

# Test Tokens expired
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
def test_user_token_expired(mock_expiry, mock_find_user, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session_id"
    mock_find_user.return_value = MockUser(access_token="fake_token")
    mock_expiry.return_value = '', 401

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 401

# Test Found user not access token
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
def test_user_token_not_found(mock_decrypt, mock_expiry, mock_find_user, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session_id"
    mock_find_user.return_value = MockUser(access_token="fake_token")
    mock_expiry.return_value = '', 100
    mock_decrypt.return_value = None

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 500

# Test User + MAL server error
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.get')
def test_found_user_mal_error(mock_request_get, mock_decrypt, mock_expiry, mock_find_user, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session_id"
    mock_find_user.return_value = MockUser(access_token="fake_token")
    mock_expiry.return_value = '', 100
    mock_decrypt.return_value = mock_find_user.access_token

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_request_get.return_value = mock_response

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 500
    mock_request_get.assert_called_once()

# Test user session success
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.get')
def test_found_user_success(mock_request_get, mock_decrypt, mock_expiry, mock_find_user, mock_get_session,mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session_id"
    mock_find_user.return_value = MockUser(access_token="fake_token")
    mock_expiry.return_value = '', 100
    mock_decrypt.return_value = mock_find_user.access_token

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_request_get.return_value = mock_response

    response = client.get('/api/get-weekly-anime')
    assert response.status_code == 200
    mock_request_get.assert_called_once()