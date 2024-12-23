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
from datetime import datetime
from dateutil.relativedelta import relativedelta

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
@app.route('/a')
@app.route('/home')
def serve_react_pages():
    try:
        return render_template('index.html')
        # return redirect("https://localhost:5173", code=302)
    except Exception:
        app.logger.error('Unable to load home page.')
        abort(500, description="Internal Server Error: Unable to load the page. Please try again and report issue if it reoccurs.")

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
                            "status" : "completed",
                            "finish_date": datetime.now().strftime('%Y-%m-%d'),
                        }

                    else:
                        body = {
                            "num_watched_episodes": eps_watched,
                            "status" : "completed",
                            "finish_date": datetime.now().strftime('%Y-%m-%d')
                        }

                # Update progress
                else:
                    body = {
                        "num_watched_episodes": eps_watched,
                        "status" : "watching"
                    }

                if data['started_watching'] is not None:
                    body['start_date'] = data['started_watching']

                if eps_watched == 0 and data['started_watching'] == None:
                    body['start_date'] = datetime.now().strftime('%Y-%m-%d')

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
                sort=anime_title&fields=start_date,end_date,status,num_episodes,broadcast,start_season&nsfw=true
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
                sort=anime_title&fields=start_date,end_date,status,my_list_status,num_episodes,broadcast,start_season&nsfw=true
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

        if 'my_list_status' not in node:
            continue
        if 'num_episodes_watched' not in node['my_list_status']:
            continue

        # Extract list status
        my_list_status = node.get('my_list_status')
        details['eps_watched'] = my_list_status.get('num_episodes_watched', 0)
        details['eps'] = node.get('num_episodes', 0)
        details['started_watching'] = my_list_status.get('start_date', None)

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

