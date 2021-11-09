#Imports
from flask import Flask
from flask_restful import Api

from .controllers import *

#flask app
app= Flask(__name__)

#Api inizialization
api=Api(app)
    

#routes
api.add_resource(StationDataAvgController, "/station_avg")
api.add_resource(Stations,'/stations')
api.add_resource(HomePage,'/')

#error changed responses
@app.errorhandler(404)
def not_found(err):
    return {"message":"Page not Found"},404
    