import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { inject as vercelInject } from '@vercel/analytics';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(
          withInterceptors([authInterceptor])
      ),
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
