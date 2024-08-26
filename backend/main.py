from flask import request, jsonify, redirect, session, make_response, url_for, render_template_string
from cryptography.fernet import Fernet
from config import app, db
from flask_session import Session
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests
from models import db, User, Auth, RateLimit
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

# Function for getting session cookie
def get_session_id():
    return request.cookies.get('session')

def find_user_function(user_session_id):
    return User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()

# Function for updating the number of episodes watched on MyAnimeList
@app.route('/api/update-anime', methods=["POST"])
def updateStatus():
    # Check limit
    if is_rate_limited(request.remote_addr, request.endpoint, limit=10, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    # Find user using session id
    user_session_id = get_session_id()
    if user_session_id:
        find_user = find_user_function(user_session_id)
        if find_user:
            msg, code = check_expiry()

            # Login again
            if code == 401 or code == 403:
                return msg, code

            data = request.get_json()

            if 'anime-id' not in data:
                return '', 400

            anime_id = data['anime-id']

            if 'eps-watched' not in data:
                return '', 400
            eps_watched = int(data['eps-watched']) + 1

            mal_update_anime = f'https://api.myanimelist.net/v2/anime/{anime_id}/my_list_status'

            get_user_access_token = cipher_suite.decrypt(find_user.access_token)
            if not get_user_access_token:
                return '', 401

            mal_access_token = get_user_access_token.decode()
            headers = {
                'Authorization': f'Bearer {mal_access_token}'
            }

            if 'completed' not in data:
                return '', 400

            body = {}
            # If Completed
            if data['completed']:
                if 'score' in data:
                    body = {
                        'score': data['score'],
                        "num_watched_episodes": eps_watched,
                        "status" : "completed"
                    }

                else:
                    body = {
                        "num_watched_episodes": eps_watched,
                        "status" : "completed"
                    }

            # Update progress
            else:
                body = {
                    "num_watched_episodes": eps_watched,
                    "status" : "watching"
                }

            response = requests.patch(mal_update_anime, headers=headers, data=body)
            
            if response.status_code == 200:
                return '', 200

            else:
                return 'There was an error updating on MAL servers. Please try again later.', 502

        return '', 401
    
    return '', 400


# Function for deleting user from the database
@app.route('/api/logout', methods=["DELETE"])
def delete_user_session():
    # Check limit
    if is_rate_limited(request.remote_addr, request.endpoint, limit=5, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    session_id = get_session_id()

    if session_id:
        if session_id == 'guest':
            return jsonify({"redirect_url": "/"}), 200

        found_user = find_user_function(session_id)

        if found_user:
            found_user.session_id = None
            db.session.commit()

            return jsonify({"redirect_url": "/"}), 200

        return jsonify({"redirect_url": "/"}), 401

    return jsonify({"redirect_url": "/"}), 401

# Function for checking expiry time
# Calls function for refreshing if expired
def check_expiry():
    # Get user using session id
    session_id = get_session_id()

    if not session_id:
        return '', 401

    found_user = find_user_function(session_id)

    if not found_user:
        return '', 401

    # Check if it has expired
    curr_time = int(time.time())

    # Refresh if expired
    if curr_time >= found_user.expires_in:
        return refreshUsersTokens()

    return '',100

# Function for checking if rate limited
def is_rate_limited(ip, endpoint, limit, period):
    period_start = int(time.time()) - period
    recent_requests = RateLimit.query.filter_by(ip=hash_text(ip, ip_salt), endpoint=endpoint).filter(RateLimit.timestamp > period_start).count()
    new_request = RateLimit(ip=hash_text(ip, ip_salt), endpoint=endpoint)
    db.session.add(new_request)
    db.session.commit()
    return recent_requests >= limit

# Function for filtering plan to watch anime
def filter_plan_to_watch_anime(data):
    data_to_return = []

    if 'data' not in data:
        return []

    for anime in data['data']:
        details = {}

        if 'node' not in anime:
            continue

        if 'title' not in anime['node']:
            continue
        details['title'] = anime['node']['title']

        if 'id' not in anime['node']:
            continue
        details['id'] = anime['node']['id']

        if 'main_picture' in anime['node']:
            if 'medium' in anime['node']['main_picture']:
                details['img'] = anime['node']['main_picture']['medium']

            else:
                details['img'] = None

        else:
            details['img'] = None

        if 'status' not in anime['node']:
            continue
        
        details['air_status'] = anime['node']['status']

        # Get anime season
        if 'start_season' in anime['node']:
            details['season'] = anime['node']['start_season']['season'],str(anime['node']['start_season']['year'])

        else:
            details['season'] = None

        # Get anime start date
        if 'start_date' in anime['node']:
            details['start_date'] = anime['node']['start_date']

        else:
            details['start_date'] = None

        if 'broadcast' in anime['node']:
            if 'start_time' in anime['node']['broadcast']:
                details['broadcast_time'] = anime['node']['broadcast']['start_time']

            else:
                details['broadcast_time'] = None

        else:
            details['broadcast_time'] = None
        
        data_to_return.append(details)

    return data_to_return

# Function gets user's plan to watch list
@app.route('/api/get-plan-to-watch', methods=["GET"])
def plan_to_watch():
    # Check limit
    if is_rate_limited(request.remote_addr, request.endpoint, limit=20, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    # Find user using session id
    user_session_id = get_session_id()
    if user_session_id:
        if user_session_id == "guest":
            mal_get_anime = '''https://api.myanimelist.net/v2/users/ZNEAK300/animelist?status=plan_to_watch&
            sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast,start_season&nsfw=true
            &limit=1000'''
            headers = {
                'X-MAL-CLIENT-ID': f'{client_id}'
            }

            response = requests.get(mal_get_anime, headers=headers)

            if response.status_code == 200:
                data = filter_plan_to_watch_anime(response.json())
                data_to_return = {'plan_to_watch': data}
                return data_to_return

            return 'Unable to get plan to watch anime from MAL',500

        find_user = find_user_function(user_session_id)

        if find_user:
            msg, code = check_expiry()

            # Login again
            if code == 401 or code == 403:
                return msg, code
            

            mal_get_anime = '''https://api.myanimelist.net/v2/users/@me/animelist?status=plan_to_watch&
            sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast,start_season&nsfw=true
            &limit=1000'''

            get_user_access_token = cipher_suite.decrypt(find_user.access_token)
            if not get_user_access_token:
                return 'Unknown Error occured. Please try again or re-log.',500

            mal_access_token = get_user_access_token.decode()

            headers = {
                'Authorization': f'Bearer {mal_access_token}'
            }

            response = requests.get(mal_get_anime, headers=headers)

            if response.status_code == 200:
                data = response.json()
                data_to_return = {'plan_to_watch':filter_plan_to_watch_anime(data)}
                return data_to_return

            return 'Unable to get plan to watch anime from MAL',500

        # User not found
        response = redirect("/")
        response.set_cookie('session', '', expires=0)
        return response

    # User not logged in
    return redirect('/')

# Function for filtering user's currently watching anime
def filter_watching_anime(data):
    data_to_return = []

    if 'data' not in data:
        return []

    for anime in data['data']:
        details = {}

        if 'node' not in anime:
            continue

        if 'title' not in anime['node']:
            continue
        details['title'] = anime['node']['title']

        if 'id' not in anime['node']:
            continue
        details['id'] = anime['node']['id']

        if 'start_date' in anime['node']:
            details['start_date'] = anime['node']['start_date']

        else:
            details['start_date'] = None

        if 'main_picture' in anime['node']:
            if 'medium' in anime['node']['main_picture']:
                details['img'] = anime['node']['main_picture']['medium']

            else:
                details['img'] = None

        else:
            details['img'] = None

        if 'list_status' not in anime:
            continue
        if 'num_episodes_watched' not in anime['list_status']:
            continue

        details['eps_watched'] = anime['list_status']['num_episodes_watched']

        if 'num_episodes' in anime['node']:
            details['eps'] = anime['node']['num_episodes']

        else:
            details['eps'] = 0

        if 'broadcast' in anime['node']:
            if 'start_time' in anime['node']['broadcast']:
                details['broadcast_time'] = anime['node']['broadcast']['start_time']

            else:
                details['broadcast_time'] = None

        else:
            details['broadcast_time'] = None

        details['delayed_eps'] = 0

        if 'status' not in anime['node']:
            continue
        details['air_status'] = anime['node']['status']

        if 'end_date' in anime['node']:
            details['end_date'] = anime['node']['end_date']

        else:
            details['end_date'] = None

        details['eps_array'] = []
        data_to_return.append(details)

    return data_to_return

# Functions gets user's weekly watching anime
@app.route('/api/get-weekly-anime', methods=["GET"])
def weekly_anime():
    # Check limit
    if is_rate_limited(request.remote_addr, request.endpoint, limit=20, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    # Find user using session id
    user_session_id = get_session_id()

    if user_session_id:
        if user_session_id == 'guest':
            mal_get_anime = '''https://api.myanimelist.net/v2/users/ZNEAK300/animelist?status=watching&
            sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast&nsfw=true'''
            headers = {
                'X-MAL-CLIENT-ID': f'{client_id}'
            }

            response = requests.get(mal_get_anime, headers=headers)

            if response.status_code == 200:
                data = filter_watching_anime(response.json())
                data_to_return = {'anime': data}
                return data_to_return

            return 'Unable to get anime watchlist from MAL',500

        find_user = find_user_function(user_session_id)

        if find_user:
            msg, code = check_expiry()

            # Login again
            if code == 401 or code == 403:
                return msg, code
            
            mal_get_anime = '''https://api.myanimelist.net/v2/users/@me/animelist?status=watching&
            sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast&nsfw=true'''
            user_token = cipher_suite.decrypt(find_user.access_token)
            mal_access_token = user_token.decode()
            headers = {
                'Authorization': f'Bearer {mal_access_token}'
            }

            response = requests.get(mal_get_anime, headers=headers)
            
            if response.status_code == 200:
                data = filter_watching_anime(response.json())
                data_to_return = {'anime': data}
                return data_to_return

            return 'Unable to get anime watchlist from MAL',500

        # User not found
        response = redirect("/")
        response.set_cookie('session', '', expires=0)
        return response

    # User not logged in
    return redirect('/')

# TODO write test for this onwards
# Function checks to ensure that the user is allowed to visited route
@app.route('/api/check-login', methods=["GET"])
def protectedRoute():
    if is_rate_limited(request.remote_addr, request.endpoint, limit=20, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    user_session_id = get_session_id()

    if user_session_id:
        if user_session_id == "guest":
            return jsonify({
                'loggedIn':True,
                'username': 'Guest',
                'picture': None
            })

        find_user = find_user_function(user_session_id)

        if find_user:
            return jsonify({
                'loggedIn':True,
                'username': find_user.user_id,
                'picture': find_user.pfp
            })

        return jsonify({'loggedIn':False})
    
    return jsonify({'loggedIn':False})

# Endpoint for refreshing the user's access token
@app.route('/api/refresh-token', methods=["PUT"])
def refreshUsersTokens():
    # Check limit
    if is_rate_limited(request.remote_addr, request.endpoint, limit=2, period=60):
        return jsonify({"error": "rate limit exceeded"}), 429

    user_session_id = request.cookies.get('session')

    if user_session_id:
        if user_session_id == "guest":
            return '', 204

        find_user = User.query.filter_by(session_id=hash_text(user_session_id,session_salt)).first()

        if find_user:
            user_auth_username = find_user.user_id
            user_to_refresh = User.query.filter_by(user_id=user_auth_username).first()

            if refreshTokens(user_to_refresh):
                return '', 204

            else:
                return 'There was an error from MAL servers. Please try logging in again later. If this error persists, please report bug.', 403

        return '', 401

    return '', 401

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
        'refresh_token':cipher_suite.decrypt(user_to_refresh.refresh_token).decode()
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
    
    return False

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
                return redirect("/home")

            else:
                return "Error with refreshing token"

        else:
            response = redirect("/a")
            response.set_cookie('session', '', expires=0)
            return response
        
    # Login the user for the first time
    else:
        return redirect("/a")

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
            return redirect("/home")

        # Delete cookie
        response = redirect("/")
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
            code_verifier = cipher_suite.decrypt(find_auth.code_challenge).decode()
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
                    user_image = None

                    if 'picture' in user_data:
                        user_image = user_data['picture']

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
                                        expires_in=token_expiration_time,session_id=hash_text(session_id,session_salt),
                                        pfp=user_image)
                        db.session.add(new_user)
                    
                    # Remove row from auth DB
                    db.session.delete(find_auth)

                    db.session.commit()

                else:
                    return render_template_string('''
                        <html>
                            <head>
                                <script type="text/javascript">
                                    localStorage.setItem('errorMsgDiv', '1');
                                    window.location.href = "/a";
                                </script>
                            </head>
                            <body>
                                <h1>Redirecting...</h1>
                            </body>
                        </html>
                    ''')

            else:
                return render_template_string('''
                    <html>
                        <head>
                            <script type="text/javascript">
                                localStorage.setItem('errorMsgDiv', '1');
                                window.location.href = "/a";
                            </script>
                        </head>
                        <body>
                            <h1>Redirecting...</h1>
                        </body>
                    </html>
                ''')
            
            resp = make_response(redirect('/home'))
            return resp

        else:
            return render_template_string('''
                    <html>
                        <head>
                            <script type="text/javascript">
                                localStorage.setItem('errorMsgDiv', '2');
                                window.location.href = "/a";
                            </script>
                        </head>
                        <body>
                            <h1>Redirecting...</h1>
                        </body>
                    </html>
                ''')

    return redirect('/')

# Guest page
@app.route('/guest')
def guestLogin():
    response = redirect('/home')
    response.set_cookie('session', "guest")
    return response

if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
    
    app.run(debug=True,port=5000)