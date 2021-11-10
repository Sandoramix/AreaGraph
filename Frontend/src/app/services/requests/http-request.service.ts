import { Station } from './../../Station';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';


const headers: HttpHeaders = new HttpHeaders({
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
})
@Injectable(

)
export class HttpRequestService {
	constructor(private http: HttpClient) {

	}
	//:Observable<Station[]> | null
	getAllStations() {
		let result: any = null
		return this.http.get('http://127.0.0.1:8888/stations').pipe(
			map((res: any) => {
				let results = res.stations
				return results;
			}),
			catchError(this.handleError<Station[]>('GET Stations', []))
		)


	}


	private handleError<Station>(operation = 'operation', result?: Station) {
		return (error: any): Observable<Station> => {
			console.error(error);
			return of(result as Station);
		};
	}
}
