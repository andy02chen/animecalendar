import pytest
import hashlib
from main import hash_text

def test_hash_text_correctness():
    text = "password123"
    salt = "salt"
    expected_hash = hashlib.sha256((text + salt).encode()).hexdigest()
    assert hash_text(text, salt) == expected_hash

def test_hash_text_empty_string():
    text = ""
    salt = "salt"
    expected_hash = hashlib.sha256(salt.encode()).hexdigest()
    assert hash_text(text, salt) == expected_hash

def test_hash_text_empty_salt():
    text = "password123"
    salt = ""
    expected_hash = hashlib.sha256(text.encode()).hexdigest()
    assert hash_text(text, salt) == expected_hash

def test_hash_text_empty_both():
    text = ""
    salt = ""
    expected_hash = hashlib.sha256(b"").hexdigest()
    assert hash_text(text, salt) == expected_hash

def test_hash_text_special_characters():
    text = "p@ssw0rd!"
    salt = "$@lt#"
    expected_hash = hashlib.sha256((text + salt).encode()).hexdigest()
    assert hash_text(text, salt) == expected_hash

def test_hash_text_none_input():
    with pytest.raises(AttributeError):
        hash_text(None, "salt")

    with pytest.raises(AttributeError):
        hash_text("password123", None)

    with pytest.raises(AttributeError):
        hash_text(None, None)
