from flask import request, jsonify, redirect, session, make_response, url_for, render_template_string, send_from_directory, render_template, abort, send_file
from cryptography.fernet import Fernet
from config import app, db
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests
from models import db, User, Auth, RateLimit, clear_table
import base64
import time
import hashlib
import uuid
import secrets
import string
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import logging
from logging.handlers import RotatingFileHandler
import pandas as pd
from pandas import json_normalize
import json
import numpy as np

load_dotenv()

encryption_key = os.getenv("ENC_KEY").encode()
session_salt = os.getenv("SESSION_SALT")
ip_salt = os.getenv("IP_SALT")
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
API_URL = os.getenv("API_URL")

cipher_suite = Fernet(encryption_key)

def setup_logging():
    #DEBUG
    #INFO
    #WARNING
    #ERROR
    #CRITICAL
    if not app.debug:
        handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=3)
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]'
        )
        handler.setFormatter(formatter)
        app.logger.addHandler(handler)

setup_logging()

# For clearing tables
scheduler = BackgroundScheduler()

def clear_table_job():
    with app.app_context():
        clear_table()

scheduler.add_job(
    func=clear_table_job,
    trigger=IntervalTrigger(minutes=30),
    id='clear_table_job',
    name='Clear table every 30 minutes',
    replace_existing=True
)

scheduler.start()


# TODO uncomment for main push/merge
# React Router should be doing this
# @app.route('/a')
# @app.route('/home')
# def serve_react_pages():
#     try:
#         return render_template('index.html')
#         # return redirect("https://localhost:5173", code=302)
#     except Exception:
#         app.logger.error('Unable to load home page.')
#         abort(500, description="Internal Server Error: Unable to load the page. Please try again and report issue if it reoccurs.")

# Get Logo Image
@app.route('/api/logo', methods=["GET"])
def get_logo():
    image_path = os.path.join('logo.png')

    if os.path.exists(image_path):
        # Send the image file
        return send_file(image_path, mimetype='image/png')
    else:
        # If the file doesn't exist, return a 404 error
        abort(404)

# Function for getting session cookie
def get_session_id():
    return request.cookies.get('session')

def find_user_function(user_session_id):
    try:
        hashed_session = hash_text(user_session_id,session_salt)
        return User.query.filter_by(session_id=hashed_session).first()
    except Exception:
        app.logger.critical('Unable to query database to find user')
        return None

# Function for updating the number of episodes watched on MyAnimeList
@app.route('/api/update-anime', methods=["POST"])
def updateStatus():
    try:
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
                if code in (401,403):
                    return msg, code

                data = request.get_json()

                if not data or 'anime-id' not in data or 'eps-watched' not in data or 'completed' not in data:
                    app.logger.warning('Invalid request data for updating anime')
                    return 'Invalid request data for updating anime', 400

                anime_id = data['anime-id']
                eps_watched = int(data['eps-watched'])

                mal_update_anime = f'https://api.myanimelist.net/v2/anime/{anime_id}/my_list_status'

                get_user_access_token = None
                try:
                    get_user_access_token = cipher_suite.decrypt(find_user.access_token)
                except Exception as e:
                    app.logger.error(f"Decryption error: {e}")
                    return '', 401

                if not get_user_access_token:
                    return '',401

                mal_access_token = get_user_access_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

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
                    app.logger.error(f"Unexpected response data in updateStatus: {response}")
                    return 'There was an error updating on MAL servers. Please try again later.', 502
                
            return '', 401
        
        return '', 400
    
    except Exception as e:
        app.logger.error(f"Unexpected error in updateStatus: {e}")
        return "An error has prevented the server from fulfilling this request. Pleaase try again later or report this bug", 500


# Function for deleting user from the database
@app.route('/api/logout', methods=["DELETE"])
def delete_user_session():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=5, period=60):
            response = jsonify({"error": "rate limit exceeded"})
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response, 429

        session_id = get_session_id()

        if session_id:
            if session_id == 'guest':
                return jsonify({"redirect_url": "/"}), 200

            found_user = find_user_function(session_id)

            if found_user:
                found_user.session_id = None
                try:
                    db.session.commit()
                except Exception as e:
                    app.logger.error(f"Database commit error: {e}")
                    db.session.rollback()
                    return jsonify({"redirect_url": "/"}), 200


                return jsonify({"redirect_url": "/"}), 200

            response = jsonify({"redirect_url": "/"})
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response, 401

        response = jsonify({"redirect_url": "/"})
        response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
        return response, 401
    
    except Exception as e:
        app.logger.error(f"Unexpected error in delete_user_session: {e}")
        return jsonify({"redirect_url": "/"}), 200

