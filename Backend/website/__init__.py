from flask import Flask
from flask_restful import Api

from .controllers import *

app= Flask(__name__)
api=Api(app)
    


api.add_resource(StationDataAvgController, "/station_avg")
api.add_resource(Stations,'/stations')
api.add_resource(HomePage,'/')

@app.errorhandler(404)
def not_found(err):
    return {"message":"Page not Found"},404
    