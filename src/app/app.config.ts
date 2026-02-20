import { ApplicationConfig, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { inject as vercelInject } from '@vercel/analytics'

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      provideAppInitializer(() => {
          vercelInject();

          // 2. Pro tvůj osobní debug raději používej tvůj environment soubor
          console.log('Production mode:', environment.production);
          console.log('isDevMode()', isDevMode());
      }),
  ]
};