# Function for checking expiry time
# Calls function for refreshing if expired
def check_expiry():
    try:
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
            try:
                return refreshUsersTokens()
            except Exception as e:
                app.logger.error(f"Token refresh error: {e}")
                return '', 401

        return '',100

    except Exception as e:
        app.logger.error(f"Unexpected error in check_expiry: {e}")
        return '', 401

# Function for checking if rate limited
def is_rate_limited(ip, endpoint, limit, period):
    try:
        if not ip or not ip_salt:
            return False

        period_start = int(time.time()) - period
        recent_requests = RateLimit.query.filter_by(ip=hash_text(ip, ip_salt), endpoint=endpoint).filter(RateLimit.timestamp > period_start).count()

        if recent_requests >= limit:
            return True

        new_request = RateLimit(ip=hash_text(ip, ip_salt), endpoint=endpoint)
        db.session.add(new_request)
        db.session.commit()

        return False

    except Exception as e:
        app.logger.error(f"Rate limit check error: {e}")
        return True

# Function for filtering plan to watch anime
def filter_plan_to_watch_anime(data):
    data_to_return = []

    if 'data' not in data:
        app.logger.warning("No data found in")
        return []

    for anime in data['data']:
        details = {}

        node = anime.get('node', None)
        if not node:
            continue

        if 'title' not in node or 'id' not in node or 'status' not in node:
            continue

        # Extract title and id
        details['title'] = node.get('title')
        details['id'] = node.get('id')

        # Extract image
        details['img'] = node.get('main_picture', {}).get('medium', None)

        # Extract air status
        details['air_status'] = node.get('status')

        # Extract season
        start_season = node.get('start_season', None)
        details['season'] = (start_season.get('season'), str(start_season.get('year'))) if start_season else None

        # Extract start date
        details['start_date'] = node.get('start_date', None)

        # Extract broadcast time
        broadcast = node.get('broadcast', {})
        details['broadcast_time'] = broadcast.get('start_time', None)
        details['end_date'] = node.get('end_date', None)
        details['eps'] = node.get('num_episodes', 0)

        data_to_return.append(details)

    return data_to_return

# Function gets user's plan to watch list
@app.route('/api/get-plan-to-watch', methods=["GET"])
def plan_to_watch():
    try:
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

                else:
                    app.logger.error("Error fetching plan to watch as guest")
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
                else:
                    app.logger.error("Error fetching plan to watch for authenticated user in plan_to_watch")
                    return 'Unable to get plan to watch anime from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in plan_to_watch function: {e}")
        return 'Unable to get plan to watch anime from MAL. Please report issue if it continues happening.', 500

# Function for filtering user's currently watching anime
def filter_watching_anime(data):
    data_to_return = []

    if 'data' not in data:
        return []

    for anime in data['data']:
        details = {}

        node = anime.get('node', None)
        if not node:
            continue

        if 'title' not in node or 'id' not in node or 'status' not in node:
            continue

        # Extract details with default values
        details['title'] = node.get('title')
        details['id'] = node.get('id')
        details['start_date'] = node.get('start_date', None)

        # Extract image
        details['img'] = node.get('main_picture', {}).get('medium', None)

        if 'list_status' not in anime:
            continue
        if 'num_episodes_watched' not in anime['list_status']:
            continue

        # Extract list status
        list_status = anime.get('list_status')
        details['eps_watched'] = list_status.get('num_episodes_watched', 0)
        details['eps'] = node.get('num_episodes', 0)

        # Extract broadcast time
        details['broadcast_time'] = node.get('broadcast', {}).get('start_time', None)

        # Set default values
        details['delayed_eps'] = 0
        details['air_status'] = node.get('status')
        details['end_date'] = node.get('end_date', None)
        details['eps_array'] = []

        # Append filtered details
        data_to_return.append(details)

    return data_to_return

