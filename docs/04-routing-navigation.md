# Module 4 — Routing et navigation, guards

## Objectifs

À la fin de ce module, tu sauras :

- Découper l'application en plusieurs **pages** (routes) au lieu d'un unique composant affiché en dur
- Naviguer avec `routerLink` et savoir quand utiliser la navigation **programmatique** (`Router.navigate`)
- Lire un **paramètre d'URL** (`/contrats/:id`) directement comme un `input()` de composant
- **Charger en différé** (*lazy loading*) une page, pour ne pas tout embarquer dans le bundle initial
- Protéger l'accès à une route avec un **guard**

Ce module ne couvre aucune des 40 méthodes JS de la table de traçabilité — c'est un module purement Angular (routing).

---

## 1. Le problème : une seule "page" en dur

Depuis le Module 2, `app.html` affiche directement `<app-liste-contrats/>` — c'est la seule chose que l'utilisateur peut voir, il n'y a rien d'autre à visiter. Dès qu'on veut une page de détail d'un contrat, une page clients, une page sinistres, il faut un mécanisme pour :

- afficher un composant différent selon l'URL
- naviguer entre ces composants sans recharger toute la page (SPA — *single page application*)
- transmettre des informations via l'URL elle-même (ex : quel contrat afficher)

C'est le rôle du **router** d'Angular.

---

## 2. Déclarer des routes

```ts
// app.routes.ts
import { Routes } from '@angular/router';
import { ListeContrats } from './contrats/liste-contrats/liste-contrats';

export const routes: Routes = [
  { path: 'contrats', component: ListeContrats },
  { path: '', redirectTo: 'contrats', pathMatch: 'full' },
];
```

- `path` : le segment d'URL (sans `/` au début). `path: ''` correspond à la racine (`http://localhost:4200/`).
- `redirectTo` + `pathMatch: 'full'` : si l'URL est exactement vide, redirige vers `contrats`. Sans `pathMatch: 'full'`, Angular redirigerait sur **n'importe quelle** URL commençant par rien (donc tout le temps) — piège classique.
- Ce tableau `routes` est déjà branché dans `app.config.ts` via `provideRouter(routes)` (fait dès le début du projet).

---

## 3. Afficher la page active : `RouterOutlet`

```html
<!-- app.html -->
<router-outlet />
```

`<router-outlet>` est un **emplacement** : Angular y insère le composant correspondant à la route active. C'est pour ça qu'on a mis `<app-liste-contrats/>` en dur jusqu'ici — il va falloir le remplacer par `<router-outlet/>` pour laisser le router décider quoi afficher.

---

## 4. Naviguer : `routerLink`

```html
<a routerLink="/contrats">Voir les contrats</a>
<a [routerLink]="['/contrats', contrat.id]">Détail</a>
```

- `routerLink` remplace `href` : Angular intercepte le clic, change l'URL et met à jour `<router-outlet>` **sans recharger la page** (contrairement à un vrai `<a href="...">`).
- Version avec crochets (`[routerLink]`) : accepte un **tableau** de segments, pratique pour construire une URL avec une variable (`contrat.id`) sans concaténer des chaînes à la main.
- `routerLinkActive="ma-classe"` (pas montré ici) ajoute automatiquement une classe CSS au lien qui correspond à la route actuellement affichée — utile pour un menu de navigation.

Pour naviguer **depuis du code** (après une action, pas un clic sur un lien) :

```ts
private readonly router = inject(Router);

apresValidation(): void {
  this.router.navigate(['/contrats']);
}
```

---

## 5. Paramètres de route

```ts
{ path: 'contrats/:id', component: ContratDetail }
```

Le `:id` est un **segment variable** — `/contrats/3` et `/contrats/42` matchent tous les deux cette route, avec des valeurs différentes.

