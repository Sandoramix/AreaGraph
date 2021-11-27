import { Input } from "@angular/core";
import { TitleManagementService } from "./../../services/title/title-management.service";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
	@Input() center_div: string;

	referLinks: PageInformation[] = [
		{ title: "Home", link: "/home", value: "Home" },
		{ title: "Map", link: "/map", value: "Mappa" },
		{ title: "About", link: "/about", value: "About us" },
	];

	getReferLinks(): PageInformation[] {
		return this.referLinks;
	}
	constructor(public titleService: TitleManagementService) {}

	ngOnInit(): void {}
}
interface PageInformation {
	title: string;
	link: string;
	value: string;
}
