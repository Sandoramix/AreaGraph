import { Sensor } from './Sensor';

export interface StationHourlyAvg {
	created_on: string;
	avg_value: number;
	sensor: Sensor;
}
