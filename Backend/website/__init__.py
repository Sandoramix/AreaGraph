#Imports
from flask import Flask,send_from_directory
from flask.helpers import url_for
from flask.templating import render_template
from flask_restful import Api
import os

from .controllers import *

#flask app
app= Flask(__name__)

#Api inizialization
api=Api(app) 
    

#routes
api.add_resource(StationDataAvgController, "/station_avg")
api.add_resource(Stations,'/stations')


@app.route('/')
def home():
    return render_template('index.html',title='Home'),306

#error changed responses
@app.errorhandler(404)
def not_found(err):
    return {"message":"Page not Found"},404
    