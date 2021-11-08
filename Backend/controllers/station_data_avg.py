
from flask_restful import Resource, abort, reqparse
import json

#TMP
with open("controllers/dummyData.json","r") as data:
    dummyData=json.loads(data.read())['station_data_hourly_avg']

class StationDataAvgController(Resource):
    getparse = reqparse.RequestParser()
    getparse.add_argument("station_id",type=int, help="No `station_id` parameter provided" ,required=True)
    getparse.add_argument("from_date",type=str, help="No `from_date` parameter provided" ,required=True)
    getparse.add_argument("to_date",type=str, help="No `to_date` parameter provided" ,required=True)
    
    
    def get(self):
        req_args=self.getparse.parse_args()
        
    
    def id_check(self,id:int):
        #tmp
        if id<0 or not any(i['station_id'] == id for i in dummyData):
            abort(400,"Invalid id input")
        
        #TODO DB CHECK IF `id` EXISTS 
        

            
        