def guest_filter_user_anime_for_stats(data):
    # Sort for only completed anime
    animeList = data['data']
    
    completed_anime = [anime for anime in animeList if 
        'end_date' in anime['node'] and 
        'mean' in anime['node'] and 
        'start_season' in anime['node'] and
        'genres' in anime['node'] and
        'source' in anime['node'] and
        'studios' in anime['node'] and
        'rank' in anime['node'] and
        'rating' in anime['node']
    ]

    if(len(completed_anime) == 0):
        return {}

    # Flatten
    df = pd.json_normalize(
        completed_anime,
        record_path=['node', 'studios'],
        meta=[
            ['node', 'id'],
            ['node', 'main_picture', 'medium'],
            ['node', 'mean'],
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
        'studio_id','studio_name','anime_id','img','mal_score','rank','rating','source','start_year','title','genres'
    ]

    # For finding average and most popular anime genres
    genre_df = df[['genres']].infer_objects(copy=False)
    genre_df.loc[:, 'genres'] = genre_df['genres'].str.split(',')
    genre_df = genre_df.explode('genres')

    genre_df = genre_df['genres'].value_counts()
    genre_df = genre_df.reset_index()
    genre_df.columns = ['genre', 'count']

    genre_popular = genre_df[['genre', 'count']].sort_values(by='count', ascending=False).head(10)

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
    # ratings_df = ratings_df.rename(columns={'source': 'name', 'count': 'value'})

    sources_df = sources_df.sort_values(by='count', ascending=False).head(5)

    # Get popular and highest avg rated studio
    studio_df = df[['studio_id','studio_name']]
    studio_df = studio_df.groupby('studio_id').agg(
        studio_name=('studio_name', 'first'),
        count=('studio_id','size')
    ).reset_index()

    studio_popular = studio_df[['studio_name', 'count']].sort_values(by="count", ascending=False).head(10)
    # Popular season/year
    season_year_df = df[['start_year']]
    season_year_df = season_year_df.value_counts().reset_index(name='count')
    season_year_df.columns = ['start_year', 'count']

    response_data = {
        "top_10_genres_count": genre_popular.to_dict(orient='records'),
        "popular_ratings": ratings_df.to_dict(orient='records'),
        "sources": sources_df.to_dict(orient='records'),
        "top_10_studios_count": studio_popular.to_dict(orient='records'),
        "season_anime": season_year_df.head(3).to_dict(orient='records')
    }

    return response_data

def filter_scoring_data(data):
    animeList = data['data']

    completed_anime = [anime for anime in animeList 
        if anime['node']['my_list_status']['status'] == 'completed' and 
        'mean' in anime['node'] and 
        'start_season' in anime['node'] and
        'end_date' in anime['node'] and
        anime['node']['my_list_status']['score'] > 0 and
        'finish_date' in anime['node']['my_list_status']
    ]

    if(len(completed_anime) == 0):
        return {}

    rows = []
    for entry in completed_anime:
        node = entry["node"]
        id_ = node['id']
        title = node['title']
        img = node['main_picture']['medium']
        mal_score = node['mean']
        your_score = node['my_list_status']['score']
        year = node['start_season']['year']
        finish_date = node['my_list_status']['finish_date']

        rows.append({
            'id': id_,
            'title': title,
            'image': img,
            'mal_score': mal_score,
            'your_score': your_score,
            'year': year,
            'finish_date': finish_date
        })

    df = pd.DataFrame(rows)

    # You vs MAL Average Rating
    you_vs_mal_df = df[df['your_score'] > 0][['your_score','mal_score']]
    you_vs_mal_df = you_vs_mal_df.astype('float64')
    average_scores = you_vs_mal_df.mean().round(2)

    # Rated 8 or higher
    very_good_ratings = len(df[df['your_score'] >= 8])
    percentage = (very_good_ratings / len(df)) * 100

    # Lowest Rated
    min_score = df['your_score'].min()
    lowest_rated_anime = df[df['your_score'] == min_score][['title', 'image', 'your_score']]

    # Get Average Rating
    current_date = datetime.now()
    date_last_year = current_date - relativedelta(years=1)
    formatted_date = date_last_year.strftime('%Y-%m-%d')

    average_rating = df[(df['your_score'] > 0) & (df['finish_date'] >= formatted_date)][['your_score']]
    avg_rating = average_rating['your_score'].mean() if not average_rating.empty else 0

    # top20-anime
    anime_df= df[['id','title','your_score','mal_score','image']]
    top_20_anime = anime_df[['title','your_score','mal_score','image']].sort_values(by='your_score', ascending=False).head(20)

    response_data = {
        'you_vs_mal': average_scores.to_dict(),
        'very_good_ratings' : round(percentage,2),
        'lowest_rated': lowest_rated_anime.head(3).to_dict(orient='records'),
        'average_rating_last_year': round(avg_rating,2),
        "top_20_anime": top_20_anime.to_dict(orient='records')
    }
    return response_data

def filter_genre_data(data):
    animeList = data['data']

    completed_anime = [anime for anime in animeList 
        if anime['node']['my_list_status']['status'] == 'completed' and 
        anime['node']['my_list_status']['score'] > 0 and
        'finish_date' in anime['node']['my_list_status']
    ]

    if(len(completed_anime) == 0):
        return {}

    rows = []
    for entry in completed_anime:
        node = entry["node"]
        id_ = node['id']
        title = node['title']
        img = node['main_picture']['medium']
        your_score = node['my_list_status']['score']
        finish_date = node['my_list_status']['finish_date']
        genres = ','.join([genre['name'] for genre in node['genres']])

        rows.append({
            'id': id_,
            'title': title,
            'image': img,
            'your_score': your_score,
            'finish_date': finish_date,
            'genres': genres
        })

    df = pd.DataFrame(rows)

    # Top 10 genres average score
    # Top 10 geners by count
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
    genre_top_average = genre_df[['genre', 'average', 'count']].sort_values(by='average', ascending=False).head(10)
    genre_least_watched = genre_df[['genre', 'count']].sort_values(by='count', ascending=False).tail(10)

    # Get current date last year time
    current_date = datetime.now()
    date_last_year = current_date - relativedelta(years=1)
    formatted_date = date_last_year.strftime('%Y-%m-%d')

    # Most watched genres this year
    most_watched_genres = df[df['finish_date'] >= formatted_date][['genres']]
    most_watched_genres = most_watched_genres['genres'].str.split(',').explode().value_counts().head(10)
    most_watched_genres = most_watched_genres.reset_index().rename(columns={'index': 'genre', 0: 'count'})

    # Get earliest date genre was watched
    df['finish_date'] = pd.to_datetime(df['finish_date'])
    expanded_df = df.assign(genres=df['genres'].str.split(',')).explode('genres')
    result_df = expanded_df.groupby('genres', as_index=False).agg({'finish_date': 'min'})

    # Get genres watched this year
    genres_this_year = result_df[result_df['finish_date'] >= formatted_date][['genres']]

    response_data = {
        "top_10_genres_count": genre_popular.to_dict(orient='records'),
        "top_10_genres_avg": genre_top_average.to_dict(orient='records'),
        "top_10_least_watched": genre_least_watched.to_dict(orient='records'),
        "top_10_most_watched_this_year": most_watched_genres.to_dict(orient='records'),
        'genres_this_year': list(genres_this_year['genres'])
    }

    return response_data

def filter_preference_data(data):
    animeList = data['data']

    completed_anime = [anime for anime in animeList 
        if anime['node']['my_list_status']['status'] == 'completed' and 
        anime['node']['my_list_status']['score'] > 0 and
        anime['node']['num_episodes'] > 0 and
        'start_season' in anime['node'] and
        'source' in anime['node'] and
        'rating' in anime['node']
    ]

    if(len(completed_anime) == 0):
        return {}

    rows = []
    for entry in completed_anime:
        node = entry["node"]
        id_ = node['id']
        title = node['title']
        img = node['main_picture']['medium']

        source = node['source']
        eps = node['num_episodes']
        media_type = node['media_type']
        rating = node['rating']
        popularity = node['popularity']
        year = node['start_season']['year']

        rows.append({
            'id': id_,
            'title': title,
            'image': img,
            'source': source,
            'eps': eps,
            'media_type': media_type,
            'rating': rating,
            'popularity': popularity,
            'year': year
        })

    df = pd.DataFrame(rows)

    # Find most watched sources
    sources_df = df[['source']].fillna('Unknown')
    sources_df = sources_df.groupby('source').agg(
        count=('source','size')
    ).reset_index()

    sources_df = sources_df.sort_values(by='count', ascending=False).head(5)
    
    # Media types
    media_df = df[['media_type']].fillna('Unknown')
    media_df = media_df.groupby('media_type').agg(
        count=('media_type','size')
    ).reset_index()

    media_df = media_df.sort_values(by='count', ascending=False)
    media_df = media_df.rename(columns={'media_type': 'name', 'count': 'value'})

    # Find most watched ratings
    ratings_df = df[['rating']].dropna()
    ratings_df = ratings_df.groupby('rating').agg(
        count=('rating','size')
    ).reset_index()
    ratings_df = ratings_df.rename(columns={'rating': 'name', 'count': 'value'})

    # Popular year top 5
    season_year_df = df[['year']]
    season_year_df = season_year_df.value_counts().reset_index(name='count').head(5)
    season_year_df.columns = ['year', 'count']

    #shorter vs longer series
    series_length = df[df['media_type'] == 'tv'][['eps']]
    series_length = series_length.value_counts().reset_index(name='count')
    series_length['Category'] = series_length['eps'].apply(lambda x: 'Longer' if x > 14 else 'Shorter')

    category_totals = series_length.groupby('Category')['count'].sum().reset_index()
    category_totals = category_totals.sort_values(by='Category', ascending=False)
    category_totals.columns = ['Category', 'Total Count']

    # Popularity Anime
    popular_df = df[['popularity']]
    average_popularity = popular_df['popularity'].mean()
    less_than_200_count = popular_df[popular_df['popularity'] < 200].shape[0]

    response_data = {
        'sources': sources_df.to_dict(orient='records'),
        'media_types': media_df.to_dict(orient='records'),
        'ratings': ratings_df.to_dict(orient='records'),
        'popular_years': season_year_df.to_dict(orient='records'),
        'season_length': category_totals.to_dict(orient='records'),
        'popularity' : {
            'avg_pop': round(average_popularity,2),
            'top_200_pop': less_than_200_count,
        }
    }

    return response_data

def filter_viewing_data(data):
    animes = data['data']

    animeList = [anime for anime in animes 
        if anime['node']['my_list_status']['status'] == 'completed' and
        'start_date' in anime['node']['my_list_status'] and 
        'finish_date' in anime['node']['my_list_status'] and 
        anime['node']['my_list_status']['num_episodes_watched'] > 0 and
        'average_episode_duration' in anime['node']
    ]

    if(len(animeList) == 0):
        return {}

    rows = []
    for entry in animeList:
        node = entry["node"]
        id_ = node['id']
        image = node['main_picture']['medium']
        title = node['title']
        status = node['my_list_status']['status']
        eps = node['my_list_status']['num_episodes_watched']
        start_date = node['my_list_status'].get('start_date', None)
        finish_date = node['my_list_status'].get('finish_date', None)
        media_type = node['media_type']
        duration = node['average_episode_duration']

        rows.append({
            'id': id_,
            'title': title,
            'img': image,
            'eps': eps,
            'status': status,
            'start_date': start_date,
            'finish_date': finish_date,
            'media_type': media_type,
            'duration': duration
        })

    df = pd.DataFrame(rows)
    df['start_date'] = pd.to_datetime(df['start_date'])
    df['finish_date'] = pd.to_datetime(df['finish_date'])


    # Get current date last year time
    current_date = datetime.now()
    date_last_year = current_date - relativedelta(years=1)
    formatted_date = date_last_year.strftime('%Y-%m-%d')
    
    # How many shows + eps watched this year?
    watched_this_year = df[
        (df['finish_date'] >= formatted_date) & (df['media_type'] != 'movie')
    ][['eps','duration']]

    shows_this_year = len(watched_this_year)
    eps_this_year = int(watched_this_year["eps"].sum())

    # Total duration
    watched_this_year['total_duration'] = watched_this_year['eps'] * watched_this_year['duration']
    total_duration = int(watched_this_year["total_duration"].sum())

    # average complete time
    df['completion_time'] = (df['finish_date'] - df['start_date']).dt.days
    average_completion_time = float(round(df['completion_time'].mean(),2))

    # Shortest Completion Time
    shows_only = df[(df['media_type'] != 'movie') & (df['media_type'] != 'tv_special')][['title','img','completion_time']]
    shows_only = shows_only.sort_values(by='completion_time', ascending=False)

    min_completion_time = shows_only['completion_time'].min()
    shortest_completion_rows = shows_only.tail(5).sort_values(by='completion_time', ascending=True)

    # Longest Completion Time
    max_completion_time = shows_only['completion_time'].max()
    longest_completion_rows = shows_only.head(5)

    response_data = {
        'this_year' : {
            'shows': shows_this_year,
            "eps": eps_this_year,
            'duration': round(total_duration/60,2)
        },
        'avg_completion': average_completion_time,
        'shortest_completion' : shortest_completion_rows.to_dict(orient='records'),
        'longest_completion' : longest_completion_rows.to_dict(orient='records'),
    }

    return response_data

def filter_studio_data(data):
    # Sort for only completed anime
    animeList = data['data']
    completed_anime = [anime for anime in animeList 
        if anime['node']['my_list_status']['status'] == 'completed' and 
        'studios' in anime['node'] and
        len(anime['node']['studios']) == 1
    ]

    if(len(completed_anime) == 0):
        return {}

    rows = []
    for entry in completed_anime:
        node = entry["node"]
        id_ = node['id']
        title = node['title']
        score = node['my_list_status']['score']
        studios = node['studios']

        rows.append({
            'id': id_,
            'title': title,
            'studio': studios,
            'score': score
        })

    df = pd.DataFrame(rows)
    df_expanded = df.explode('studio')

    df_expanded['studio_id'] = df_expanded['studio'].apply(lambda x: x['id'] if pd.notnull(x) else None)
    df_expanded['studio_name'] = df_expanded['studio'].apply(lambda x: x['name'] if pd.notnull(x) else None)
    df_expanded = df_expanded.drop(columns=['studio'])

    # Get popular and highest avg rated studio
    studio_df = df_expanded[['studio_id','studio_name', 'score']]
    studio_df = studio_df.groupby('studio_id').agg(
        studio_name=('studio_name', 'first'),
        total_score=('score',lambda x: x[x > 0].sum()),
        count=('studio_id','size'),
        non_zero_count=('score', lambda x: (x > 0).sum()) 
    ).reset_index()

    studio_df['average'] = (studio_df['total_score'] / studio_df['non_zero_count']).round(2)
    studio_df['average'] = studio_df['average'].fillna(0)

    studio_popular = studio_df[['studio_name', 'count']].sort_values(by="count", ascending=False).head(10)
    studio_top_average = studio_df[['studio_name', 'average', 'count']].sort_values(by="average", ascending=False).head(10)

    response_data = {
        "top_10_studios_count": studio_popular.to_dict(orient='records'),
        "top_10_studios_avg": studio_top_average.to_dict(orient='records'),
    }

    return response_data

@app.route('/api/user-stats-studio', methods=["GET"])
def userStudioData():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            if user_session_id == 'guest':
                return 'You must be logged in to get this data',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,my_list_status,studios&nsfw=true&limit=1000'

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)
                
                if response.status_code == 200:
                    score_data = filter_studio_data(response.json())
                    return jsonify(score_data)

                app.logger.error("Error fetching weekly anime for authenticated user in userStudioData")
                return 'Unable to get user data from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in userStudioData function: {e}")
        return 'Unable to get your data from MAL. Please report issue if it continues happening.', 500

