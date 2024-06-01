from config import db
from uuid import uuid4

def get_uid():
    return uuid4().hex

class Auth(db.Model):
    user_id = db.Column(db.String(), db.ForeignKey('user.user_id'), nullable=True)
    user = db.relationship('User', backref='auth', uselist=False)
    session_id = db.Column(db.String(), db.ForeignKey('sessions.session_id'), unique=True, primary_key=True)
    oauth_state = db.Column(db.String(32), nullable=False)
    code_challenge = db.Column(db.String(128), nullable=False)

class User(db.Model):
    user_id = db.Column(db.String(), primary_key=True, nullable=False)
    access_token = db.Column(db.String())
    refresh_token = db.Column(db.String())
    expires_in = db.Column(db.String())