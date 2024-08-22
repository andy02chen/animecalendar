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