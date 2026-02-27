import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { environment } from '../environments/environment';

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
        console.log('is production:', environment.production);
        throw new Error('Sentry app.component error test');
    }
}
