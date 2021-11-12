import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpRequestService } from './services/requests/http-request.service';

import { TitleManagementService } from './services/title/title-management.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentDateModule } from '@angular/material-moment-adapter';

const datePickerModules = [MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MomentDateModule];

@NgModule({
	declarations: [AppComponent, HeaderComponent, routingComponents],
	imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, datePickerModules],
	providers: [TitleManagementService, HttpRequestService],
	bootstrap: [AppComponent],
})
export class AppModule {}
