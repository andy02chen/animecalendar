from flask import request, jsonify, redirect, session, make_response, url_for
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

@app.route('/')
def checkSession():
    # Check if user session exists
    user_session_id = request.cookies.get("session")
    user_id = Auth.query.filter_by(session_id=user_session_id).first()
    
    # Redirect to Home page if the user exists
    if user_id:
        return redirect("http://localhost:5173/home")
    
    else:
        return redirect("http://localhost:5173/a")

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

# Redirect when user logs in with MAL
@app.route('/auth')
def auth():
    oauth_state = generateRandomState()
    client_id = os.getenv('CLIENT_ID')
    code_challenge = generateCodeChallenge()

    # new_user = User()
    # db.session.add(new_user)
    # db.session.commit()

    # session["user_id"] = new_user.user_id

    session["session_id"] = session.sid
    new_user_auth = Auth(session_id=session.sid, oauth_state=oauth_state, code_challenge=code_challenge)
    db.session.add(new_user_auth)
    db.session.commit()

    # new_user = User(oauth_state=oauth_state, code_challenge=code_challenge)
    # db.session.add(new_user)
    # db.session.commit()


    auth_url = f"https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={client_id}&state={oauth_state}&redirect_uri=http://localhost:5173/oauth/callback&code_challenge={code_challenge}&code_challenge_method=plain"
    return redirect(auth_url)

# Redirect from OAuth
@app.route('/oauth/callback')
def oauth():

    # Gets session from cookie
    user_session_id = request.cookies.get("session")
    user = Auth.query.filter_by(session_id=user_session_id).first()

    returned_state = request.args.get('state')

    # Verifies state is same
    if returned_state == user.oauth_state:
        
        # Post Request for access tokens
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

        # If OK stores in database and redirects user to home page
        if response.status_code == 200:
            token_data = response.json()

            # Get user information
            mal_get_me = 'https://api.myanimelist.net/v2/users/@me'
            mal_access_token = token_data["access_token"]
            headers = {
                'Authorization': f'Bearer {mal_access_token}'
            }
            response = requests.get(mal_get_me, headers=headers)

            # Check if the request was successful
            if response.status_code == 200:

                # Check if the user already exist in the database
                user_data = response.json()
                user_username = user_data['name']

                # Delete existing session
                session_to_delete = Auth.query.filter_by(user_id=user_username).first()
                if(session_to_delete):
                    db.session.delete(session_to_delete)
                    db.session.commit()

                    # Update existing user
                    existing_user = User.query.filter_by(user_id=user_username).first()
                    existing_user.access_token = mal_access_token
                    existing_user.refresh_token = token_data["refresh_token"]
                    existing_user.expires_in = token_data["expires_in"]
                
                else:
                    # Store new user data
                    new_user = User(user_id=user_username,access_token=mal_access_token,refresh_token=token_data["refresh_token"],expires_in=str(token_data['expires_in']))
                    db.session.add(new_user)

                auth_to_update = Auth.query.filter_by(session_id=user_session_id).first()
                auth_to_update.user_id = user_username
                db.session.add(auth_to_update)
                db.session.commit()

            else:
                return jsonify({'error': 'Failed to fetch data from external API'}), response.status_code

            return make_response(redirect('/home'))
        else:
            return jsonify({'error': 'Failed to get token', 'status_code': response.status_code, 'response': response.text})

    else:
        return "State did not match. Please Try again or something idk"

if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
    
    app.run(debug=True,port=5000)