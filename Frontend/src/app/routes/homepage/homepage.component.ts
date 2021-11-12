import { HttpRequestService } from './../../services/requests/http-request.service';
import { Component } from '@angular/core';
import { TitleManagementService } from 'src/app/services/title/title-management.service';




@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

    selected: string;

    constructor(public req: HttpRequestService, private title: TitleManagementService) {
        title.setSubTitle('Home')
        this.req.getAllStations()
    }




}
