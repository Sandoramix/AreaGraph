import { FormControl } from "@angular/forms";
import { Input, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

export const MY_FORMATS = {
	parse: {
		dateInput: "LL",
	},
	display: {
		dateInput: "YYYY-MM-DD",
		monthYearLabel: "YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "YYYY",
	},
};
@Component({
	selector: "app-daterangepicker",
	templateUrl: "./daterangepicker.component.html",
	styleUrls: ["./daterangepicker.component.css"],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class DaterangepickerComponent implements OnInit {
	formats = MY_FORMATS;

	@Output() datechange: EventEmitter<string> = new EventEmitter();

	@Input() title: string = "Pick a date";
	@Input() date_from: FormControl = new FormControl();
	@Input() date_to: FormControl = new FormControl();
	max_date: Date = new Date();

	onDateInputHandler(ev: any) {
		this.datechange.emit(ev.value);
	}
	constructor() {}

	ngOnInit(): void {}
}
