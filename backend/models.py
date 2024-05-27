from config import db
from uuid import uuid4

def get_uid():
    return uuid4().hex

# class User(db.Model):
#     user_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uid)
#     oauth_state = db.Column(db.String(32), nullable=False)
#     code_challenge = db.Column(db.String(128), nullable=False)
class Auth(db.Model):
    user_id = db.Column(db.String(32), db.ForeignKey('user.user_id'), primary_key=True)
    user = db.relationship('User', backref='auth', uselist=False)
    session_id = db.Column(db.Integer(), db.ForeignKey('sessions.session_id'), unique=True)
    oauth_state = db.Column(db.String(32), nullable=False)
    code_challenge = db.Column(db.String(128), nullable=False)

class User(db.Model):
    user_id = db.Column(db.String(32), primary_key=True, default=get_uid)
    access_token = db.Column(db.String())
    refresh_token = db.Column(db.String())
    expires_in = db.Column(db.String())