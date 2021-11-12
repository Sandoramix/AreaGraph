import { env } from 'src/environments/environment.dev';
import { Station } from 'src/app/Station';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { StationAvg } from 'src/app/StationAvg';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestService {
	private auth: Auth;

	constructor(private http: HttpClient) {
		// this.getStationAvg(107, '2021-11-09 09:00:00', '2021-11-09 10:00:00.00').subscribe((x) => {
		// 	console.warn(x);
		// });
	}

	getAllStations() {
		let st_request: Observable<Object>;
		if (this.checkCookie()) {
			st_request = this.http.get(`${env.apiUrl}stations`, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			st_request = this.getAuth().pipe(
				switchMap((tk) =>
					this.http.get(`${env.apiUrl}stations`, {
						headers: this.Headers(this.getToken()),
					}),
				),
			);
		}
		return st_request;
	}

	getStationAvg(st_id: number, dt_from: string, dt_to: string) {
		let body = new FormData();
		body.set('station_id', st_id.toString());
		body.set('date_from', dt_from);
		body.set('date_to', dt_to);

		let st_avg_request;

		if (this.checkCookie()) {
			st_avg_request = this.http.post<StationAvg>(`${env.apiUrl}station_avg`, body, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			st_avg_request = this.getAuth().pipe(
				switchMap((auth) =>
					this.http.post<StationAvg>(`${env.apiUrl}station_avg`, body, {
						headers: this.Headers(auth.token),
					}),
				),
			);
		}
		return st_avg_request;
	}

	private Headers(tk: string, obj: object = {}) {
		return {
			Authorization: `Bearer ${tk}`,
			...obj,
		};
	}

	private getAuth(): Observable<Auth> {
		return this.http
			.get<Auth>(`${env.apiUrl}auth`, {
				headers: new HttpHeaders({
					Authorization: `Basic ${btoa(`${env.user}:${env.passw}`)}`,
				}),
			})
			.pipe(
				switchMap((tk) => {
					this.setCookie(tk.token, tk.expires_at);
					return new Observable<Auth>((obs) => {
						obs.next(tk);
						obs.complete;
					});
				}),
			);
	}

	private checkCookie() {
		let cookie = this.getCookie();

		let auth_k = cookie.auth;
		let auth_exp = cookie.exp;
		let parsed_exp: number | null = typeof auth_exp === 'string' ? +auth_exp : null;

		if (!auth_k || (parsed_exp != null && parsed_exp <= Date.now())) {
			return false;
		}
		return true;
	}

	private getCookie() {
		return {
			auth: localStorage.getItem('auth_key'),
			exp: localStorage.getItem('expires_at'),
		};
	}

	private getToken() {
		let token = localStorage.getItem('auth_key');
		return token != null ? token : '';
	}

	private setCookie(tk: string, expiration: number) {
		localStorage.setItem('auth_key', tk);
		localStorage.setItem('expires_at', expiration.toString());
	}
}

class Auth {
	token: string;
	expires_at: number;
}
