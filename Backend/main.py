
import dotenv
dotenv.load_dotenv()
from os import environ


from flask import Flask
from flask_restful import Api,Resource
from flask_sqlalchemy import SQLAlchemy



from controllers.station_data_avg import StationDataAvgController

server= Flask(__name__)
api=Api(server)

#TODO SETUP DB
db=SQLAlchemy(server)


api.add_resource(StationDataAvgController, "/station")


if __name__ == "__main__":
    server.run(debug=True, port=8080)
    