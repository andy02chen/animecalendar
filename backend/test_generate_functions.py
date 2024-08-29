import pytest
from main import generateRandomState, generateCodeChallenge

def test_generateRandomState_length():
    result = generateRandomState()
    assert len(result) == 32

def test_generateRandomState_characters():
    result = generateRandomState()
    valid_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    assert all(c in valid_chars for c in result)

def test_generateCodeChallenge_length():
    result = generateCodeChallenge()
    assert len(result) == 128

def test_generateCodeChallenge_characters():
    result = generateCodeChallenge()
    valid_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    assert all(c in valid_chars for c in result)
