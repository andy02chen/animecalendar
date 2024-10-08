from config import db
from uuid import uuid4
import time

def clear_table():
    db.session.query(Auth).delete()
    db.session.query(RateLimit).delete()
    db.session.commit()

class Auth(db.Model):
    session_id = db.Column(db.String(), unique=True)
    oauth_state = db.Column(db.String(), nullable=False, unique=True, primary_key=True)
    code_challenge = db.Column(db.BLOB(), nullable=False)
    state_salt = db.Column(db.String(32), nullable=False)

class User(db.Model):
    user_id = db.Column(db.String(), primary_key=True, nullable=False)
    pfp = db.Column(db.String(), nullable=True)
    access_token = db.Column(db.BLOB())
    refresh_token = db.Column(db.BLOB())
    expires_in = db.Column(db.Integer())
    session_id = db.Column(db.String(), unique=True)

class RateLimit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ip = db.Column(db.String(), nullable=False)
    endpoint = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.Integer, default=int(time.time()))