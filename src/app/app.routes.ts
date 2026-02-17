import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TaskGeneratorComponent } from './features/task-generator/task-generator.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'app', component: TaskGeneratorComponent },
];
