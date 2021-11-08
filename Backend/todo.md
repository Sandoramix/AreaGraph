# @TODO 
---
# PostgreSQL commands
## Inner
>  select station_data_hourly_avg.bucket as created_on, station_data_hourly_avg.avg as average, station_data_hourly_avg.station_id as   station_id, sensor.id as sensor_id, sensor.description as sensor_type, sensor.min_range_val as sensor_min_val, sensor.max_range_val as sensor_max_val from station_data_hourly_avg inner join sensor on sensor_id = sensor.id

## Between two dates
>  where (station_data_hourly_avg.bucket between '2021-11-08 09:00:00.000' and '2021-11-08 10:00:00.000')
---
# Python Flask