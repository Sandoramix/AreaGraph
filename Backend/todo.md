# @TODO 
---
# PostgreSQL commands
## Inner
>select sdha.bucket as created_on, 
sdha.avg as average, 
ss.id as sensor_id, 
ss.description as sensor_type, 
ss.min_range_val as sensor_min_val, 
ss.max_range_val as sensor_max_val,
st.id as station_id,
st.name as station_name,
st.latitude as station_latitude,
st.longitude as station_longitude from station_data_hourly_avg as sdha inner join sensor as ss on sdha.sensor_id = ss.id inner join station as st on sdha.station_id =st.id 

## On a specific station
> where sdha.station_id=`id`
## Between two dates
>  where (sdha.bucket between '`date1`' and '`date2`')
---


# Python Flask

## Security????
### Reform it with frontend