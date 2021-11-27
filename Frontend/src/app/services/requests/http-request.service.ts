import { environment } from "src/environments/environment.dev";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { switchMap } from "rxjs/operators";
import { StationAvg, Station } from "src/utils/Station";
import { Observable } from "rxjs";

interface Auth {
	token: string;
	expires_at: number;
}

@Injectable()
export class HttpRequestService {
	constructor(private http: HttpClient) {}

	getAllStations() {
		let st_request: Observable<Object>;
		if (this.checkCookie()) {
			st_request = this.http.get(`${environment.apiUrl}all_stations`, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			st_request = this.getAuth().pipe(
				switchMap((tk) =>
					this.http.get(`${environment.apiUrl}all_stations`, {
						headers: this.Headers(this.getToken()),
					})
				)
			);
		}
		return st_request;
	}

	getWorkingStations() {
		let st_request: Observable<Object>;
		if (this.checkCookie()) {
			st_request = this.http.get(`${environment.apiUrl}working_stations`, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			st_request = this.getAuth().pipe(
				switchMap((tk) =>
					this.http.get(`${environment.apiUrl}working_stations`, {
						headers: this.Headers(this.getToken()),
					})
				)
			);
		}
		return st_request;
	}

	getStationAvg(st_id: number, dt_from: string, dt_to: string): Observable<StationAvg> {
		let body = new FormData();
		body.set("station_id", st_id.toString());
		body.set("date_from", dt_from);
		body.set("date_to", dt_to);

		let st_avg_request;

		if (this.checkCookie()) {
			st_avg_request = this.http.post<StationAvg>(`${environment.apiUrl}station_avg`, body, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			st_avg_request = this.getAuth().pipe(
				switchMap((auth) =>
					this.http.post<StationAvg>(`${environment.apiUrl}station_avg`, body, {
						headers: this.Headers(auth.token),
					})
				)
			);
		}
		return st_avg_request;
	}

	getStation(id: number): Observable<Station> {
		let request;
		if (this.checkCookie()) {
			request = this.http.get<Station>(`${environment.apiUrl}station/${id}`, {
				headers: this.Headers(this.getToken()),
			});
		} else {
			request = this.getAuth().pipe(
				switchMap((auth) =>
					this.http.get<Station>(`${environment.apiUrl}station/${id}`, {
						headers: this.Headers(auth.token),
					})
				)
			);
		}
		return request;
	}

	private Headers(tk: string, obj: object = {}) {
		return {
			Authorization: `Bearer ${tk}`,
			...obj,
		};
	}

	private getAuth(): Observable<Auth> {
		return this.http
			.get<Auth>(`${environment.apiUrl}auth`, {
				headers: new HttpHeaders({
					Authorization: `Basic ${btoa(`${environment.user}:${environment.passw}`)}`,
				}),
			})
			.pipe(
				switchMap((tk) => {
					this.setCookie(tk.token, tk.expires_at);
					return new Observable<Auth>((obs) => {
						obs.next(tk);
						obs.complete;
					});
				})
			);
	}

	private getToken() {
		let token = localStorage.getItem("auth_key");
		return token != null ? token : "";
	}

	private checkCookie() {
		let cookie = this.getCookie();

		let auth_k = cookie.auth;
		let auth_exp = cookie.exp;
		let parsed_exp: number | null = typeof auth_exp === "string" ? +auth_exp : null;

		if (!auth_k || (parsed_exp != null && parsed_exp <= Date.now())) {
			return false;
		}
		return true;
	}

	private getCookie() {
		return {
			auth: localStorage.getItem("auth_key"),
			exp: localStorage.getItem("expires_at"),
		};
	}

	private setCookie(tk: string, expiration: number) {
		localStorage.setItem("auth_key", tk);
		localStorage.setItem("expires_at", expiration.toString());
	}
}
