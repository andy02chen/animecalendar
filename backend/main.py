from flask import request, jsonify, redirect, session, make_response, url_for
from cryptography.fernet import Fernet
from config import app, db
from flask_session import Session
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests
from models import db, User, Auth, RateLimit
import urllib.parse
import base64
import time
import hashlib
import uuid

load_dotenv()

encryption_key = os.getenv("ENC_KEY").encode()
session_salt = os.getenv("SESSION_SALT")
ip_salt = os.getenv("IP_SALT")
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

cipher_suite = Fernet(encryption_key)

# Function for deleting user from the database
@app.route('/api/delete-user', methods=["DELETE"])
def delete_user():
    session_id = request.cookies.get("session")
    found_user = User.query.filter_by(session_id=hash_text(session_id, session_salt)).first()

    db.session.delete(found_user)
    db.session.commit()

    return jsonify({"redirect_url": "/"}), 200


# Function for checking expiry time
# Calls function for refreshing if expired
def is_expired():
    # Get user using session id
    session_id = request.cookies.get("session")
    found_user = User.query.filter_by(session_id=hash_text(session_id, session_salt)).first()

    # Check if it has expired
    curr_time = int(time.time())

    # Refresh if expired
    if curr_time >= found_user.expires_in:
        result = refreshUsersTokens()
        _, code = result

        if code == 201:
            return True

    return False

@app.route('/test', methods=["GET"])
def test():
    is_expired()

    return 'a'

# Function for checking if rate limited
def is_rate_limited(ip, endpoint, limit, period):
    period_start = int(time.time()) - period
    recent_requests = RateLimit.query.filter_by(ip=hash_text(ip, ip_salt), endpoint=endpoint).filter(RateLimit.timestamp > period_start).count()
    return recent_requests >= limit

# Function checks to ensure that the user is allowed to visited route
@app.route('/api/check-login', methods=["GET"])
def protectedRoute():
    if is_rate_limited(request.remote_addr, request.endpoint, limit=20, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    new_request = RateLimit(ip=hash_text(request.remote_addr, ip_salt), endpoint=request.endpoint)
    db.session.add(new_request)
    db.session.commit()

    user_session_id = request.cookies.get('session')

    if user_session_id:
        find_user = User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()

        if find_user:
            return jsonify({'loggedIn':True})

        return jsonify({'loggedIn':False})
    
    return jsonify({'loggedIn':False})

# Endpoint for refreshing the user's access token
@app.route('/api/refresh-token', methods=["PUT"])
def refreshUsersTokens():
    user_session_id = request.cookies.get('session')

    if user_session_id:
        find_user = User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()

        if find_user:
            user_auth_username = find_user.user_id
            user_to_refresh = User.query.filter_by(user_id=user_auth_username).first()

            if refreshTokens(user_to_refresh):
                return '', 204

            else:
                return 'Error from MAL server, Please try logging in again later.', 403

        return 'Error finding your username, Please try logging in again.', 401

    return 'Error verifying your login, Please try logging in again.', 401

def hash_text(text, salt):
    return hashlib.sha256(text.encode() + salt.encode()).hexdigest()

# Function for refreshing
def refreshTokens(user_to_refresh):
    # Refresh the access token
    url = 'https://myanimelist.net/v1/oauth2/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'refresh_token',
        'refresh_token':cipher_suite.decrypt(user_to_refresh.refresh_token.decode())
    }
    
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        token_data = response.json()

        token_expiration_time = int(time.time()) + int(token_data["expires_in"])
        user_to_refresh.access_token = cipher_suite.encrypt(token_data["access_token"].encode())
        user_to_refresh.refresh_token = cipher_suite.encrypt(token_data["refresh_token"].encode())
        user_to_refresh.expires_in = token_expiration_time
        db.session.commit()

        return True

