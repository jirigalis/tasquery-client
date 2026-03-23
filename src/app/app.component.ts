import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        ToastComponent
    ],
    styleUrl: './app.component.css'
})
export class AppComponent {

    constructor() {
        inject(AnalyticsService).init();
    }
}
