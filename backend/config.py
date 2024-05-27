from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
import os
import sqlite3

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "sqlalchemy"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sessions.db'

db = SQLAlchemy(app)
app.config['SESSION_SQLALCHEMY'] = db
server_session = Session(app)