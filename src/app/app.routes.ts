import { Routes } from '@angular/router';
import { contratExisteGuard } from './guards/contrat-existe.guard';


export const routes: Routes = [
   {path: 'contrats' , 
      loadComponent: () => import('./contrats/liste-contrats/liste-contrats').then((m) => m.ListeContrats)
   },
   {path: 'contrats/:id' ,
      canActivate: [contratExisteGuard],
      loadComponent: () => import('./contrats/contrat-detail/contrat-detail').then((m) => m.ContratDetail)
   },
   {path: '' , redirectTo: 'contrats' , pathMatch:'full'},
];