@app.route('/')
def checkSession():
    # Check if user session exists
    user_session_id = request.cookies.get("session")

    if user_session_id:
        user_id = User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()
        
        # Refresh access and refresh token if the user already exists before redirecting to home page
        if user_id:
            # Get user id using session id
            user_auth_username = user_id.user_id

            # Get refresh token using user id
            user_to_refresh = User.query.filter_by(user_id=user_auth_username).first()

            if refreshTokens(user_to_refresh):
                return redirect("http://localhost:5173/home")

            else:
                return "Error with refreshing token"

        else:
            response = redirect("http://localhost:5173/a")
            response.set_cookie('session', '', expires=0)
            return response
        
    # Login the user for the first time
    else:
        return redirect("http://localhost:5173/a")

# Generates a random state
def generateRandomState(length = 32):
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    result = ''
    length_chars = len(chars)
    for i in range(length):
        result += chars[randrange(length_chars)]

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
    user_session_id = request.cookies.get("session")

    if user_session_id:
        # Check if session id is assigned to user
        user = User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()

        if user:
            return redirect("http://localhost:5173/home")

        # Delete cookie if not present
        response = redirect("http://localhost:5173/")
        response.set_cookie('session', '', expires=0)
        return response

    oauth_state = generateRandomState()
    code_challenge = generateCodeChallenge()

    # Hashes State and Encrypts code challenge before storing
    salt = uuid.uuid4().hex
    new_user_auth = Auth(oauth_state=hash_text(oauth_state, salt), code_challenge=cipher_suite.encrypt(code_challenge.encode()), session_id=hash_text(session.sid,session_salt), state_salt=salt)
    db.session.add(new_user_auth)

    db.session.commit()

    auth_url = f"https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={client_id}&state={oauth_state}&redirect_uri=http://localhost:5173/oauth/callback&code_challenge={code_challenge}&code_challenge_method=plain"
    
    response = redirect(auth_url)
    response.set_cookie('session', session.sid)
    return response

# Redirect from OAuth
@app.route('/oauth/callback')
def oauth():

    # Compare hashed state
    returned_state = request.args.get('state')
    authorization_code = request.args.get('code')

    if returned_state and authorization_code:
        session_id = request.cookies.get('session')
        find_auth = Auth.query.filter_by(session_id=hash_text(session_id, session_salt)).first()
        auth_salt = find_auth.state_salt
        find_auth_state = find_auth.oauth_state

        if find_auth_state == hash_text(returned_state, auth_salt):
            # Post Request for access tokens
            code_verifier = cipher_suite.decrypt(find_auth.code_challenge)
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
                    # Stores expiration time in Unix
                    token_expiration_time = int(time.time()) + int(token_data["expires_in"])

                    # Check if the user already exist in the database
                    user_data = response.json()
                    user_username = user_data['name']

                    # Check if user already exists
                    find_user = User.query.filter_by(user_id=user_username).first()

                    if find_user:
                        find_user.access_token = cipher_suite.encrypt(mal_access_token.encode())
                        find_user.refresh_token = cipher_suite.encrypt(token_data["refresh_token"].encode())
                        find_user.expires_in = token_expiration_time
                        find_user.session_id = hash_text(session_id,session_salt)

                    else:
                        # Store new user data
                        new_user = User(user_id=user_username,access_token=cipher_suite.encrypt(mal_access_token.encode()),
                                        refresh_token=cipher_suite.encrypt(token_data["refresh_token"].encode()),
                                        expires_in=token_expiration_time,session_id=hash_text(session_id,session_salt))
                        db.session.add(new_user)
                    
                    db.session.commit()

                else:
                    return jsonify({'error': 'Failed to fetch data from external API'}), response.status_code

            else:
                return jsonify({'error': 'Failed to fetch data from external API'}), response.status_code
            
            resp = make_response(redirect('/home'))
            return resp

        else:
            return "State did not match. Please Try again or something idk"

    return redirect('/')

if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
    
    app.run(debug=True,port=5000)