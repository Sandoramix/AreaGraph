import { DaterangepickerComponent } from "./daterangepicker/daterangepicker.component";
import { MapComponent } from "../../components/map/map.component";
import { LinechartComponent } from "../../components/linechart/linechart.component";

import { HttpRequestService } from "src/app/services/requests/http-request.service";
import { TitleManagementService } from "src/app/services/title/title-management.service";

import {
	ChangeDetectorRef,
	Component,
	OnChanges,
	OnInit,
	ViewChild,
} from "@angular/core";

import { FormControl } from "@angular/forms";

import * as _moment from "moment";

import { StationAvg } from "src/utils/StationAvg";
import { Station } from "src/utils/Station";
import { StationHourlyAvg } from "src/utils/StationHourlyAvg";

@Component({
	selector: "app-lookout",
	templateUrl: "./lookout.component.html",
	styleUrls: ["./lookout.component.css"],
})
export class LookoutComponent implements OnInit {
	selected_station_type: string = "working_stations";

	selected_station: string = "";

	_date_from: string = "";
	_date_to: string = "";

	stations: Station[] = [];

	headers: string[] = [
		"Created on",
		"Average",
		"Unit",
		"Sensor id",
		"Sensor type",
	];

	stationAvg: StationAvg;
	sHourlyAvg: StationHourlyAvg[] | null = null;

	@ViewChild(LinechartComponent) linechart: LinechartComponent;
	@ViewChild(MapComponent) map: MapComponent;
	@ViewChild(DaterangepickerComponent)
	date_range_picker: DaterangepickerComponent;

	constructor(
		public httpRequest: HttpRequestService,
		public title: TitleManagementService,
		private cd: ChangeDetectorRef
	) {
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
		this.selected_station = ev ? ev : "";
		this.sHourlyAvg = [];
	}
	ngOnInit() {}

	getStationHandler() {
		let id = this.stations.filter((station) => {
			return station.name === this.selected_station;
		})[0].id;
		let d_from = `${this._date_from} 00:00:00.00`;
		let d_to = `${this._date_to} 23:00:00.00`;

		this.getStationAvg(id, d_from, d_to);
	}

	getStationAvg(id: number, d_from: string, d_to: string): void {
		this.httpRequest.getStationAvg(id, d_from, d_to).subscribe({
			next: (stAvg) => {
				this.stationAvg = stAvg;
				let tmpAvg = stAvg.data_hourly_avg;
				if (tmpAvg == null || tmpAvg.length == 0) {
					alert(
						`La stazione "${this.selected_station}" non ha nessun valore nel periodo selezionato`
					);
					return;
				}

				this.sHourlyAvg = stAvg.data_hourly_avg;

				this.linechart.updateHandler(this.sHourlyAvg);
				setTimeout(() => {
					let chart = document.getElementById("chart");
					if (chart) chart.scrollIntoView();
				}, 2000);
			},
			error: (err) => {
				alert("Internal server error. Try again later");
				console.warn(err);
			},
		});
	}

	date_fromInputHandler(ev: any): void {
		this._date_from = ev.format(
			this.date_range_picker.formats.display.dateInput
		);
	}

	date_toInputHandler(ev: any): void {
		this._date_to = ev.format(this.date_range_picker.formats.display.dateInput);
	}

	validDates(): boolean {
		if (this._date_from !== "" && this._date_to !== "") return true;
		return false;
	}

	selectHandler() {
		this.sHourlyAvg = [];
	}
}
