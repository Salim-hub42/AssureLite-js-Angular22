import { Component, inject, input } from '@angular/core';
import { CanActivateFn, Router, RouterLink, Routes } from '@angular/router';

// Domaine volontairement isolé (recettes de cuisine, pas assurance) — sert uniquement
// à isoler la mécanique du routing : liste, détail avec paramètre, guard, lazy loading.

export interface ExempleRecette {
  id: number;
  titre: string;
}

export const EXEMPLE_RECETTES: ExempleRecette[] = [
  { id: 1, titre: 'Tarte aux pommes' },
  { id: 2, titre: 'Ratatouille' },
];

@Component({
  selector: 'app-exemple-liste-recettes',
  imports: [RouterLink],
  template: `
    <ul>
      @for (recette of recettes; track recette.id) {
        <li><a [routerLink]="['/exemple-recettes', recette.id]">{{ recette.titre }}</a></li>
      }
    </ul>
  `,
})
export class ExempleListeRecettes {
  recettes = EXEMPLE_RECETTES;
}

@Component({
  selector: 'app-exemple-recette-detail',
  template: `<p>Recette n°{{ id() }}</p>`,
})
export class ExempleRecetteDetail {
  // toujours une string : un paramètre d'URL n'est jamais typé par Angular
  id = input.required<string>();
}

export const exempleRecetteExisteGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  const existe = EXEMPLE_RECETTES.some((recette) => recette.id === id);
  return existe ? true : router.parseUrl('/exemple-recettes');
};

export const EXEMPLE_ROUTES: Routes = [
  { path: 'exemple-recettes', component: ExempleListeRecettes },
  {
    path: 'exemple-recettes/:id',
    component: ExempleRecetteDetail,
    canActivate: [exempleRecetteExisteGuard],
  },
];
