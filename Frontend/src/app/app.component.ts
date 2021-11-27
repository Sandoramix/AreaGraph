import { HttpRequestService } from "src/app/services/requests/http-request.service";
import { TitleManagementService } from "./services/title/title-management.service";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	active_route: string;

	ngOnInit(): void {}

	constructor() {}
}
