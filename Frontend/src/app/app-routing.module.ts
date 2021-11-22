import { LookoutComponent } from './routes/lookout/lookout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './routes/about/about.component';
import { HomepageComponent } from './routes/homepage/homepage.component';

const routes: Routes = [
	{ path: '', component: HomepageComponent },
	{ path: 'home', component: HomepageComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'map', component: LookoutComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [HomepageComponent, AboutComponent, LookoutComponent];
