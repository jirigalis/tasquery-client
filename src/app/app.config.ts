import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { inject as vercelInject } from '@vercel/analytics';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      {
          provide: ErrorHandler,
          useValue: Sentry.createErrorHandler(),
      },
      {
          provide: Sentry.TraceService,
          deps: [Router]
      },
      provideAppInitializer(() => {
          vercelInject();
          inject(Sentry.TraceService);
      }),
  ]
};