# Filter user data and return JSON
def filter_user_anime_for_stats(data):
    # Sort for only completed anime
    animeList = data['data']
    completed_anime = [anime for anime in animeList if anime['node']['my_list_status']['status'] == 'completed']

    # Flatten
    df = pd.json_normalize(
        completed_anime,
        record_path=['node', 'studios'],
        meta=[
            ['node', 'id'],
            ['node', 'main_picture', 'medium'],
            ['node', 'mean'],
            ['node', 'my_list_status', 'score'],
            ['node', 'rank'],
            ['node', 'rating'],
            ['node', 'source'],
            ['node', 'start_season', 'year'],
            ['node', 'title'],
            ['node', 'genres']
        ]
    )

    # Rename col
    df['node.genres'] = df['node.genres'].apply(lambda x: ','.join([genre['name'] for genre in x]))
    df.columns = [
        'studio_id','studio_name','anime_id','img','mal_score','your_score','rank','rating','source','start_year','title','genres'
    ]

    # For finding average and most popular anime genres
    genre_df = df[['genres','your_score']].infer_objects(copy=False)
    genre_df.loc[:, 'genres'] = genre_df['genres'].str.split(',')
    genre_df = genre_df.explode('genres')

    genre_df = genre_df.groupby('genres').agg(
        total_score=('your_score', lambda x: x[x > 0].sum()),
        count=('your_score', 'size'),
        non_zero_count=('your_score', lambda x: (x > 0).sum())
    ).reset_index()

    genre_df['average'] = (genre_df['total_score'] / genre_df['non_zero_count'].replace({0: np.nan})).round(2)
    genre_df.columns = ['genre', 'total_score', 'count', 'non_zero_count', 'average']

    genre_popular = genre_df[['genre', 'count']].sort_values(by='count', ascending=False).head(10)
    genre_top_average = genre_df[['genre', 'average']].sort_values(by='average', ascending=False).head(10)

    # Find most watched ratings
    ratings_df = df[['rating']].dropna()
    ratings_df = ratings_df.groupby('rating').agg(
        count=('rating','size')
    ).reset_index()
    ratings_df = ratings_df.rename(columns={'rating': 'name', 'count': 'value'})

    # Find most watched sources
    sources_df = df[['source']].fillna('Unknown')
    sources_df = sources_df.groupby('source').agg(
        count=('source','size')
    ).reset_index()

    sources_df = sources_df.sort_values(by='count', ascending=False).head(5)

    # Get popular and highest avg rated studio
    studio_df = df[['studio_id','studio_name', 'your_score']]
    studio_df = studio_df.groupby('studio_id').agg(
        studio_name=('studio_name', 'first'),
        total_score=('your_score',lambda x: x[x > 0].sum()),
        count=('studio_id','size'),
        non_zero_count=('your_score', lambda x: (x > 0).sum()) 
    ).reset_index()

    studio_df['average'] = (studio_df['total_score'] / studio_df['non_zero_count']).round(2)
    studio_df['average'] = studio_df['average'].fillna(0)

    studio_popular = studio_df[['studio_name', 'count']].sort_values(by="count", ascending=False).head(10)
    studio_top_average = studio_df[['studio_name', 'average', 'count']].sort_values(by="average", ascending=False).head(10)

    # Get top anime by rating
    anime_df= df[['anime_id','title','your_score','mal_score']]
    top_20_anime = anime_df[['title','your_score','mal_score']].sort_values(by='your_score', ascending=False).head(20)

    # You vs MAL avg
    you_vs_mal_df = anime_df[anime_df['your_score'] > 0][['your_score','mal_score']]
    you_vs_mal_df = you_vs_mal_df.astype('float64')
    average_scores = you_vs_mal_df.mean().round(2)

    # Popular season/year
    season_year_df = df[['start_year']]
    season_year_df = season_year_df.value_counts().reset_index(name='count')
    season_year_df.columns = ['start_year', 'count']

    response_data = {
        "top_10_genres_count": genre_popular.to_dict(orient='records'),
        "top_10_genres_avg": genre_top_average.to_dict(orient='records'),
        "popular_ratings": ratings_df.to_dict(orient='records'),
        "sources": sources_df.to_dict(orient='records'),
        "top_10_studios_count": studio_popular.to_dict(orient='records'),
        "top_10_studios_avg": studio_top_average.to_dict(orient='records'),
        "top_20_anime": top_20_anime.to_dict(orient='records'),
        "average_rating": average_scores.to_dict(),
        "season_anime": season_year_df.head(3).to_dict(orient='records')
    }

    return response_data

