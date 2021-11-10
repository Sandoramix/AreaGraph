import { HttpRequestService } from './services/requests/http-request.service';

import { TitleManagementService } from './services/title/title-management.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        routingComponents,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [TitleManagementService, HttpRequestService],
    bootstrap: [AppComponent]
})
export class AppModule { }
