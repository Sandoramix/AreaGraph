import { HttpRequestService } from './services/requests/http-request.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { TitleManagementService } from './services/title/title-management.service';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { LinechartComponent } from './components/linechart/linechart.component';
import { LookoutComponent } from './routes/lookout/lookout.component';
import { MapComponent } from './components/map/map.component';
import { DaterangepickerComponent } from './routes/lookout/daterangepicker/daterangepicker.component';

const matModules = [
	MatNativeDateModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatInputModule,
	MatFormFieldModule,
	MomentDateModule,
	MatSelectModule,
];

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		routingComponents,
		LinechartComponent,
		LookoutComponent,
		MapComponent,
  DaterangepickerComponent,
	],
	imports: [
		matModules,
		BrowserModule,
		BrowserAnimationsModule,

		HttpClientModule,
		AppRoutingModule,

		FormsModule,

		NgxEchartsModule.forRoot({
			echarts: () => import('echarts'),
		}),
	],
	providers: [TitleManagementService, HttpRequestService],
	bootstrap: [AppComponent],
})
export class AppModule {}
