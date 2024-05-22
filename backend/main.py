from flask import request, jsonify
from config import app, db
import pkce

# TODO Import DB later
# from models import 

@app.route('/login', methods=["POST"])
def login():
    code_verifier = pkce.generate_code_verifier(length=128)
    code_challenge = pkce.get_code_challenge(code_verifier)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True,port=5000)