Façon **moderne** de le lire (celle qu'on utilise dans ce projet) : le paramètre devient directement un `input()` du composant, à condition d'activer `withComponentInputBinding()` :

```ts
// app.config.ts
provideRouter(routes, withComponentInputBinding())
```

```ts
// contrat-detail.ts
export class ContratDetail {
  id = input.required<string>(); // toujours une string : un segment d'URL n'est jamais typé
}
```

Angular assigne automatiquement la valeur du segment `:id` à l'input `id` — **le nom de l'input doit correspondre exactement au nom du paramètre dans `path`**. Pas besoin d'injecter quoi que ce soit dans le composant : c'est le même réflexe que pour un `input()` reçu d'un parent, sauf que "le parent" est ici le router.

> Ancienne façon (que tu croiseras dans d'anciens tutoriels) : injecter `ActivatedRoute` et lire `route.snapshot.paramMap.get('id')`, ou s'abonner à `route.paramMap`. Ça fonctionne toujours, mais `withComponentInputBinding()` est plus simple et cohérent avec le reste du projet (signals partout, pas d'abonnement manuel).

---

## 6. Lazy loading : ne charger une page que si on la visite

```ts
export const routes: Routes = [
  {
    path: 'contrats',
    loadComponent: () => import('./contrats/liste-contrats/liste-contrats').then((m) => m.ListeContrats),
  },
];
```

Au lieu de `component: ListeContrats` (qui oblige à importer la classe en haut du fichier, donc à l'inclure dans le bundle principal), `loadComponent` prend une fonction qui retourne un `import()` **dynamique**. Angular ne télécharge le code de `ListeContrats` **que si l'utilisateur visite `/contrats`** — le bundle de démarrage reste plus léger.

Pour un ensemble de routes liées à une même fonctionnalité (plusieurs pages sinistres, par exemple), l'équivalent est `loadChildren` avec un fichier `*.routes.ts` séparé — même idée, mais pour tout un sous-arbre de routes plutôt qu'un seul composant.

---

## 7. Protéger une route : les guards

Un guard est une fonction appelée **avant** d'activer une route — elle décide si la navigation continue ou non.

```ts
// contrat-existe.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ContratService } from '../services/contrat-service';

export const contratExisteGuard: CanActivateFn = (route) => {
  const contratService = inject(ContratService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  const existe = contratService.contrats().some((c) => c.id === id);
  return existe ? true : router.parseUrl('/contrats');
};
```

```ts
{ path: 'contrats/:id', component: ContratDetail, canActivate: [contratExisteGuard] }
```

- **Fonction**, pas classe — c'est l'écriture moderne (`CanActivateFn`), à préférer aux anciens guards en classe (`CanActivate` interface + service).
- `inject()` fonctionne aussi **ici**, en dehors d'une classe de composant — un guard s'exécute dans un contexte d'injection Angular valide.
- Retourner `true` : la navigation continue normalement.
- Retourner un `UrlTree` (via `router.parseUrl(...)`) : Angular **annule** la navigation prévue et redirige vers cette URL à la place — plus propre qu'un `router.navigate()` manuel suivi d'un `return false`.

---

## Pour la pratique

Objectif du module côté `src/app/` :

1. Remplacer `<app-liste-contrats/>` dans `app.html` par `<router-outlet/>`.
2. Dans `app.routes.ts` : une route `''` qui redirige vers `'contrats'`, une route `'contrats'` qui charge `ListeContrats` en lazy (`loadComponent`).
3. Activer `withComponentInputBinding()` dans `provideRouter(...)` (`app.config.ts`).
4. Créer un composant `ContratDetail` (nouvelle page, un contrat affiché en détail) qui reçoit `id` via `input.required<string>()` depuis la route `'contrats/:id'`.
5. Un lien (`routerLink`) depuis chaque ligne de `ContratLigne` vers `/contrats/:id`.
6. Un guard `contratExisteGuard` sur la route `'contrats/:id'` : redirige vers `/contrats` si aucun contrat ne correspond à l'id.

---

## Ce qu'on ne fait pas encore

- **Resolvers** → Module 7, avec `httpResource`/Resource API (plus naturel une fois qu'on va chercher des données via HTTP)
- **Guard d'authentification réel** → pas de backend/auth encore en place (prévu plus tard, voir `CLAUDE.md`)
- **`canDeactivate`** (ex : "quitter sans sauvegarder ?") → Modules 5-6, une fois qu'il existe un vrai formulaire à protéger
- Pages clients/sinistres → une fois le pattern validé sur les contrats, le même schéma (liste + détail + guard) se répète à l'identique pour les autres entités

Voir la table de suivi complète : [`docs/traçabilité-js.md`](./traçabilité-js.md) (inchangée par ce module).
