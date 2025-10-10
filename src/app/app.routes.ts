import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TasqueryComponent } from './pages/tasquery/tasquery.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'app', component: TasqueryComponent },
];
