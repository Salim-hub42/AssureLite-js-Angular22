import { Routes } from '@angular/router';
import { contratExisteGuard } from './guards/contrat-existe.guard';


export const routes: Routes = [
   {path: 'contrats' , 
      loadComponent: () => import('./contrats/liste-contrats/liste-contrats').then((m) => m.ListeContrats)
   },
   {
      path: 'contrats/nouveau' , 
      loadComponent: () => import('./contrats/souscription-contrat/souscription-contrat').then((m) => m.SouscriptionContrat)
   },
      {
      path: 'contrats/nouveau-signal' , 
      loadComponent: () => import('./contrats/souscription-contrat-signal/souscription-contrat-signal').then((m) => m.SouscriptionContratSignal)
   },
   {path: 'contrats/:id' ,
      canActivate: [contratExisteGuard],
      loadComponent: () => import('./contrats/contrat-detail/contrat-detail').then((m) => m.ContratDetail)
   },
   {path: '' , redirectTo: 'contrats' , pathMatch:'full'},
];
