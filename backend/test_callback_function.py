import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from main import app

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# No returned state and no auth code
def test_no_return_state_and_no_code(client):
    response = client.get('/oauth/callback')

    assert response.status_code == 302
    assert response.location.endswith('/')

# returned state only
def test_no_return_state(client):
    response = client.get('/oauth/callback?state=correct_state')

    assert response.status_code == 302
    assert response.location.endswith('/')

# auto code only
def test_no_code(client):
    response = client.get('/oauth/callback?code=correct_code')

    assert response.status_code == 302
    assert response.location.endswith('/')

# session not found
@patch('main.get_session_id')
def test_no_session(mock_session, client):
    mock_session.return_value = None
    response = client.get('/oauth/callback?state=correct_state&code=correct_code')
    assert response.status_code == 200
    assert b'localStorage.setItem(\'errorMsgDiv\', "True");' in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

# no matching session
@patch('main.get_session_id')
@patch('main.query_auth')
def test_no_session_match(mock_auth, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth.return_value = None

    response = client.get('/oauth/callback?state=correct_state&code=correct_code')
    assert response.status_code == 200
    assert b'localStorage.setItem(\'errorMsgDiv\', "True");' in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

class MockAuth:
    def __init__(self, oauth_state, state_salt, code_challenge):
        self.oauth_state = oauth_state
        self.state_salt = state_salt
        self.code_challenge = code_challenge

# test state not match
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
def test_state_not_match(mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_hash.return_value = "different_hashed_value"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_query = MagicMock()
    mock_query.first.return_value = mock_auth_instance
    mock_auth_query.return_value = mock_query

    response = client.get('/oauth/callback?state=incorrect_state&code=correct_code')

    # Assertions
    assert response.status_code == 200
    assert b"localStorage.setItem('errorMsgDiv', '2');" in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

# fail token exchange
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
def test_fail_token_exchange(mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_post.return_value = mock_response

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 200
    assert b"localStorage.setItem('errorMsgDiv', '1');" in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

# fail get user info
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.requests.get')
def test_fail_get_user_info(mock_get, mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        'access_token': 'fake_access_token',
        'refresh_token': 'fake_refresh_token',
        'expires_in': 3600
    }

    mock_get.return_value.status_code = 400

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 200
    assert b"localStorage.setItem('errorMsgDiv', '1');" in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

# token exchange success - new user
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.requests.get')
@patch('main.find_user_by_name')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.add')
@patch('main.db.session.delete')
@patch('main.db.session.commit')
def test_success_new_user(mock_db_commit, mock_db_delete, mock_db_add, mock_encrypt, mock_find_user, mock_get, mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        'access_token': 'fake_access_token',
        'refresh_token': 'fake_refresh_token',
        'expires_in': 3600
    }

    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        'name': 'test_user',
        'picture': 'http://example.com/pic.png'
    }

    mock_find_user.return_value = None
    mock_encrypt.return_value = "encrypted"

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 302
    assert response.location.endswith('/home')

    mock_db_add.assert_called_once()
    mock_db_delete.assert_called_once()
    mock_db_commit.assert_called_once()

class MockUser:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.expires_in = None
        self.session_id = None

# token exchange success - exisiting user
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.requests.get')
@patch('main.find_user_by_name')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.delete')
@patch('main.db.session.commit')
def test_success_existing_user(mock_db_commit, mock_db_delete, mock_encrypt, mock_find_user, mock_get, mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        'access_token': 'fake_access_token',
        'refresh_token': 'fake_refresh_token',
        'expires_in': 3600
    }

    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        'name': 'test_user',
        'picture': 'http://example.com/pic.png'
    }

    mock_find_user.return_value = MockUser()
    mock_encrypt.return_value = "encrypted"

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 302
    assert response.location.endswith('/home')

    mock_db_delete.assert_called_once()
    mock_db_commit.assert_called_once()

# token exchange success - user no picture
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.requests.get')
@patch('main.find_user_by_name')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.add')
@patch('main.db.session.delete')
@patch('main.db.session.commit')
def test_success_new_user_no_image(mock_db_commit, mock_db_delete, mock_db_add, mock_encrypt, mock_find_user, mock_get, mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        'access_token': 'fake_access_token',
        'refresh_token': 'fake_refresh_token',
        'expires_in': 3600
    }

    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        'name': 'test_user'
    }

    mock_find_user.return_value = None
    mock_encrypt.return_value = "encrypted"

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 302
    assert response.location.endswith('/home')

    mock_db_add.assert_called_once()
    mock_db_delete.assert_called_once()
    mock_db_commit.assert_called_once()

# Test exception
@patch('main.get_session_id')
@patch('main.query_auth')
@patch('main.hash_text')
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.requests.get')
@patch('main.find_user_by_name')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.add')
@patch('main.db.session.delete')
@patch('main.db.session.commit')
def test_exception(mock_db_commit, mock_db_delete, mock_db_add, mock_encrypt, mock_find_user, mock_get, mock_post, mock_decrypt, mock_hash, mock_auth_query, mock_session, client):
    mock_session.return_value = "fake_session"
    mock_auth_instance = MockAuth(oauth_state='hashed_state', state_salt='salt', code_challenge="code")
    mock_auth_query.return_value = mock_auth_instance
    mock_hash.return_value = "hashed_state"
    mock_decrypt.return_value = b"code"

    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        'access_token': 'fake_access_token',
        'refresh_token': 'fake_refresh_token',
        'expires_in': 3600
    }

    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        'name': 'test_user',
        'picture': 'http://example.com/pic.png'
    }

    mock_find_user.return_value = None
    mock_encrypt.return_value = "encrypted"

    mock_db_commit.side_effect = Exception()

    response = client.get('/oauth/callback?state=state&code=code')
    assert response.status_code == 200
    assert b"localStorage.setItem('errorMsgDiv', '4');" in response.data
    assert b'window.location.href = "/a";' in response.data
    assert b'<h1>Redirecting...</h1>' in response.data

    mock_db_add.assert_called_once()
    mock_db_delete.assert_called_once()