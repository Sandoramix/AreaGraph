import { HttpRequestService } from './../../services/requests/http-request.service';
import { Component } from '@angular/core';
import { TitleManagementService } from 'src/app/services/title/title-management.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl } from '@angular/forms';

import * as _moment from 'moment';

import { StationAvg } from 'src/app/StationAvg';
import { Station } from 'src/app/Station';

const moment = _moment;

export const MY_FORMATS = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'YYYY-MM-DD',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};
@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.css'],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class HomepageComponent {
	selected_station: string = '';

	date_from: FormControl = new FormControl();
	date_to: FormControl = new FormControl();
	_date_from: string = '';
	_date_to: string = '';

	stations: Station[] = [];

	stationHourlyAvg: StationAvg;

	max_date: Date = new Date();
	constructor(public req: HttpRequestService, private title: TitleManagementService) {
		title.setSubTitle('Home');

		req.getAllStations().subscribe((res: any) => {
			this.stations = res.stations;
		});
	}

	getStationAvg() {
		let id = this.stations.filter((station) => {
			return station.name == this.selected_station;
		})[0].id;
		console.log(`${this._date_from} 00:00:00\n${this._date_to} 00:00:00`);

		this.req.getStationAvg(id, `${this._date_from} 00:00:00`, `${this._date_to} 00:00:00`).subscribe((stAvg) => {
			console.log(stAvg);

			this.stationHourlyAvg = stAvg;
			this._date_from = '';
			this._date_to = '';
			console.log(this.stationHourlyAvg);
		});
	}

	date_fromInputHandler(event: any) {
		this.date_from.setValue(new Date(event.value));
		this.date_to.setValue('');

		this._date_from = event.value.format(MY_FORMATS.display.dateInput);
	}

	date_toInputHandler(event: any) {
		this.date_to.setValue(new Date(event.value));

		this._date_to = event.value.format(MY_FORMATS.display.dateInput);
	}
	selectedStationHandler(s: any) {
		this.selected_station = s.target.value;
	}

	validDates(): boolean {
		if (this._date_from != '' && this._date_to != '') return true;
		return false;
	}
}
