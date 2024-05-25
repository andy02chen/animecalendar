from flask import request, jsonify, redirect, session
from config import app, db
from flask_session import Session
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests
from models import db, User

load_dotenv()

# Generates a random state
def generateRandomState(length = 32):
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    result = ''
    length_chars = len(chars)
    for i in range(length):
        result += chars[randrange(length_chars)]

    print(len(result))
    return result

# Generates code challenge and code verifier
def generateCodeChallenge(length = 128):
    result = ''
    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    length_chars = len(charset)

    for i in range(length):
        result += charset[randrange(length_chars)]    

    return result

# Get the client id
@app.route('/api/client-id', methods=["GET"])
def getClientID():
    return jsonify({"clientId": os.getenv('CLIENT_ID')})

@app.route('/auth')
def auth():
    oauth_state = generateRandomState()
    client_id = os.getenv('CLIENT_ID')
    code_challenge = generateCodeChallenge()

    new_user = User(oauth_state=oauth_state, code_challenge=code_challenge)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.user_id

    auth_url = f"https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={client_id}&state={oauth_state}&redirect_uri=http://localhost:5173/oauth/callback&code_challenge={code_challenge}&code_challenge_method=plain"
    return redirect(auth_url)

@app.route('/oauth/callback')
def oauth():
    authorization_code = request.args.get('code')
    returned_state = request.args.get('state')

    user = User.query.filter_by(user_id=session.get("user_id")).first()

    print(user.code_challenge)
    print(user.oauth_state)
    print(returned_state)
    print(returned_state == user.oauth_state)

    return user.oauth_state

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
    
    app.run(debug=True,port=5000)