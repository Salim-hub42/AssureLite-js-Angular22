import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { AssurLitePreset } from './theme/assurlite-preset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: AssurLitePreset,
        options: { darkModeSelector: '.dark' },
      },
      license:
        'eyJpZCI6IjNhZTAyMzI1LTEwM2QtNDc5Ny05NjllLTg1OTgzY2QyNjZmNiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODUxNTY2MjcsImV4cCI6MTgxNjY5MjYyN30.sQCLKc-2U_G_Vjs9Cy6dLOv9bD57K-ZIQ0lZ_M-WitX0jdoucepFC06CvlAQj5N5gTswy-54oRG7WDoqzAHrCw',
    }),
  ],
};
