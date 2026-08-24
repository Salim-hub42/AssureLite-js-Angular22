import { Routes } from '@angular/router';


export const routes: Routes = [
   {path: 'contrats' , 
      loadComponent: () => import('./contrats/liste-contrats/liste-contrats').then((m) => m.ListeContrats)
   },
   {path: '' , redirectTo: 'contrats' , pathMatch:'full'},
];
