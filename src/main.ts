import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/angular';
import { environment } from './environments/environment';

Sentry.init({
    dsn: environment.sentryDsn,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
        /NG04002/,
        'Cannot match any routes',
        'HttpErrorResponse: 404',
    ],
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
