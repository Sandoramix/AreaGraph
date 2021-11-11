import { TitleManagementService } from './../../services/title/title-management.service';
import { Station } from './../../Station';
import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/requests/http-request.service';

@Component({
    selector: 'app-lookout',
    templateUrl: './lookout.component.html',
    styleUrls: ['./lookout.component.css']
})
export class LookoutComponent implements OnInit {

    selected: string;


    constructor(public req: HttpRequestService, private title: TitleManagementService) {
        title.setSubTitle('Lookout')
        this.req.getAllStations()

    }

    ngOnInit(): void {

    }


    getStations() {

    }
}
