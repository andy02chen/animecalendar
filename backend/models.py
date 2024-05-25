from config import db
from uuid import uuid4

def get_uid():
    return uuid4().hex

class User(db.Model):
    user_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uid)
    oauth_state = db.Column(db.String(32), nullable=False)
    code_challenge = db.Column(db.String(128), nullable=False)