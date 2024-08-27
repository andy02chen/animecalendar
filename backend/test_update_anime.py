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

# Test rate limit exceeded
@patch('main.is_rate_limited')
def test_rate_limit_exceeded(mock_rate_limit, client):
    mock_rate_limit.return_value = True
    response = client.post('/api/update-anime', json={})
    assert response.status_code == 429
    assert response.json == {"error": "rate limit exceeded"}

# Test no session ID
@patch('main.is_rate_limited')
@patch('main.get_session_id')
def test_no_session_id(mock_session_id,mock_rate_limit,client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = None
    response = client.post('/api/update-anime', json={})
    assert response.status_code == 400
    assert response.data.decode() == ''

# Test no User ID
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_no_user_id(mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = None
    response = client.post('/api/update-anime', json={})
    assert response.status_code == 401
    assert response.data.decode() == ''

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
    response = client.post('/api/update-anime', json={})
    assert response.status_code == 401
    assert response.data.decode() == ''

# Test sucessful update
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_sucess(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'completed': True, 'score': 10})
    assert response.status_code == 200
    mock_requests_patch.assert_called_once()

# Test unsuccessful update
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_unsuccessful(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'completed': True, 'score': 10})
    assert response.status_code == 502
    mock_requests_patch.assert_called_once()

# Test unsuccessful update - no anime id provided
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_no_anime_id(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    response = client.post('/api/update-anime', json={'eps-watched': 0, 'completed': True, 'score': 10})
    assert response.status_code == 400

# Test unsuccessful update - no eps-watched provided
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_no_eps_watched(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    response = client.post('/api/update-anime', json={'anime-id': 1, 'completed': True, 'score': 10})
    assert response.status_code == 400

# Test update - no score provided
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_no_score(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'completed': True})
    assert response.status_code == 200
    mock_requests_patch.assert_called_once()

# Test update unsuccesful - no completed status provided
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_no_completed_status(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'score': 10})
    assert response.status_code == 400

# Test found user but no access token
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_no_access_token(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = None
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'score': 10})
    assert response.status_code == 401

# Test sucessful update - not completed
@patch('main.is_rate_limited')
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.check_expiry')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.patch')
def test_update_anime_sucess_not_completed(mock_requests_patch, mock_access_token, mock_expiry, mock_user_query, mock_session_id, mock_rate_limit, client):
    mock_rate_limit.return_value = False
    mock_session_id.return_value = "fake_session"
    mock_user_query.return_value = MagicMock(access_token='fake_access_token')
    mock_access_token.return_value = b"fake_access_token"
    mock_expiry.return_value = '',100

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_requests_patch.return_value = mock_response

    response = client.post('/api/update-anime', json={'anime-id': 1, 'eps-watched': 0, 'completed': False, 'score': 10})
    assert response.status_code == 200
    mock_requests_patch.assert_called_once()