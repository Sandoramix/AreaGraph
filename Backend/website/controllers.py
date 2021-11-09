#Virual enviroment [.env] modules and configuration
import dotenv
dotenv.load_dotenv()
from os import environ

#
from flask import abort
from flask_restful import Resource, reqparse
import psycopg2 as psp

#CONNECT TO DB
db=psp.connect(host=environ['host'],port=environ['port'],database=environ['db'],user=environ['user'],password=environ['password']) 
cur=db.cursor()

def reconnect():
    global db
    global cur
    #debug @TODO remove on finish
    print(f'database connection={db.closed}')
    print(f'cursor connection={cur.closed}')
    #RECONNECT TO DB
    db=psp.connect(host=environ['host'],port=environ['port'],database=environ['db'],user=environ['user'],password=environ['password']) 
    cur=db.cursor()


def execute_query(query:str,fetch_n:int or None=None):
    """SQL command execution and retreiving of data

    Args:
        `query` (str) : sql query
        `fetch_n` (int | None, optional) : Number of records to fetch . Defaults to None.

    Returns:
        if `fetch_n` = (0 -> all | N -> N) => list[tuple]; 1 => tuple; None => _cursor
    """
    #Reconnect in case of disconnection from database
    if cur.closed or db.closed:
        print("reconnecting to database")
        reconnect()
    
    #query
    cur.execute(query)
    
    if fetch_n == None:
        return cur
    if fetch_n == 0:
        return cur.fetchall()
    elif fetch_n == 1:
        return cur.fetchone()
    return cur.fetchmany(fetch_n)


def station_id_check(id:int)-> bool:
    """Check if the station of id `id` exists

    Args:
        `id` (int) : station id

    Returns:
        `boolean` : `True` if exists, either `False`
    """
    if not execute_query(f'select * from station where id={id}',fetch_n=1):
        return False
    return True


def station_tuple_to_json(info: tuple,i:int=0):
    """Transform the station fetched information into an object

    Args:
        info (tuple): station informations
        i (int, optional): index from where the tuple starts. Defaults to 0.

    Returns:
        json serializable objects
    """
    return  {
        "id":info[i],
        "name":info[i+1],
        "latitude":info[i+2],
        "longitude":info[i+3]
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
    
    #Required headers
    getparse = reqparse.RequestParser()
    getparse.add_argument("station_id",type=int, help="No `station_id` parameter provided" ,required=True)
    getparse.add_argument("date_from",type=str, help="No `date_from` parameter provided" ,required=True)
    getparse.add_argument("date_to",type=str, help="No `date_to` parameter provided" ,required=True)
    
    #query used for fetching the station by its `id` @[to contatenate]
    fetch_station="select st.id,st.name,st.latitude,st.longitude from station as st where id="

    #inner join between the needed tables/view
    fetch_between_dates="""select sdha.bucket as created_on, 
                        sdha.avg as average, 
                        ss.id as sensor_id, 
                        ss.description as sensor_type, 
                        ss.min_range_val as sensor_min_val, 
                        ss.max_range_val as sensor_max_val,
                        ss.unit as sensor_unit,
                        st.id as station_id,
                        st.name as station_name,
                        st.latitude as station_latitude,
                        st.longitude as station_longitude from station_data_hourly_avg as sdha 
                        inner join sensor as ss on sdha.sensor_id = ss.id 
                        inner join station as st on sdha.station_id =st.id 
                        where sdha.station_id =%s and sdha.bucket between %s and %s
                        order by sdha.bucket, ss.name
    """
    
    #GET Method
    def get(self):
        """GET Request

        Returns:
            `json`,status-code 
            
        """
        req_args=self.getparse.parse_args()
        st_id=req_args['station_id']
        
        #Break the request if the station id doesn't exist
        if not station_id_check(st_id):
            abort(400,f'station_id `{st_id}` doesn\'t exists')
        
        #Dates 
        date_from=req_args['date_from']
        date_to=req_args['date_to']

        #Format the query with right values
        query=cur.mogrify(self.fetch_between_dates,(st_id,date_from,date_to))
        
        #All fetched records
        records=execute_query(query,fetch_n=0)
        
        #first row. Need for station informations
        info=records[0]
        return {
            "station":station_tuple_to_json(info,7),
            "data_hourly_avg":[
                self.format_station_data_avg(i) for i in records
                ]
        },200
    
    
    def format_station_data_avg(self,info:tuple):
        """Format the whole station_data_hourly_avg after the inner join's

        Args:
            info tuple: Fetched record
        
        Return:
            json serializable object
        """
        return{
            "created_on":info[0].strftime("%Y-%m-%d %H:%M:%S.%f"),
            "avg_value":info[1],
            "sensor":{
                "id":info[2],
                "type":info[3],
                "min_val":info[4],
                "max_val":info[5],
                "unit":info[6]
            }
        }
#----------------------------------------------------------------------------------------------

class Stations (Resource):
    """HTTP Methods controller for station table requests
    - Return:
        - All avaiable stations
    """
    def get(self):
        return{
            "stations":[
                    station_tuple_to_json(i)  for i in execute_query("select st.id,st.name,st.latitude,st.longitude from station as st",fetch_n=0)
                ]
        },200 
#----------------------------------------------------------------------------------------------
   
class HomePage(Resource):
    """Homepage
    """
    def get(self):
        return {"message":"Homepage is unused"},306
#----------------------------------------------------------------------------------------------
