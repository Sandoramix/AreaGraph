import { Sensor } from './Sensor';

export class StationHourlyAvg {
	private _created_on: string;
	private _avg_value: number;
	private _sensor: Sensor;

	get created_on() {
		return this._created_on;
	}
	get avg_value() {
		return this._avg_value;
	}
	get sensor() {
		return this._sensor;
	}
}
