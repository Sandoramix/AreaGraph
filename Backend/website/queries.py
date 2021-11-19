
def allStations() -> str:
    return f"select st.id,st.name,st.latitude,st.longitude from station as st"


def workingStationIdsQuery() -> str:
    return """
    select distinct(sdha.station_id) from station_data_hourly_avg sdha 
    where sdha.sensor_id = 29510690
    and sdha.station_id in
    (select s.id from station s join project_station ps on ps.station_id = s.id where ps.project_id = 23)
    and sdha.avg < 1000;
"""


def workingStationIds() -> list[int]:
    return ','.join([str(i) for i in [
        34,
        49,
        51,
        53,
        68,
        69,
        79,
        80,
        87,
        89,
        107,
        22987105,
        23009801,
        23020070,
        23284701,
        23290319,
        23298562,
        23300358,
        23301399,
        23302011,
        23308564,
        24468079,
        25473218,
        27411741,
        27424053,
        31499869,
        31501097,
        31515046
    ]])


def workingStations() -> str:
    return f"select st.id,st.name,st.latitude,st.longitude from station as st where id in ({workingStationIds()})"


def stationById(id: int) -> str:
    return f'select * from station where id = {id}'


def stationInfoById(id: int) -> str:
    # query used for fetching the station by its `id`
    return f"select st.id,st.name,st.latitude,st.longitude from station as st where id = {id}"


def fetch_betweenDates(st_id: int, dt_from: str, dt_to: str) -> str:
    # inner join between the needed tables/view
    return f"""select sdha.bucket as created_on, 
                        sdha.avg as average, 
                        ss.id as sensor_id, 
                        ss.sensor_type as sensor_type, 
                        ss.min_range_val as sensor_min_val, 
                        ss.max_range_val as sensor_max_val,
                        ss.unit as sensor_unit,
                        st.id as station_id,
                        st.name as station_name,
                        st.latitude as station_latitude,
                        st.longitude as station_longitude from station_data_hourly_avg as sdha 
                        inner join sensor as ss on sdha.sensor_id = ss.id 
                        inner join station as st on sdha.station_id =st.id 
                        where sdha.station_id ={st_id} and sdha.bucket between '{dt_from}' and '{dt_to}'
                        and ss.sensor_type in ('T','RH','CO2','PM2.5','PM10') and st.id in ({workingStationIds()})
                        order by sdha.bucket, ss.name
    """
