import { Sensor } from "./Sensor";
export interface Station {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	date_from: string;
	date_to: string;
}

export interface StationAvg {
	station: Station;
	data_hourly_avg: StationHourlyAvg[];
}
export interface StationHourlyAvg {
	created_on: string;
	avg_value: number;
	sensor: Sensor;
}