# Get user data function
@app.route('/api/user-stats', methods=["GET"])
def userData():
    try:
        # Check limit
        # TODO CHANGE TO 1 PER 5MINS
        # if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
        if is_rate_limited(request.remote_addr, request.endpoint, limit=100, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            # TODO when guest
            if user_session_id == 'guest':
                mal_get_anime = '''https://api.myanimelist.net/v2/users/ZNEAK300/animelist?status=watching&
                sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast&nsfw=true&limit=1000'''
                headers = {
                    'X-MAL-CLIENT-ID': f'{client_id}'
                }

                response = requests.get(mal_get_anime, headers=headers)

                if response.status_code == 200:
                    data = filter_watching_anime(response.json())
                    data_to_return = {'anime': data}
                    return data_to_return

                app.logger.error("Error weekly anime as guest in weekly_anime")
                return 'Unable to get anime watchlist from MAL',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = '''
                    https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,start_season,genres,mean,rank,rating,studios,source,my_list_status&nsfw=true&limit=1000
                '''

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)
                
                if response.status_code == 200:
                    data_to_return = filter_user_anime_for_stats(response.json())
                    return jsonify(data_to_return)

                app.logger.error("Error fetching weekly anime for authenticated user in userData")
                return 'Unable to get user data from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in userData function: {e}")
        return 'Unable to get your data from MAL. Please report issue if it continues happening.', 500

# Functions gets user's weekly watching anime
@app.route('/api/get-weekly-anime', methods=["GET"])
def weekly_anime():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=20, period=60):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:
            if user_session_id == 'guest':
                mal_get_anime = '''https://api.myanimelist.net/v2/users/ZNEAK300/animelist?status=watching&
                sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast&nsfw=true&limit=1000'''
                headers = {
                    'X-MAL-CLIENT-ID': f'{client_id}'
                }

                response = requests.get(mal_get_anime, headers=headers)

                if response.status_code == 200:
                    data = filter_watching_anime(response.json())
                    data_to_return = {'anime': data}
                    return data_to_return

                app.logger.error("Error weekly anime as guest in weekly_anime")
                return 'Unable to get anime watchlist from MAL',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code
                
                mal_get_anime = '''https://api.myanimelist.net/v2/users/@me/animelist?status=watching&
                sort=anime_title&fields=start_date,end_date,status,list_status,num_episodes,broadcast&nsfw=true&limit=1000'''
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

                app.logger.error("Error fetching weekly anime for authenticated user in weekly_anime")
                return 'Unable to get anime watchlist from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in weekly_anime function: {e}")
        return 'Unable to get weekly anime from MAL. Please report issue if it continues happening.', 500

# Function checks to ensure that the user is allowed to visited route
@app.route('/api/check-login', methods=["GET"])
def protectedRoute():
    try:
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

            return jsonify({'loggedIn':False}), 400
        
        return jsonify({'loggedIn':False})

    except Exception as e:
        app.logger.error(f"Unexpected error in protectedRoute: {e}")
        return jsonify({'loggedIn':False}), 400

# Endpoint for refreshing the user's access token
@app.route('/api/refresh-token', methods=["PUT"])
def refreshUsersTokens():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=4, period=60):
            return jsonify({"error": "rate limit exceeded"}), 429

        user_session_id = get_session_id()

        if user_session_id:
            if user_session_id == "guest":
                return '', 204

            find_user = find_user_function(user_session_id)

            if find_user:
                if refreshTokens(find_user):
                    return '', 204

                else:
                    app.logger.error("Error refreshing tokens for a user")
                    return 'There was an error from MAL servers. Please try logging in again later. If this error persists, please report bug.', 403

            return '', 401

        return '', 401

    except Exception as e:
        app.logger.error("Unexpected error in refreshUserTokens")
        return '', 401

def hash_text(text, salt):
    return hashlib.sha256(text.encode() + salt.encode()).hexdigest()

# Function for refreshing
def refreshTokens(user_to_refresh):
    try:
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

    except Exception as e:
        app.logger.error("Failed to refresh tokens in refreshTokens")
        return False

def clear_and_redirect(redirect_url):
    response = redirect(redirect_url)
    response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
    return response

@app.route('/')
def checkSession():
    try:
        # Check if user session exists
        user_session_id = get_session_id()

        if user_session_id:
            user_id = find_user_function(user_session_id)
            
            # Refresh access and refresh token if the user already exists before redirecting to home page
            if user_id:
                if refreshTokens(user_id):
                    return redirect("/home")

                else:
                    return clear_and_redirect("/a")

            else:
                return clear_and_redirect("/a")
            
        # Login the user for the first time
        else:
            return clear_and_redirect("/a")

    except:
        app.logger.error("Unknown Error in checkSession")
        return clear_and_redirect("/a")

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

