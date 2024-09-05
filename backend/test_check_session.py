import pytest
from flask import json
from main import app, checkSession
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test no session id
@patch('main.get_session_id')
def test_no_session_id(mock_session, client):
    mock_session.return_value = None
    response = client.get('/')
    assert response.status_code == 302
    assert response.location.endswith('/a')

# Test No user id
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_no_user_id(mock_find_user, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_find_user.return_value = None
    response = client.get('/')
    assert response.status_code == 302
    assert response.location.endswith('/a')
    assert response.headers['Set-Cookie'].startswith('session=;')

# Test fail refreshing tokens
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshTokens')
def test_fail_refresh(mock_refresh_tokens, mock_find_user, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_find_user.return_value = "fake_user"
    mock_refresh_tokens.return_value = False
    response = client.get('/')
    assert response.status_code == 302
    assert response.location.endswith('/a')
    assert response.headers['Set-Cookie'].startswith('session=;')

# Test redirect to home page
@patch('main.get_session_id')
@patch('main.find_user_function')
@patch('main.refreshTokens')
def test_refresh(mock_refresh_tokens, mock_find_user, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_find_user.return_value = "fake_user"
    mock_refresh_tokens.return_value = True
    response = client.get('/')
    assert response.status_code == 302
    assert response.location.endswith('/home')

# Test exception
@patch('main.get_session_id')
def test_refresh_exception(mock_session, client):
    mock_session.side_effect = Exception()
    response = client.get('/')
    assert response.status_code == 302
    assert response.location.endswith('/a')