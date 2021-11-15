import { EChartsOption } from 'echarts';
import { HttpRequestService } from 'src/app/services/requests/http-request.service';
import { TitleManagementService } from 'src/app/services/title/title-management.service';

import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl } from '@angular/forms';

import * as _moment from 'moment';

import { StationAvg } from 'src/utils/StationAvg';
import { Station } from 'src/utils/Station';
import { StationHourlyAvg } from 'src/utils/StationHourlyAvg';

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
export class HomepageComponent implements OnInit {
	selected_station: string = '';

	date_from: FormControl = new FormControl();
	date_to: FormControl = new FormControl();
	private _date_from: string = '';
	private _date_to: string = '';
	max_date: Date = new Date();

	stations: Station[] = [];

	headers: string[] = ['Created on', 'Average', 'Unit', 'Sensor id', 'Sensor type'];
	stationAvg: StationAvg;
	sHourlyAvg: StationHourlyAvg[] = [];

	constructor(public req: HttpRequestService, private title: TitleManagementService) {
		title.setSubTitle('Home');

		req.getAllStations().subscribe((res: any) => {
			this.stations = res.stations;
		});
	}

	ngOnInit() {
		// this.req.getStationAvg(107, '2021-11-09 00:00:00', '2021-11-09 23:00:00.00').subscribe((stAvg) => {
		// 	this.stationAvg = stAvg;
		// 	this.sHourlyAvg = stAvg.data_hourly_avg;
		// 	//
		// 	this._date_from = '';
		// 	this._date_to = '';
		// 	this.date_from.setValue('');
		// 	this.date_to.setValue('');
		// });
	}

	getStationAvg() {
		let id = this.stations.filter((station) => {
			return station.name === this.selected_station;
		})[0].id;
		let d_from = `${this._date_from} 00:00:00.00`;
		let d_to = `${this._date_to} 23:00:00.00`;
		console.warn(d_from);
		console.warn(d_to);

		this.req.getStationAvg(id, d_from, d_to).subscribe((stAvg) => {
			this.stationAvg = stAvg;
			this.sHourlyAvg = stAvg.data_hourly_avg;
			this._date_from = '';
			this._date_to = '';
			this.date_from.setValue('');
			this.date_to.setValue('');
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

	validDates(): boolean {
		if (this._date_from != '' && this._date_to != '') return true;
		return false;
	}
}
