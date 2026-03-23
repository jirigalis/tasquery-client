import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { filter } from 'rxjs';

// Tell TypeScript that the `gtag` function is available globally
declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
    private readonly router = inject(Router);
    private readonly gaMeasurementId = environment.gaMeasurementId;

    init(): void {
        if (!this.gaMeasurementId) {
            return;
        }

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(event => {
            gtag('event', 'page_view', {
                page_path: event.urlAfterRedirects
            });
        });
    }

    /**
     * Track a custom event with optional parameters
     *
     * @param eventName
     * @param eventParams
     */
    trackEvent(eventName: string, eventParams: Record<string, any> = {}): void {
        if (!this.gaMeasurementId) return;

        try {
            gtag('event', eventName, eventParams);
        } catch (error) {
            console.error('[Analytics] Error tracking event', error);
        }
    }

    trackLogin(featureName: string): void {
        this.trackEvent('login', { feature: featureName });
    }
}
