import { HttpRequestService } from './../../services/requests/http-request.service';
import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';




@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

    constructor(private req: HttpRequestService) {

    }


    getStations() {
        this.req.getAllStations().subscribe((response: any) => {
            console.log(response);

        })
    }

}
