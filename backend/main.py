from flask import request, jsonify, redirect
from config import app, db
import pkce
import os
from dotenv import load_dotenv
from random import randrange
import requests

# TODO Import DB later
# from models import

load_dotenv()

# Get the client id
@app.route('/api/client-id', methods=["GET"])
def getClientID():
    return jsonify({"clientId": os.getenv('CLIENT_ID')})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True,port=5000)