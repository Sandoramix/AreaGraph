# modules
from backend.queries import allStations, fetch_betweenDates, stationById, stationInfoById, workingStationIds, workingStations,getMaxDate,getMinDate
from functools import wraps
import datetime
from os import environ
from flask.helpers import make_response
from flask_restful import Resource, reqparse
import psycopg2 as psp
import jwt
from flask import abort, request, jsonify

# Virual enviroment [.env] configuration
import dotenv
dotenv.load_dotenv()


# CONNECT TO DB
db = psp.connect(host=environ['host'], port=environ['port'],
                 database=environ['db'], user=environ['user'], password=environ['password'])
cur = db.cursor()


def connect():
    global db
    global cur
    db = psp.connect(host=environ['host'], port=environ['port'],
                     database=environ['db'], user=environ['user'], password=environ['password'])
    cur = db.cursor()


def disconnect():
    db.close()
    cur.close()


def execute_query(query: str, fetch_n: int or None = None):
    """SQL command execution and retreiving of data

    Args:
        `query` (str) : sql query
        `fetch_n` (int | None, optional) : Number of records to fetch . Defaults to None.

    Returns:
        if `fetch_n` = (0 -> all | N -> N) => list[tuple]; 1 => tuple; None => _cursor
    """
    
    connect()
    data = execute(query, fetch_n)
    disconnect()
    return data


def execute(query: str, fetch_n: int or None = None):
    data = cur.execute(query)
    if fetch_n == None:
        return cur
    if fetch_n == 0:
        return cur.fetchall()
    elif fetch_n == 1:
        return cur.fetchone()
    return cur.fetchmany(fetch_n)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token or token[:7] != 'Bearer ':
            return jsonify({'message': 'Token is Missing [Starts with Bearer ]'})
        try:
            access_token = token.split("Bearer ")[1]
            user = environ['jwt_user']
            data = jwt.decode(
                access_token, environ['secret_key'], algorithms=['HS256'])
        except Exception as e:
            print(e)
            return make_response('Invalid token',  401, {'Authentication': 'Invalid token'})

        return f(*args, **kwargs)
    return decorator


def station_id_check(id: int) -> bool:
    """Check if the station of id `id` exists

    Args:
        `id` (int) : station id

    Returns:
        `boolean` : `True` if exists, either `False`
    """
    if not execute_query(stationById(id), fetch_n=1):
        return False
    return True

def datetime_to_str(date):
    return date.strftime("%Y-%m-%d %H:%M:%S")

def getStationByID(id: int):
    station = execute_query(stationInfoById(id),1)

    if not station:
        return {}
    station=station_tuple_to_json(station)
    dates=getStationDateRange(id)
    station["min_date"]=dates[0]
    station["max_date"]=dates[1]
    return station

def getStationDateRange(id: int)-> tuple:
    if not station_id_check(id):
        return ()
    minDate:datetime.datetime=execute_query(getMinDate(id),1)[0]
    maxDate:datetime.datetime=execute_query(getMaxDate(id),1)[0]
    return (datetime_to_str(minDate),datetime_to_str(maxDate))

def station_tuple_to_json(info: tuple, i: int = 0):
    """Transform the station fetched information into an object

    Args:
        info (tuple): station informations
        i (int, optional): index from where the tuple starts. Defaults to 0.

    Returns:
        json serializable objects
    """
    return {
        "id": info[i],
        "name": info[i+1],
        "latitude": info[i+2],
        "longitude": info[i+3]
    }



class StationDataAvgController(Resource):
    """HTTP Methods controller for hourly data of a station
    - Requirements:

        - GET:
            - Path: `/station_avg`
            - Headers:
                - `station_id` (int) : station id to get data from
                - `date_from` (str) : date from where to start fetching
                - `date_to` (str) : date where to end fetching

                    *Dates must be in UTC format [YYYY-MM-DD HH-MM-SS.MS]

    """

    # Required headers
    parser = reqparse.RequestParser()
    parser.add_argument("station_id", type=int, help="No `station_id` parameter provided",
                        required=True, location='form', case_sensitive=False)
    parser.add_argument("date_from", type=str, help="No `date_from` parameter provided",
                        required=True, location='form', case_sensitive=False)
    parser.add_argument("date_to", type=str, help="No `date_to` parameter provided",
                        required=True, location='form', case_sensitive=False)

    # POST Method
    @token_required
    def post(self):
        """POST Request

        Returns:
            `json`,status-code 

        """

        req_args: dict = self.parser.parse_args()
        st_id: int = int(req_args['station_id'])
        if not station_id_check(st_id):
            abort(400, f'station_id `{st_id}` doesn\'t exists')

        # Dates
        date_from: str = req_args['date_from'].strip()
        date_to: str = req_args['date_to'].strip()

        # [DATES VALIDATION]
        valid_date: bool = True
        try:
            _date_from_raw: str = date_from.split('.')[0]
            _date_to_raw: str = date_to.split('.')[0]
            
            _date_from: str = _date_from_raw.format("%Y-%m-%d %H:%M:%S")
            _date_to: str = _date_to_raw.format("%Y-%m-%d %H:%M:%S")

            if _date_from_raw != _date_from or _date_to_raw != _date_to:
                valid_date = False
        except Exception as e:
            valid_date = False
 
        if not valid_date:
            abort(406, "DATE/S INVALID")

        # Format the query with right values
        query: str = fetch_betweenDates(st_id, date_from, date_to)

        # All fetched records
        records: list[tuple] = execute_query(query, fetch_n=0)

        if len(records) == 0:
            return{
                'station': getStationByID(st_id),
                'data_hourly_avg': []
            },200
        
        return {
            "station": getStationByID(st_id),
            "data_hourly_avg": [
                self.format_station_data_avg(i) for i in records
            ]
        }, 200

    def format_station_data_avg(self, info: tuple):
        """Format the whole station_data_hourly_avg after the inner join's

        Args:
            info tuple: Fetched record

        Return:
            json serializable object
        """
        return{
            "created_on": datetime_to_str(info[0]),
            "avg_value": info[1],
            "sensor": {
                "id": info[2],
                "type": info[3],
                "min_val": info[4],
                "max_val": info[5],
                "unit": info[6]
            }
        }
# ----------------------------------------------------------------------------------------------


class AllStations (Resource):
    """HTTP Methods controller for station table requests
    - Return:
        - All avaiable stations
    """

    @token_required
    def get(self):
        return{
            "stations": [
                station_tuple_to_json(i) for i in execute_query(allStations(), fetch_n=0)
            ]
        }, 200


class WorkingStations(Resource):
    """HTTP Methods controller for station table requests
    - Return:
        - All working stations
    """

    @token_required
    def get(self):
        g_st = workingStations()
        return{
            "stations": [
                station_tuple_to_json(i) for i in execute_query(g_st, 0)
            ]
        }, 200
# ----------------------------------------------------------------------------------------------

class StationInfo(Resource):

    @token_required
    def get(self,id):
        _id:int
        try:
            _id=int(id)
        except ValueError:
            abort(400,'Station id must be an integer')
            
        if not station_id_check(_id):
            abort(404,'No station found!')    
        
        return getStationByID(_id),200
        



class HomePage(Resource):
    """Homepage
    """
    def get(self):
        return {"message": "Homepage is unused"}, 306
# ----------------------------------------------------------------------------------------------
