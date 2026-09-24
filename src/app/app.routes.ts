import { Routes } from '@angular/router';
import { contratExisteGuard } from './guards/contrat-existe.guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    // Route parente sans composant : authGuard protège tous les enfants, à chaque navigation
    path: 'contrats',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./contrats/liste-contrats/liste-contrats').then((m) => m.ListeContrats),
      },
      {
        path: 'nouveau',
        loadComponent: () =>
          import('./contrats/souscription-contrat/souscription-contrat').then(
            (m) => m.SouscriptionContrat,
          ),
      },
      {
        path: 'nouveau-signal',
        loadComponent: () =>
          import('./contrats/souscription-contrat-signal/souscription-contrat-signal').then(
            (m) => m.SouscriptionContratSignal,
          ),
      },
      {
        path: ':id',
        canActivate: [contratExisteGuard], // authGuard déjà vérifié par le parent
        loadComponent: () =>
          import('./contrats/contrat-detail/contrat-detail').then((m) => m.ContratDetail),
      },
    ],
  },
  { path: '', redirectTo: 'contrats', pathMatch: 'full' },
];
