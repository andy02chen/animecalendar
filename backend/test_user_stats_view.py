import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock

class MockUser:
    def __init__(self, access_token):
        self.access_token = access_token

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test Rate limit
@patch('main.is_rate_limited')
def test_rate_limit_exceeded(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.get('/api/user-stats-view',)
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# Test no session found
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_no_session_found(mock_get_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = None
    response = client.get('/api/user-stats-view')
    assert response.status_code == 302
    assert response.location.endswith('/')

#test user not found
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_no_user(mock_found_user,mock_get_session, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_get_session.return_value = "fake_session"
    mock_found_user.return_value = None

    response = client.get('/api/user-stats-view')
    assert response.status_code == 302
    assert response.location.endswith('/')

# Test check expiry (Unable to refresh token)
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
def test_check_expiry_failure(mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = "Fake user"
    mock_expiry.return_value = '',401

    response = client.get('/api/user-stats-view')
    assert response.status_code == 401
    assert response.data.decode() == ''

#test found user
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.get')
def test_found_user(mock_requests_get, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_get.return_value = mock_response

    response = client.get('/api/user-stats-view')
    assert response.status_code == 200
    mock_requests_get.assert_called_once()

# Test found user no data from mal
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.get')
def test_data_fail(mock_requests_get, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_requests_get.return_value = mock_response

    response = client.get('/api/user-stats-view')
    assert response.status_code == 500
    mock_requests_get.assert_called_once()
    assert response.data.decode() == 'Unable to get user data from MAL'

# Test guest
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.requests.get')
def test_guest(mock_requests_get, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "guest"

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_get.return_value = mock_response

    response = client.get('/api/user-stats-view')
    assert response.status_code == 500
    assert response.data.decode() == 'You must be logged in to get this data'