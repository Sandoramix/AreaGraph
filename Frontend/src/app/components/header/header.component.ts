import { TitleManagementService } from './../../services/title/title-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})



export class HeaderComponent implements OnInit {
    referLinks: PageInformation[] = [
        { title: 'Home', link: ['/home', '/'], value: 'Home' },
        { title: 'Lookout', link: ['/lookout'], value: 'Start looking for zones' },
        { title: 'About', link: ['/about'], value: 'About us' }
    ]

    getReferByTitle(t: string): PageInformation {
        return this.referLinks.filter((obj: PageInformation) => {
            return obj.title.toLowerCase() === t.toLowerCase();
        })[0]
    }

    getReferLinks(): PageInformation[] {
        return this.referLinks
    }
    constructor(public titleService: TitleManagementService) {
    }

    ngOnInit(): void {

    }

}
interface PageInformation {
    title: string
    link: string[] | string
    value: string
}