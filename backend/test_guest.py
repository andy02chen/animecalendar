import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# session is guest
@patch('main.get_session_id')
def test_guest(mock_session, client):
    mock_session.return_value = 'guest'
    response = client.get('/guest')
    assert response.status_code == 302
    assert response.location.endswith('/home')

# session not guest
@patch('main.get_session_id')
def test_user(mock_session, client):
    mock_session.return_value = 'fake_session'
    response = client.get('/guest')
    assert response.status_code == 302
    assert response.location.endswith('/')