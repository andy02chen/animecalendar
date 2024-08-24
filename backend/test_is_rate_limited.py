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

@patch('main.RateLimit.query')
@patch('main.hash_text')
def test_is_rate_limited(mock_hash_text, mock_query, client):
    mock_hash_text.return_value = 'hashed_ip'

    # Mocking the query count
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 5

    # Case 1: Below the limit
    assert not is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)

    # Case 2: At the limit
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 10
    assert is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)

    # Case 3: Above the limit
    mock_query.filter_by.return_value.filter.return_value.count.return_value = 15
    assert is_rate_limited('127.0.0.1', '/api/test', limit=10, period=60)