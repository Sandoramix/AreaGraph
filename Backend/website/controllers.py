import dotenv
dotenv.load_dotenv()
from os import environ

from flask import abort
from flask_restful import Resource, reqparse
import psycopg2 as psp


#SETUP DB
db=psp.connect(host=environ['host'],port=environ['port'],database=environ['db'],user=environ['user'],password=environ['password']) 
cur=db.cursor()

def execute_query(query:str,fetch_n:int=None):
    cur.execute(query)
    if fetch_n == None:
        return cur
    if fetch_n == 0:
        return cur.fetchall()
    elif fetch_n == 1:
        return cur.fetchone()
    return cur.fetchmany(fetch_n)
def station_id_check(id:int):
        if not execute_query(f'select * from station where id={id}',fetch_n=1):
            return False
        return True


class StationDataAvgController(Resource):
    getparse = reqparse.RequestParser()
    getparse.add_argument("station_id",type=int, help="No `station_id` parameter provided" ,required=True)
    getparse.add_argument("date_from",type=str, help="No `from_date` parameter provided" ,required=False)
    getparse.add_argument("date_to",type=str, help="No `to_date` parameter provided" ,required=False)
    
    fetch_station="select st.id,st.name,st.latitude,st.longitude from station as st where id="
    
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
    """
    
    
    def get(self):
        req_args=self.getparse.parse_args()
        st_id=req_args['station_id']
        
        if not station_id_check(st_id):
            abort(400,f'station_id `{st_id}` doesn\'t exists')
            
        date_from=req_args['date_from']
        date_to=req_args['date_to']
        
        if not date_to or not date_from:
            abort(400,"Missing `date_from` or `date_to` parameter")        
        
        query=cur.mogrify(self.fetch_between_dates,(st_id,date_from,date_to))
        
        return {"station_data_hourly_avg":([self.format_station_data_avg(i) for i in execute_query(query,fetch_n=0)])},200
    
    
    def format_station_data_avg(self,info):
        return{
            "created_on":info[0].strftime("%Y-%m-%d %H:%M:%S.%f"),
            "avg_value":info[1],
            "sensor":{
                "id":info[2],
                "type":info[3],
                "min_val":info[4],
                "max_val":info[5],
                "unit":info[6]
            },
            "station":{
                "id":info[7],
                "name":info[8],
                "latitude":info[9],
                "longitude":info[10]
            }
        }
#----------------------------------------------------------------------------------------------

class Stations (Resource):
    def get(self):
        return{
            "stations":[
                    self.format_station(i)  for i in execute_query("select st.id,st.name,st.latitude,st.longitude from station as st",fetch_n=0)
                ]
        },200
     
    def format_station(self,st):
        
        return{
            "station_id":st[0],
            "station_name":st[1],
            "station_latitude":st[2],
            "station_longitude":st[3]
        }    
#----------------------------------------------------------------------------------------------
   
class HomePage(Resource):
    def get(self):
        return {"message":"HomePage unused","Used pages":["/stations","/station_avg"]},306
#----------------------------------------------------------------------------------------------
