import { TitleManagementService } from 'src/app/services/title/title-management.service';

import { Component, OnInit } from '@angular/core';

import * as _moment from 'moment';

@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
	ngOnInit() {}

	constructor(private title: TitleManagementService) {
		title.setSubTitle('Home');
	}
}
