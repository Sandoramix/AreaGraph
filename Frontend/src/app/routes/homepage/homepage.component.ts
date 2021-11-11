import { HttpRequestService } from './../../services/requests/http-request.service';
import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TitleManagementService } from 'src/app/services/title/title-management.service';




@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

    constructor(private title: TitleManagementService) {
        title.setSubTitle('Home')
    }




}
