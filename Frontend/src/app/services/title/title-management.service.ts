import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class TitleManagementService {
	constructor(private titleSevice: Title) { }

	setMainTitle(title: string): void {
		this.titleSevice.setTitle(title);
	}
	setSubTitle(sub: string): void {
		this.titleSevice.setTitle(this.getTitle() + ' - ' + sub);
	}
	getTitle(): string {
		return this.titleSevice.getTitle();
	}
}
