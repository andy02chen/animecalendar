import pytest
from flask import json
from main import app, is_rate_limited
from unittest.mock import patch, MagicMock
import time

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client

# Case 1: Below the limit
@patch('main.db.session.commit')
@patch('main.db.session.add')
@patch('main.RateLimit.query')
@patch('main.hash_text')
def test_below_limit(mock_hash_text, mock_query, mock_add, mock_commit, client):
    mock_hash_text.return_value = 'hashed_ip'
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 5

    assert not is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)
    mock_add.assert_called_once()
    mock_commit.assert_called_once()

# Case 2: At the limit
@patch('main.RateLimit.query')
@patch('main.hash_text')
def test_on_limit(mock_hash_text, mock_query, client):
    mock_hash_text.return_value = 'hashed_ip'
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 10

    assert is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)

# Case 3: Above the limit
@patch('main.RateLimit.query')
@patch('main.hash_text')
def test_above_limit(mock_hash_text, mock_query, client):
    mock_hash_text.return_value = 'hashed_ip'
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 15

    assert is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)

# Case 4: exception
@patch('main.db.session.commit')
@patch('main.db.session.add')
@patch('main.RateLimit.query')
@patch('main.hash_text')
def test_exception(mock_hash_text, mock_query, mock_add, mock_commit, client):
    mock_hash_text.return_value = 'hashed_ip'
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 5
    mock_commit.side_effect = Exception()

    assert is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)
    mock_add.assert_called_once()