import { Sensor } from './../../Sensor';
import { StationHourlyAvg } from './../../StationHourlyAvg';
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
	s: Sensor;
	headers: string[] = ['Created on', 'Average', 'Unit', 'Sensor id', 'Sensor type'];
	stationAvg: StationAvg;
	sHourlyAvg: StationHourlyAvg[] = [];

	max_date: Date = new Date();
	constructor(public req: HttpRequestService, private title: TitleManagementService) {
		title.setSubTitle('Home');

		req.getAllStations().subscribe((res: any) => {
			this.stations = res.stations;
		});
	}

	getStationAvg() {
		let id = this.stations.filter((station) => {
			return station.name == this.selected_station; //this.selected_station;
		})[0].id;
		let d_from = `${this._date_from} 00:00:00.00`;
		let d_to = `${this._date_to} 23:00:00.00`;

		this.req.getStationAvg(id, d_from, d_to).subscribe((stAvg) => {
			this.stationAvg = stAvg;
			this.sHourlyAvg = stAvg.data_hourly_avg;
			this._date_from = '';
			this._date_to = '';
			this.date_from.setValue('');
			this.date_to.setValue('');
		});
	}

	showTable() {
		return this.sHourlyAvg.length > 0;
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
