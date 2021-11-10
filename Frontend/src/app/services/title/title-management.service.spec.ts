import { TestBed } from '@angular/core/testing';

import { TitleManagementService } from './title-management.service';

describe('TitleManagementService', () => {
	let service: TitleManagementService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TitleManagementService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
