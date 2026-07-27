// AssurLite — thème PrimeNG inspiré USAA (navy #1A3258 + gold #B8860B)
// PrimeNG v22 (theming API définie via definePreset sur Aura)
// Package de theming : @primeuix/themes (remplace @primeng/themes depuis PrimeNG v19+)

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AssurLitePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#F4F5F7',
      100: '#DDE0E6',
      200: '#BAC2CD',
      300: '#98A3B4',
      400: '#5F708A',
      500: '#1A3258', // USAA navy
      600: '#162A4B',
      700: '#12233E',
      800: '#0E1C30',
      900: '#0A1423',
      950: '#060C16'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#F7F8FA',
          100: '#EEF0F3',
          200: '#DDE0E6',
          300: '#C4C9D2',
          400: '#98A3B4',
          500: '#5F708A',
          600: '#465773',
          700: '#324259',
          800: '#1E2A3D',
          900: '#101826',
          950: '#080C13'
        },
        primary: {
          color: '#1A3258',
          contrastColor: '#ffffff',
          hoverColor: '#12233E',
          activeColor: '#0E1C30'
        },
        highlight: {
          background: '#1A3258',
          focusBackground: '#12233E',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#101826',
          100: '#1E2A3D',
          200: '#324259',
          300: '#465773',
          400: '#5F708A',
          500: '#98A3B4',
          600: '#C4C9D2',
          700: '#DDE0E6',
          800: '#EEF0F3',
          900: '#F7F8FA',
          950: '#ffffff'
        },
        primary: {
          color: '#98A3B4',
          contrastColor: '#0A1423',
          hoverColor: '#BAC2CD',
          activeColor: '#DDE0E6'
        },
        highlight: {
          background: 'rgba(152,163,180,.16)',
          focusBackground: 'rgba(152,163,180,.24)',
          color: '#EEF0F3',
          focusColor: '#EEF0F3'
        }
      }
    }
  }
});

// Accent "gold" (USAA), à utiliser pour badges/CTA secondaires,
// pas géré nativement par le token 'primary' de PrimeNG → variable custom.
export const AssurLiteGold = {
  50: '#FBF9F3',
  100: '#F4EDDA',
  200: '#EADBB6',
  300: '#DFC991',
  400: '#CDAA54',
  500: '#B8860B',
  600: '#9C7209',
  700: '#815E08',
  800: '#654A06',
  900: '#4A3604',
  950: '#2E2203'
};
