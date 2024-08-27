import pytest
import requests
from unittest.mock import patch, MagicMock
from main import refreshTokens
import time

class MockUser:
    def __init__(self):
        self.refresh_token = b'encrypted_refresh_token'
        self.access_token = 'encrypted_access_token'
        self.expires_in = 0

# Test sucess
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.cipher_suite.encrypt')
@patch('main.db.session.commit')
def test_refreshTokens_success(mock_db_commit, mock_encrypt, mock_post, mock_decrypt):
    mock_decrypt.return_value = b'encrypted_refresh_token'

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "access_token": "new_access_token",
        "refresh_token": "new_refresh_token",
        "expires_in": 3600
    }
    mock_post.return_value = mock_response

    mock_encrypt.side_effect = lambda x: x

    mock_user = MockUser()
    result = refreshTokens(mock_user)

    assert result == True
    assert mock_user.access_token == b'new_access_token'
    assert mock_user.refresh_token == b'new_refresh_token'
    assert mock_user.expires_in == int(time.time()) + 3600
    mock_db_commit.assert_called_once()

# Test failure
@patch('main.cipher_suite.decrypt')
@patch('main.requests.post')
@patch('main.cipher_suite.encrypt')
def test_refreshTokens_fail(mock_encrypt, mock_post, mock_decrypt):
    mock_decrypt.return_value = b'encrypted_refresh_token'

    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_post.return_value = mock_response

    mock_encrypt.side_effect = lambda x: x

    mock_user = MockUser()
    result = refreshTokens(mock_user)

    assert result == False
    assert mock_user.access_token == 'encrypted_access_token'
    assert mock_user.refresh_token == b'encrypted_refresh_token'