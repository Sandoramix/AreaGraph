import { env } from './../../../environments/environment.dev';
import { Station } from './../../Station';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StationAvg } from 'src/app/StationAvg';


@Injectable()
export class HttpRequestService {

	auth: Token;

	stations: Station[] = [];

	station_hourly_avg: StationAvg;

	constructor(private http: HttpClient) {
		//this.getStationAvg(107, '2021-11-09 09:00:00', '2021-11-09 10:00:00.00')
	}




	getAllStations() {
		this.getAccess().pipe(
			switchMap(a => this.http.get(
				`${env.apiUrl}stations`,
				{ headers: this.authHeader(a.token) }
			))
		).subscribe((response: any) => {
			this.stations = response.stations
		})
	}


	private authHeader(tk: string) {
		return { 'Authorization': `Bearer ${tk}` };
	}

	getStationAvg(st_id: number, dt_from: string, dt_to: string) {
		let form = new FormData();
		form.append('station_id', st_id.toString());
		form.append('date_from', dt_from);
		form.append('date_to', dt_to);

		this.getAccess().pipe(
			switchMap(auth => this.http.post<StationAvg>(`${env.apiUrl}station_avg`, form, { headers: this.authHeader(auth.token) }))
		).subscribe((response: StationAvg) => {
			this.station_hourly_avg = response;
		})

	}




	private getAccess() {
		return this.http.get<Token>(`${env.apiUrl}auth`, {
			headers: new HttpHeaders({
				'Authorization': `Basic ${btoa(`${env.user}:${env.passw}`)}`
			})
		})
	}

}

class Token {
	token: string;
	expires_at: number;
}