@app.route('/api/user-stats-view', methods=["GET"])
def userViewData():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            if user_session_id == 'guest':
                return 'You must be logged in to get this data',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,my_list_status,num_episodes,media_type,average_episode_duration&nsfw=true&limit=1000'

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)
                
                if response.status_code == 200:
                    score_data = filter_viewing_data(response.json())
                    return jsonify(score_data)

                app.logger.error("Error fetching weekly anime for authenticated user in userViewData")
                return 'Unable to get user data from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in userViewData function: {e}")
        return 'Unable to get your data from MAL. Please report issue if it continues happening.', 500

@app.route('/api/user-stats-pref', methods=["GET"])
def userPrefData():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            if user_session_id == 'guest':
                return 'You must be logged in to get this data',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,start_season,popularity,rating,source,my_list_status,num_episodes,media_type&nsfw=true&limit=1000'

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)

                if response.status_code == 200:
                    score_data = filter_preference_data(response.json())
                    return jsonify(score_data)

                app.logger.error("Error fetching weekly anime for authenticated user in userPrefData")
                return 'Unable to get user data from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in userPrefData function: {e}")
        return 'Unable to get your data from MAL. Please report issue if it continues happening.', 500

# Get user data function for user genre data
@app.route('/api/user-stats-genres', methods=["GET"])
def userGenreData():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            if user_session_id == 'guest':
                return 'You must be logged in to get this data',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,genres,my_list_status&nsfw=true&limit=1000'

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)

                if response.status_code == 200:
                    score_data = filter_genre_data(response.json())
                    return jsonify(score_data)

                app.logger.error("Error fetching weekly anime for authenticated user in userGenreData")
                return 'Unable to get user data from MAL',500

            # User not found
            response = redirect("/")
            response.set_cookie('session', '', expires=0, secure=True, httponly=True, samesite='Lax', path='/')
            return response

        # User not logged in
        return redirect('/')

    except Exception as e:
        app.logger.error(f"Unexpected error in userGenreData function: {e}")
        return 'Unable to get your data from MAL. Please report issue if it continues happening.', 500

