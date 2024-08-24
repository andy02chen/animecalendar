import pytest
from flask import json
from main import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    with app.app_context():
        with app.test_client() as client:
            yield client