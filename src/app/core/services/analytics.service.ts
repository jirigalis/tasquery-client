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

    trackLockedFeatureClick(source: string, action: string): void {
        this.trackEvent('login_prompt_shown', {
            source_component: source,
            feature_action: action
        });
    }

    identifyUser(userId: string): void {
        if (!this.gaMeasurementId) return;

        try {
            gtag('config', this.gaMeasurementId, {
                'user_id': userId
            });
        } catch (error) {
            console.error('[Analytics] Error identifying user', error);
        }
    }

    clearUser(): void {
        if (!this.gaMeasurementId) return;

        try {
            gtag('config', this.gaMeasurementId, {
                'user_id': undefined
            });
        } catch (error) {
            console.error('[Analytics] Error clearing user', error);
        }
    }
}
