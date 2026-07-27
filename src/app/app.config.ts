import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AssurLitePreset } from './theme/assurlite-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: AssurLitePreset,
        options: { darkModeSelector: '.dark' }
      },
       license: 'eyJpZCI6IjNhZTAyMzI1LTEwM2QtNDc5Ny05NjllLTg1OTgzY2QyNjZmNiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODUxNTY2MjcsImV4cCI6MTgxNjY5MjYyN30.sQCLKc-2U_G_Vjs9Cy6dLOv9bD57K-ZIQ0lZ_M-WitX0jdoucepFC06CvlAQj5N5gTswy-54oRG7WDoqzAHrCw'
    })
  ]
};
