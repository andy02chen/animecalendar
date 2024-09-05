import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Test no session
@patch('main.get_session_id')
@patch('main.generateRandomState')
@patch('main.generateCodeChallenge')
@patch('main.hash_text')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.add')
@patch('main.db.session.commit')
def test_no_session(mock_commit, mock_add, mock_encrypt, mock_hash_text, mock_code_challenge, mock_state, mock_get_session_id, client):
    mock_get_session_id.return_value = None
    mock_state.return_value = "random_state"
    mock_code_challenge.return_value = "code_challenge"
    mock_encrypt.return_value = "encrypted"
    mock_hash_text.return_value = "hashed"

    response = client.get('/auth')

    assert response.status_code == 302
    assert "https://myanimelist.net/v1/oauth2/authorize" in response.location
    assert "state=random_state" in response.location
    assert "code_challenge=code_challenge" in response.location
    assert response.headers['Set-Cookie'].startswith('session=')
    
    mock_add.assert_called_once()
    mock_commit.assert_called_once()

# Test found user
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_found_user(mock_find_user_function, mock_get_session_id, client):
    mock_get_session_id.return_value = 'valid_session_id'
    mock_find_user_function.return_value = 'user_id'

    response = client.get('/auth')
    assert response.status_code == 302
    assert response.location.endswith('/home')

# Test user not found
@patch('main.get_session_id')
@patch('main.find_user_function')
def test_user_not_found(mock_find_user_function, mock_get_session_id, client):
    mock_get_session_id.return_value = 'valid_session_id'
    mock_find_user_function.return_value = None

    response = client.get('/auth')
    assert response.status_code == 302
    assert response.location.endswith('/')
    assert response.headers['Set-Cookie'].startswith('session=;')

# Test exception
@patch('main.get_session_id')
@patch('main.generateRandomState')
@patch('main.generateCodeChallenge')
@patch('main.hash_text')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.add')
@patch('main.db.session.commit')
def test_exception(mock_commit, mock_add, mock_encrypt, mock_hash_text, mock_code_challenge, mock_state, mock_get_session_id, client):
    mock_get_session_id.return_value = None
    mock_state.return_value = "random_state"
    mock_code_challenge.return_value = "code_challenge"
    mock_encrypt.return_value = "encrypted"
    mock_hash_text.return_value = "hashed"
    mock_commit.side_effect = Exception()

    response = client.get('/auth')

    assert response.status_code == 500
    mock_add.assert_called_once()