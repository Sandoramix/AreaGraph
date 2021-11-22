import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleManagementService {
	mainTitle: string;

	constructor(private titleSevice: Title) {
		this.mainTitle = titleSevice.getTitle();
	}

	setMainTitle(title: string): void {
		this.mainTitle = title;
		this.titleSevice.setTitle(title);
	}

	setSubTitle(sub: string): void {
		this.titleSevice.setTitle(`${this.mainTitle} - ${sub}`);
	}

	getMainTitle(): string {
		return this.mainTitle;
	}
	getSubTitle(): string {
		let pageTitle: string = this.getPageTitle();
		return pageTitle.includes('-') ? pageTitle.split(' - ')[1] : '';
	}
	getPageTitle(): string {
		return this.titleSevice.getTitle();
	}
}
