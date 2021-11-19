# Imports
from time import time
from flask import Flask, make_response
from flask.templating import render_template

from flask_restful import Api
from flask_cors import CORS

from .controllers import StationDataAvgController, AllStations, WorkingStations, request, environ, jwt, jsonify

# flask app

app = Flask(__name__)

cors = CORS(app, send_wildcard=True, max_age=3600)

# Api inizialization
api = Api(app)

# routes
api.add_resource(StationDataAvgController, "/api/station_avg")
api.add_resource(AllStations, '/api/all_stations')
api.add_resource(WorkingStations, '/api/working_stations')


@app.route('/')
def home():
    return render_template('index.html', title='Home', message='This page is unused'), 306


# Auth route
@app.route('/api/auth', methods=['GET'])
def auth():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response('Not verified', 401, {'Authentication': 'Basic realm: "Login required"'})

    auth_user = auth.username.strip()
    if auth_user != environ['jwt_user']:
        return make_response('Invalid username',  401, {'Login': 'Invalid username'})

    auth_passw = auth.password.strip()
    if auth_passw != environ['jwt_password']:
        return make_response('Invalid password',  401, {'Login': 'Invalid password'})

    expiration = time()*1000 + 3600000
    token = jwt.encode(
        {'user_id': auth_user, 'exp': expiration},
        environ['secret_key']
    )
    return jsonify({
        'token': token,
        'expires_at': expiration
    })


# Custom error responses
@app.errorhandler(404)
def not_found(err):
    return {"message": "Page not Found"}, 404
