from flask import request, jsonify, redirect, session, make_response
from config import app, db
from flask_session import Session
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests
from models import db, User, Auth
import urllib.parse
import base64

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

@app.route('/auth')
def auth():
    oauth_state = generateRandomState()
    client_id = os.getenv('CLIENT_ID')
    code_challenge = generateCodeChallenge()

    new_user = User()
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.user_id
    
    new_user_auth = Auth(user_id=new_user.user_id,session_id=session.sid, oauth_state=oauth_state, code_challenge=code_challenge)
    db.session.add_all([new_user, new_user_auth])
    db.session.commit()

    # new_user = User(oauth_state=oauth_state, code_challenge=code_challenge)
    # db.session.add(new_user)
    # db.session.commit()

    

    auth_url = f"https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={client_id}&state={oauth_state}&redirect_uri=http://localhost:5173/oauth/callback&code_challenge={code_challenge}&code_challenge_method=plain"
    return redirect(auth_url)

@app.route('/oauth/callback')
def oauth():
    user = Auth.query.filter_by(user_id=session.get("user_id")).first()
    returned_state = request.args.get('state')

    if returned_state == user.oauth_state:
        
        client_id = os.getenv("CLIENT_ID")
        client_secret = os.getenv("CLIENT_SECRET")
        code_verifier = user.code_challenge
        authorization_code = request.args.get('code')

        url = 'https://myanimelist.net/v1/oauth2/token'
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = {
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': 'http://localhost:5173/oauth/callback',
            'code_verifier': code_verifier
        }

        response = requests.post(url, headers=headers, data=data)

        if response.status_code == 200:
            data = response.json()
            # print(data["access_token"])
            # print(data["refresh_token"])
            # print(data["expires_in"])
            response = make_response(redirect('/home'))
            # response.set_cookie('access_token', data["access_token"], httponly=True, secure=True)
            # response.set_cookie('refresh_token', data["refresh_token"], httponly=True, secure=True)
            # response.set_cookie('expires_in', str(data["expires_in"]), httponly=True, secure=True)
            return response
            # return jsonify(data)
        else:
            return jsonify({'error': 'Failed to get token', 'status_code': response.status_code, 'response': response.text})

    else:
        # return error message
        return "State did not match. Please Try again or something idk"

if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
    
    app.run(debug=True,port=5000)