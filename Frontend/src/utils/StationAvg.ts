import { Station } from './Station';
import { StationHourlyAvg } from './StationHourlyAvg';

export interface StationAvg {
	station: Station;
	data_hourly_avg: StationHourlyAvg[];
}