def generateNewSession(length=32):
    # characters = string.ascii_letters + string.digits + string.punctuation
    characters = string.ascii_letters + string.digits
    session_string = ''.join(secrets.choice(characters) for _ in range(length))
    return session_string

# Redirect when user logs in with MAL
@app.route('/auth')
def auth():
    user_session_id = get_session_id()

    if user_session_id:
        # Check if session id is assigned to user
        user = find_user_function(user_session_id)

        if user:
            return redirect("/home")

        # Delete cookie
        response = redirect("/")
        response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
        return response

    oauth_state = generateRandomState()
    code_challenge = generateCodeChallenge()

    # Hashes State and Encrypts code challenge before storing
    salt = uuid.uuid4().hex
    got_session = generateNewSession()
    new_user_auth = Auth(oauth_state=hash_text(oauth_state, salt), code_challenge=cipher_suite.encrypt(code_challenge.encode()), session_id=hash_text(got_session,session_salt), state_salt=salt)
    db.session.add(new_user_auth)

    try:
        db.session.commit()
    except Exception as e:
        app.logger.error(f"Database commit error in auth: {e}")
        db.session.rollback()
        abort(500, description="Internal Server Error: Unable to load the page. Please try again and report issue if it reoccurs.")

    auth_url = f"https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={client_id}&state={oauth_state}&redirect_uri={API_URL}/oauth/callback&code_challenge={code_challenge}&code_challenge_method=plain"
    
    response = redirect(auth_url)
    response.set_cookie('session', got_session, 
                    secure=True, 
                    httponly=True, 
                    samesite='Lax', 
                    path='/', 
                    max_age=30*24*60*60)
    return response

def query_auth(session_id, session_salt):
    try:
        hashed_session = hash_text(session_id, session_salt)
        return Auth.query.filter_by(session_id=hashed_session).first()

    except Exception:
        app.logger.critical('Unable to query database in query_auth')
        return None

def find_user_by_name(user_username):
    try:
        return User.query.filter_by(user_id=user_username).first()

    except Exception:
        app.logger.critical('Unable to query database in find_user_by_name')
        return None

# Redirect from OAuth
@app.route('/oauth/callback')
def oauth():

    # Compare hashed state
    returned_state = request.args.get('state')
    authorization_code = request.args.get('code')

    if returned_state and authorization_code:
        session_id = get_session_id()
        if not session_id:
            return render_template_string('''
                    <html>
                        <head>
                            <script type="text/javascript">
                                localStorage.setItem('errorMsgDiv', "True");
                                window.location.href = "/a";
                            </script>
                        </head>
                        <body>
                            <h1>Redirecting...</h1>
                        </body>
                    </html>
                ''')

        find_auth = query_auth(session_id, session_salt)
        if not find_auth:
            return render_template_string('''
                    <html>
                        <head>
                            <script type="text/javascript">
                                localStorage.setItem('errorMsgDiv', "True");
                                window.location.href = "/a";
                            </script>
                        </head>
                        <body>
                            <h1>Redirecting...</h1>
                        </body>
                    </html>
                ''')

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
                'redirect_uri': f'{API_URL}/oauth/callback',
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
                    find_user = find_user_by_name(user_username)

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

                    try:
                        db.session.commit()
                    
                    except Exception as e:
                        app.logger.error(f"Error saving to db in oauth: {e}")
                        return render_template_string('''
                            <html>
                                <head>
                                    <script type="text/javascript">
                                        localStorage.setItem('errorMsgDiv', '4');
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

            else:
                app.logger.error("Error exchanging tokens in oauth")
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
            app.logger.warning("State mismatch")
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
    session_id = get_session_id()
    if session_id == 'guest' or session_id == None:
        response = redirect('/home')
        response.set_cookie('session', "guest", 
                    secure=True, 
                    httponly=True, 
                    samesite='Lax', 
                    path='/', 
                    max_age=30*24*60*60)
        return response

    return redirect('/')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    # Uncomment for development server
    app.run(debug=True, host="localhost",port=5000, ssl_context=('localhost.pem', 'localhost-key.pem'))
    # app.run(host="0.0.0.0", port=80)