# Get user data function for guest/user scoring data
@app.route('/api/user-stats', methods=["GET"])
def userData():
    try:
        # Check limit
        if is_rate_limited(request.remote_addr, request.endpoint, limit=1, period=300):
            return jsonify({"error": "rate limit exceeded"}), 429

        # Find user using session id
        user_session_id = get_session_id()

        if user_session_id:

            if user_session_id == 'guest':
                mal_get_user_data = '''
                    https://api.myanimelist.net/v2/users/ZNEAK300/animelist?fields=id,title,main_picture,start_season,end_date,genres,mean,rank,rating,studios,source&nsfw=true&limit=1000
                '''
                headers = {
                    'X-MAL-CLIENT-ID': f'{client_id}'
                }

                response = requests.get(mal_get_user_data, headers=headers)
                
                if response.status_code == 200:
                    data_to_return = guest_filter_user_anime_for_stats(response.json())
                    return jsonify(data_to_return)

                app.logger.error("Error fetching weekly anime for authenticated user in userData")
                return 'Unable to get user data from MAL',500

            find_user = find_user_function(user_session_id)

            if find_user:
                msg, code = check_expiry()

                # Login again
                if code == 401 or code == 403:
                    return msg, code

                mal_get_user_data = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,start_season,mean,my_list_status,end_date&nsfw=true&limit=1000'

                user_token = cipher_suite.decrypt(find_user.access_token)
                mal_access_token = user_token.decode()
                headers = {
                    'Authorization': f'Bearer {mal_access_token}'
                }

                response = requests.get(mal_get_user_data, headers=headers)
                
                if response.status_code == 200:
                    score_data = filter_scoring_data(response.json())
                    return jsonify(score_data)

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
                sort=anime_title&fields=start_date,end_date,status,num_episodes,broadcast&nsfw=true&limit=1000'''
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
                sort=anime_title&fields=start_date,end_date,status,my_list_status,num_episodes,broadcast&nsfw=true&limit=1000'''
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