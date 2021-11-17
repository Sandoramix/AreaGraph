import { LinechartComponent } from './../../components/linechart/linechart.component';
import { EChartsOption } from 'echarts';
import { HttpRequestService } from 'src/app/services/requests/http-request.service';
import { TitleManagementService } from 'src/app/services/title/title-management.service';

import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
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
	sHourlyAvg: StationHourlyAvg[] | null = null;

	@ViewChild(LinechartComponent) linechart: LinechartComponent;

	constructor(public req: HttpRequestService, private title: TitleManagementService, private cd: ChangeDetectorRef) {
		title.setSubTitle('Home');

		req.getAllStations().subscribe({
			next: (res: any) => {
				this.stations = res.stations;
			},
			error: (err) => {
				alert('Connection error... Try again later.');
				//location.reload();
			},
		});
	}

	ngOnInit() {}

	getStationAvg(): void {
		let id = this.stations.filter((station) => {
			return station.name === this.selected_station;
		})[0].id;
		let d_from = `${this._date_from} 00:00:00.00`;
		let d_to = `${this._date_to} 23:00:00.00`;

		this.req.getStationAvg(id, d_from, d_to).subscribe({
			next: (stAvg) => {
				this.stationAvg = stAvg;
				let tmpAvg = stAvg.data_hourly_avg;
				if (tmpAvg == null || tmpAvg.length == 0) {
					alert("This station doesn't have any records in this date range");
					return;
				}
				this.sHourlyAvg = stAvg.data_hourly_avg;
				this._date_from = '';
				this._date_to = '';
				this.date_from.setValue('');
				this.date_to.setValue('');
				this.linechart.updateHandler(this.sHourlyAvg);
			},
			error: (err) => {
				alert('Internal server error. Try again later');
				console.warn(err);
			},
		});
	}

	date_fromInputHandler(event: any): void {
		this.date_from.setValue(new Date(event.value));
		if (this.date_from.value > this.date_to.value) {
			this.date_to.setValue('');
		}

		this._date_from = event.value.format(MY_FORMATS.display.dateInput);
	}

	date_toInputHandler(event: any): void {
		this.date_to.setValue(new Date(event.value));

		this._date_to = event.value.format(MY_FORMATS.display.dateInput);
	}

	validDates(): boolean {
		if (this._date_from !== '' && this._date_to !== '') return true;
		return false;
	}

	selectHandler() {
		this.sHourlyAvg = [];
	}
}
