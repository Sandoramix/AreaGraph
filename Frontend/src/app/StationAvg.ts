import { Station } from './Station';
import { StatioNHourlyAvg } from './StationHourlyAvg';
export class StationAvg {
	private _station: Station
	private _data_hourly_avg: StatioNHourlyAvg[]

	get station() { return this._station }
	get data_hourly_avg() { return this._data_hourly_avg }
}
