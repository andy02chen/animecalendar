from config import db
from uuid import uuid4

def get_uid():
    return uuid4().hex

class Auth(db.Model):
    user_id = db.Column(db.String(), db.ForeignKey('user.user_id'), nullable=True)
    user = db.relationship('User', backref='auth', uselist=False)
    session_id = db.Column(db.String(), db.ForeignKey('sessions.session_id'), unique=True)
    oauth_state = db.Column(db.String(), nullable=False, unique=True, primary_key=True)
    code_challenge = db.Column(db.BLOB(), nullable=False)

class User(db.Model):
    user_id = db.Column(db.String(), primary_key=True, nullable=False)
    access_token = db.Column(db.BLOB())
    refresh_token = db.Column(db.BLOB())
    expires_in = db.Column(db.Integer())