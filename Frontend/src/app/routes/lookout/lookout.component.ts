import { FormControl } from "@angular/forms";
import { MY_FORMATS } from "./daterangepicker/daterangepicker.component";
import { MapComponent } from "../../components/map/map.component";
import { LinechartComponent } from "../../components/linechart/linechart.component";

import { HttpRequestService } from "src/app/services/requests/http-request.service";
import { TitleManagementService } from "src/app/services/title/title-management.service";

import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, ViewChild } from "@angular/core";

import * as moment from "moment";

import { Station } from "src/utils/Station";
import { StationHourlyAvg, StationAvg } from "src/utils/Station";

@Component({
	selector: "app-lookout",
	templateUrl: "./lookout.component.html",
	styleUrls: ["./lookout.component.css"],
})
export class LookoutComponent implements OnInit {
	selected_station_type: string = "working_stations";

	selected_station: string = "";

	@ViewChild(LinechartComponent) linechart: LinechartComponent;
	@ViewChild(MapComponent) map: MapComponent;

	stations: Station[] = [];
	currentStation: Station;
	stationAvg: StationAvg;
	sHourlyAvg: StationHourlyAvg[] | null = null;

	date_from: string = "";
	date_to: string = "";

	station_min_date: moment.Moment;
	station_max_date: moment.Moment = moment(new Date());

	date_from_maximum: moment.Moment;
	date_to_minimum: moment.Moment;
	constructor(public httpRequest: HttpRequestService, public title: TitleManagementService, private cd: ChangeDetectorRef) {
		title.setSubTitle("Mappa");
		this.getStations();
	}

	getStations(): void {
		switch (this.selected_station_type) {
			case "working_stations": {
				this.httpRequest.getWorkingStations().subscribe({
					next: (res: any) => {
						this.stations = res.stations;
						this.map.addMarkers(this.stations);
					},
					error: (err) => {
						alert("Errore di connessione... Ritenta piu' tardi");
					},
				});
				break;
			}
			case "all_stations": {
				this.httpRequest.getAllStations().subscribe({
					next: (res: any) => {
						this.stations = res.stations;
						this.stations = this.stations.filter((st) => {
							return st.latitude !== 0 && st.longitude != 0;
						});
						this.map.addMarkers(this.stations);
					},
					error: (err) => {
						alert("Errore di connessione... Ritenta piu' tardi");
					},
				});
				break;
			}
		}
	}
	//
	stationSelectHandler(ev?: string) {
		this.date_from = "";
		this.date_to = "";

		this.sHourlyAvg = [];
		this.station_max_date = moment("");
		this.station_min_date = moment("");

		this.selected_station = ev ? ev : "";

		let st = this.stations.find((st) => {
			return st.name == this.selected_station;
		});

		if (!st) return;
		let id = st.id;
		this.httpRequest.getStation(id).subscribe((st) => {
			this.currentStation = st;
			this.station_min_date = moment(st.min_date);
			this.station_max_date = moment(st.max_date);

			this.date_from_maximum = this.station_max_date;
			this.date_to_minimum = this.station_min_date;
		});
	}

	ngOnInit() {}

	getStationHandler() {
		let id = this.stations.filter((station) => {
			return station.name === this.selected_station;
		})[0].id;
		let d_from = `${this.date_from} 00:00:00.00`;
		let d_to = `${this.date_to} 23:00:00.00`;

		this.getStationAvg(id, d_from, d_to);
	}

	getStationAvg(id: number, d_from: string, d_to: string): void {
		this.httpRequest.getStationAvg(id, d_from, d_to).subscribe({
			next: (stAvg) => {
				this.stationAvg = stAvg;
				let tmpAvg = stAvg.data_hourly_avg;

				if (tmpAvg == null || tmpAvg.length == 0) {
					alert(`La stazione "${this.selected_station}" non ha nessun valore nel periodo selezionato`);
					return;
				}

				this.sHourlyAvg = stAvg.data_hourly_avg;

				this.linechart.updateHandler(this.sHourlyAvg);
			},
			error: (err) => {
				alert("Internal server error. Try again later");
				console.warn(err);
			},
		});
	}

	date_fromInputHandler(ev: any): void {
		this.date_from = this.formatMoment(ev);
		this.date_to_minimum = moment(this.date_from);
	}

	date_toInputHandler(ev: any): void {
		this.date_to = this.formatMoment(ev);
		this.date_from_maximum = moment(this.date_to);
	}

	validDates(): boolean {
		if (this.date_from !== "" && this.date_to !== "" && this.date_from > this.formatMoment(this.station_min_date) && this.date_to < this.formatMoment(this.station_max_date)) return true;
		return false;
	}

	selectHandler() {
		this.sHourlyAvg = [];
	}
	formatMoment(m: moment.Moment): string {
		let out = m.format(MY_FORMATS.display.dateInput);
		return out === "Invalid date" ? "" : out;
	}

	goToChart() {
		let chart = document.getElementById("chart");
		if (chart) chart.scrollIntoView();
	}
}
