import { Component, OnInit } from '@angular/core';
import { TitleManagementService } from 'src/app/services/title/title-management.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    constructor(private title: TitleManagementService) {
        title.setSubTitle('About')
    }
    ngOnInit(): void {
    }

}
