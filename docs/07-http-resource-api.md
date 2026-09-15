# Module 7 — HttpClient, Resource API, promesses & JSON

## Objectifs

À la fin de ce module, tu sauras :

- Monter un **faux backend** REST avec `json-server` et brancher l'app dessus
- Enregistrer `HttpClient` (`provideHttpClient`) et faire des requêtes `GET` / `POST` / `PUT` / `DELETE`
- Manipuler un **`Observable`** directement : `.subscribe()`, `.pipe()`, les opérateurs `map` / `filter` / `tap` / `catchError` / `finalize` / `debounceTime` / `distinctUntilChanged` / `switchMap`
- Passer d'un **`Observable`** à une **`Promise`** (`firstValueFrom`) ou à un **signal** (`toSignal`), et savoir lequel choisir
- Utiliser **`resource()`** : de l'asynchrone réactif avec états `loading` / `error` / `reload` / annulation
- Utiliser **`httpResource()`** : la version déclarative d'une requête HTTP pilotée par des signals — et connaître **`rxResource()`**, sa variante RxJS
- Écrire un **intercepteur fonctionnel** (`HttpInterceptorFn`) : ajouter un en-tête d'auth, logguer
- Persister une **session** avec `localStorage` + `JSON.stringify` / `JSON.parse`
- Envoyer/relire des **dates** (`toISOString`), parser des **nombres** (`parseInt` / `parseFloat`)
- Valider la **forme** d'une réponse serveur (`Object.hasOwn`)
- Mettre en cache des calculs avec une **`Map`**

> `resource` et `httpResource` sont `@publicApi 22.0` — stables dans cette version (22.0.x ici). `httpResource` vit dans `@angular/common/http`, `resource`/`rxResource` dans `@angular/core` (`rxResource` dans `@angular/core/rxjs-interop`).
> `json-server` est un **faux** backend : aucune sécurité, aucune règle métier. L'authentification qu'on met en place est **pédagogique**, pas utilisable en production (voir l'encadré §16).

Ce module **fait avancer** la table de traçabilité : ~14 lignes cochées (`then` / `catch` / `finally`, `JSON.parse` / `JSON.stringify`, `toISOString`, `parseInt` / `parseFloat`, `Object.hasOwn`, `Map.set` / `get` / `has` / `delete` / `clear`). Après lui il ne restera que les méthodes de **chaînes** (Module 8) et `pop` / `shift` / `unshift`.

> Les opérateurs RxJS (§4-6) ne sont **pas** des méthodes JS natives — ils viennent de la librairie `rxjs`, pas du langage. Ils ne comptent donc pas dans les 40 méthodes de `docs/traçabilité-js.md`, mais font partie de la couverture Angular attendue du module.

---

## 1. Sortir des mocks : un faux backend avec `json-server`

Jusqu'ici les données vivent dans le code : `signal<Contrat[]>(CONTRATS_MOCKS)`. Une vraie app interroge un serveur. `json-server` transforme un simple fichier JSON en API REST complète.

```bash
npm install -D json-server@0.17.4
```

> **Version pinnée volontairement.** `npm install -D json-server` sans version installe aujourd'hui la **v1 (beta)** — elle génère des `id` en **string aléatoire** sur `POST` (incompatible avec `id: number` utilisé dans tous les modèles de ce projet) et remplace `_like` par une syntaxe `champ:contains=` sans rétrocompatibilité (`?nom_like=sal` y renvoie silencieusement `[]`, jamais une erreur). La `0.17.4` est la dernière version « classique » stable : id auto-incrémentés en number, syntaxe `_like`/`_gte`/… inchangée — c'est elle qu'on utilise dans tout ce module.

`db.json` à la racine (on reprend les mocks — les dates deviennent du **texte** ISO, un serveur ne connaît pas l'objet `Date` de JS) :

```json
{
  "clients": [
    { "id": 1, "nom": "Salim", "email": "sksnumerique@gmail.com", "dateNaissance": "1990-07-17" }
  ],
  "contrats": [
    {
      "id": 1,
      "clientId": 1,
      "type": "auto",
      "statut": "actif",
      "prime": 50,
      "dateDebut": "2023-01-15"
    }
  ],
  "sinistres": [],
  "users": [{ "id": 1, "email": "salim@assurlite.fr", "password": "demo1234", "nom": "Salim" }]
}
```

Script dans `package.json` :

```json
"api": "json-server db.json --port 3000 --watch"
```

> `--watch` est nécessaire en `0.17.x` pour que `json-server` recharge les données si `db.json` est modifié à la main pendant qu'il tourne (la v1 le fait par défaut, mais on est sur `0.17.4`, cf. encadré ci-dessus).

Ça te donne gratuitement :

| Requête                                 | Effet                                |
| --------------------------------------- | ------------------------------------ |
| `GET /contrats`                         | toute la liste                       |
| `GET /contrats/1`                       | un élément (404 si absent)           |
| `GET /contrats?clientId=1`              | filtre par champ                     |
| `GET /clients?nom_like=sal`             | recherche « contient » (utile en §6) |
| `POST /contrats`                        | crée — **le serveur génère l'`id`**  |
| `PUT /contrats/1` / `PATCH /contrats/1` | remplace / fusionne                  |
| `DELETE /contrats/1`                    | supprime                             |

Le `POST` qui génère l'`id` règle enfin le bricolage `id: this._contrats().length + 1` traîné depuis le Module 2.

---

## 2. Enregistrer `HttpClient` : `provideHttpClient()`

Dans `app.config.ts`, à côté des autres providers :

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { logInterceptor } from './interceptors/log.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // …existant…
    provideHttpClient(
      withInterceptors([authInterceptor, logInterceptor]), // ordre = ordre d'exécution
    ),
  ],
};
```

> **Pas de `withFetch()`.** Vérifié dans les typings installés (Angular 22.0.7) : `withFetch` est **`@deprecated`** — *« not required anymore. `FetchBackend` is the default `HttpBackend` »*. En v22, `fetch` est déjà le backend par défaut de `HttpClient` ; l'opt-in existe maintenant dans l'autre sens, avec `withXhr()` pour revenir à l'ancien `XMLHttpRequest` si un jour c'est nécessaire.
>
> Ces deux intercepteurs (`authInterceptor`, `logInterceptor`) ne sont écrits qu'au §10/§16 — à ce stade du module tu peux commencer avec `provideHttpClient()` tout seul, et rajouter `withInterceptors([...])` une fois qu'ils existent (voir le checklist « Pour la pratique », étape 2 vs étape 8).

Une base d'URL centralisée, pour ne pas répéter `http://localhost:3000` partout :

```ts
// src/app/core/api.ts
export const API = 'http://localhost:3000';
```

---

## 3. `HttpClient` : les quatre verbes

```ts
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { API } from '../core/api';

export class ExempleAppel {
  private readonly http = inject(HttpClient);

  // Le générique <T> dit "je m'attends à recevoir ça". C'est un cast, pas une validation.
  lister() {
    return this.http.get<Contrat[]>(`${API}/contrats`);
  }

  unContrat(id: number) {
    return this.http.get<Contrat>(`${API}/contrats/${id}`);
  }

  creer(corps: Omit<Contrat, 'id'>) {
    return this.http.post<Contrat>(`${API}/contrats`, corps);
  }

  modifier(id: number, patch: Partial<Contrat>) {
    return this.http.patch<Contrat>(`${API}/contrats/${id}`, patch);
  }

  supprimer(id: number) {
    return this.http.delete<void>(`${API}/contrats/${id}`);
  }
}
```

Deux points :

- Chaque méthode renvoie un **`Observable`**. Tant que personne ne s'y abonne, **rien ne part** (un `Observable` HTTP est « froid »). Voyons d'abord ce que c'est (§4-6) avant de choisir comment en sortir : conversion (§7) ou `httpResource` (§9).
- La sérialisation JSON est **automatique** dans les deux sens. Pas de `JSON.parse` sur la réponse, pas de `JSON.stringify` sur le corps — `HttpClient` s'en charge.

---

## 4. L'Observable : un flux, pas une valeur unique

Une **`Promise`** se règle **une fois** (résolue ou rejetée), même si personne ne la regarde. Un **`Observable`** :

- est **froid** (« lazy ») : tant que personne ne s'abonne, **rien ne s'exécute** — chaque `.subscribe()` relance tout depuis zéro ;
- peut émettre **0, 1 ou plusieurs valeurs** dans le temps (pas seulement une réponse HTTP : une frappe clavier, un WebSocket, un minuteur…) ;
- peut être **annulé** (`unsubscribe()`), ce qu'une `Promise` ne sait pas faire.

```ts
const abonnement = this.http.get<Contrat[]>(`${API}/contrats`).subscribe({
  next: (contrats) => this.contrats.set(contrats), // la/les valeur(s) émise(s)
  error: (err) => this.erreur.set('Échec'), // le pendant de .catch — next OU error, jamais les deux pour du HTTP
  complete: () => console.log('terminé'), // pas d'équivalent Promise : signale la fin du flux
});

// à faire toi-même si tu t'abonnes à la main en dehors d'un contexte qui se détruit proprement
abonnement.unsubscribe();
```

En pratique, on `.subscribe()` très rarement à la main dans AssurLite (§7-9 s'en chargent) — mais quand c'est justifié (un effet de bord ponctuel), ça se fait dans un **contexte d'injection**, nettoyé avec `takeUntilDestroyed()` plutôt qu'un `unsubscribe()` géré à la main :

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

constructor() {
  this.http
    .get<Contrat[]>(`${API}/contrats`)
    .pipe(takeUntilDestroyed())
    .subscribe((contrats) => this.contrats.set(contrats));
}
```

---

## 5. `.pipe()` et les opérateurs de base

`.pipe()` **transforme le flux sans s'y abonner** — les opérateurs s'enchaînent comme des méthodes de tableau, mais sur des valeurs qui arrivent dans le temps.

| Opérateur        | Rôle                                                               | Équivalent déjà connu     |
| ---------------- | ------------------------------------------------------------------ | ------------------------- |
| `map(fn)`        | transforme chaque valeur émise                                     | `Array.prototype.map`     |
| `filter(fn)`     | ne laisse passer que certaines valeurs                             | `Array.prototype.filter`  |
| `tap(fn)`        | effet de bord **sans** changer la valeur (log, drapeau chargement) | `Array.prototype.forEach` |
| `catchError(fn)` | équivalent Observable de `.catch()`                                | `.catch()`                |
| `finalize(fn)`   | équivalent Observable de `.finally()`                              | `.finally()`              |

```ts
import { catchError, finalize, map, of, tap } from 'rxjs';

this.http.get<ContratDTO[]>(`${API}/contrats`).pipe(
  tap({ subscribe: () => this.chargement.set(true) }), // AVANT le départ de la requête
  map((dtos) => dtos.map(versContrat)), // DTO[] → Contrat[] (§12)
  catchError(() => of([] as Contrat[])), // erreur → flux de remplacement plutôt que planter
  finalize(() => this.chargement.set(false)), // quoi qu'il arrive
);
```

⚠️ Deux pièges :

- `catchError` doit renvoyer un **`Observable`** (`of(valeurDeSecours)`, ou relancer l'erreur avec `throwError(() => err)`), contrairement à `.catch()` qui reçoit et renvoie une **valeur**. Renvoyer une valeur nue est une erreur de type.
- `tap(fn)` avec une fonction **nue** utilise `fn` comme handler `next` — il ne s'exécute qu'à la **réception d'une valeur**, pas à l'abonnement. Pour un drapeau « chargement » posé **avant** que la requête parte, il faut la forme objet et son callback `subscribe` : `tap({ subscribe: () => … })`. Avec `tap(() => …)` seul, `chargement` passerait à `true` puis `false` quasi simultanément, à la réception de la réponse — inutile pour un indicateur de chargement.

---

## 6. Combiner les opérateurs : une recherche en direct

Le cas où RxJS reste **irremplaçable** face à `httpResource` : une recherche qui se déclenche à la frappe, sans spammer le serveur et sans laisser une réponse lente écraser une réponse récente.

```ts
import { computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

export class RechercheClient {
  private readonly http = inject(HttpClient);

  readonly terme = signal(''); // relié à un <input> via (input) ou [(ngModel)]

  private readonly resultats$ = toObservable(this.terme).pipe(
    debounceTime(300), // attend 300 ms de silence dans la frappe
    distinctUntilChanged(), // ignore si le terme "debouncé" n'a pas changé
    switchMap((terme) =>
      terme.trim() === ''
        ? of([] as Client[]) // rien à chercher → flux de remplacement immédiat
        : this.http
            .get<Client[]>(`${API}/clients`, { params: { nom_like: terme } })
            .pipe(catchError(() => of([] as Client[]))),
    ),
  );

  readonly resultats = toSignal(this.resultats$, { initialValue: [] as Client[] });
}
```

- **`toObservable(this.terme)`** : le pont **signal → Observable** (l'inverse de `toSignal`), pour pouvoir enchaîner des opérateurs sur un signal.
- **`debounceTime(300)`** : sans lui, une requête part à **chaque lettre tapée**.
- **`distinctUntilChanged()`** : si l'utilisateur retape le même terme après une pause, on ne relance rien.
- **`switchMap`** — le point clé : transforme chaque terme en un **nouvel** Observable (l'appel HTTP), et **annule automatiquement le précédent** si un nouveau terme arrive avant que la réponse soit là. Sans ça, une réponse lente pour `"sal"` pourrait arriver **après** la réponse rapide pour `"salim"` et écraser le bon résultat par un résultat obsolète — le même bug que `resource()` règle avec `abortSignal` (§8), ici géré par l'opérateur.
- **`toSignal(...)`** : on ressort du monde Observable pour retrouver un signal, lisible directement dans le template (`{{ resultats().length }}`).

> Cette recherche n'est **pas obligatoire** dans la pratique AssurLite — elle est proposée en bonus (voir « Pour la pratique »). Retiens surtout le trio `debounceTime` + `distinctUntilChanged` + `switchMap` : il revient dans presque toute recherche réactive, dans n'importe quel projet Angular.

---

## 7. Sortir de l'Observable : vers une `Promise` ou un signal

Maintenant que tu sais ce qu'est un Observable (§4-6), voici **quand le quitter** plutôt que d'enchaîner des opérateurs :

| Outil                              | Quand                                                                                 | Résultat             |
| ---------------------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| `toSignal(obs$, { initialValue })` | flux affiché dans un template (déjà vu Module 5)                                      | `Signal<T>`          |
| `firstValueFrom(obs$)`             | **une** valeur ponctuelle, dans une fonction `async` (submit, login)                  | `Promise<T>`         |
| `httpResource(...)` (§9)           | lecture réactive avec états loading/error, sans écrire d'opérateur                    | `HttpResourceRef<T>` |
| `.subscribe()` + `.pipe()` (§4-6)  | un flux qui vit plus longtemps qu'un composant, ou qui a vraiment besoin d'opérateurs | `Subscription`       |

C'est via `firstValueFrom` que les promesses — donc **`then` / `catch` / `finally`** — entrent naturellement :

```ts
import { firstValueFrom } from 'rxjs';

rafraichir(): void {
  this.chargement.set(true);
  firstValueFrom(this.http.get<Contrat[]>(`${API}/contrats`))
    .then((contrats) => this.contrats.set(contrats))     // succès
    .catch((err: unknown) => this.erreur.set('Chargement impossible')) // échec (réseau, 4xx, 5xx)
    .finally(() => this.chargement.set(false));          // dans tous les cas
}
```

- `.then(v => …)` : reçoit la valeur résolue.
- `.catch(e => …)` : attrape **toute** erreur en amont (rejet réseau, `HttpErrorResponse` sur un statut ≥ 400…). Type `unknown` — on ne suppose pas la forme.
- `.finally(() => …)` : s'exécute succès **ou** échec, ne reçoit rien — parfait pour baisser un drapeau « chargement ».

> Avec `httpResource` (§9) tu n'écris quasiment plus ce trio : `.isLoading()`, `.error()`, `.reload()` le font pour toi. Le trio reste utile pour une **action** (connexion, envoi de formulaire), pas pour une donnée affichée en continu.

---

## 8. `resource()` : de l'asynchrone réactif, géré

`toSignal` te donne « la dernière valeur ». `resource()` te donne **la dernière valeur + l'état de chargement + les erreurs + le rechargement + l'annulation de la requête précédente**.

```ts
import { resource, signal } from '@angular/core';

readonly clientId = signal(1);

readonly clientRes = resource({
  // params : fonction RÉACTIVE — relit clientId() ; à chaque changement, loader relancé
  params: () => ({ id: this.clientId() }),

  // loader : renvoie une Promise ; abortSignal annule la requête devenue obsolète
  loader: async ({ params, abortSignal }) => {
    const rep = await fetch(`${API}/clients/${params.id}`, { signal: abortSignal });
    if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
    return (await rep.json()) as Client; // .json() = une Promise → then implicite via await
  },

  defaultValue: undefined,
});
```

Ce que `clientRes` expose (tout est signal) :

| Membre                             | Type                                                                     | Rôle                                             |
| ---------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `clientRes.value()`                | `Client \| undefined`                                                    | la valeur (ou `defaultValue` tant que ça charge) |
| `clientRes.status()`               | `'idle' \| 'loading' \| 'reloading' \| 'resolved' \| 'error' \| 'local'` | l'état                                           |
| `clientRes.isLoading()`            | `boolean`                                                                | charge (1er chargement **ou** reload)            |
| `clientRes.error()`                | `Error \| undefined`                                                     | la dernière erreur                               |
| `clientRes.hasValue()`             | `boolean`                                                                | y a-t-il une valeur exploitable                  |
| `clientRes.reload()`               | `boolean`                                                                | relance le loader manuellement                   |
| `clientRes.set(v)` / `.update(fn)` |                                                                          | pose une valeur locale (état `'local'`)          |

Le `abortSignal` est la clé : si `clientId` passe de `1` à `2` pendant que la requête pour `1` est en vol, Angular **annule** la première — pas de réponse en retard qui écrase la bonne (le même bug que `switchMap` règle au §6).

Template :

```html
@if (clientRes.isLoading()) {
<p>Chargement…</p>
} @else if (clientRes.error()) {
<p role="alert">Erreur : {{ clientRes.error()?.message }}</p>
} @else if (clientRes.hasValue()) {
<p>{{ clientRes.value()?.nom }}</p>
}
```

---

## 9. `httpResource()` : le raccourci HTTP déclaratif

`httpResource` = `resource` **+ `HttpClient`** : tu n'écris plus le `loader`, juste l'URL (réactive). Les intercepteurs (§10) s'appliquent, contrairement au `fetch` brut du §8.

```ts
import { httpResource } from '@angular/common/http';

// forme courte : une URL, recalculée quand un signal lu dedans change
readonly contrats = httpResource<Contrat[]>(() => `${API}/contrats`, {
  defaultValue: [], // sans ça, value() serait Contrat[] | undefined
});

// forme longue : requête complète
readonly contratsDuClient = httpResource<Contrat[]>(
  () => ({
    url: `${API}/contrats`,
    params: { clientId: this.clientId() }, // → ?clientId=1
  }),
  { defaultValue: [] },
);
```

Membres en plus de ceux du §8 : `.headers()` (`HttpHeaders | undefined`), `.statusCode()` (le **code HTTP**, ex. `200`, `404` — à ne pas confondre avec `.status()` qui est l'état de la ressource), `.progress()`.

Deux réflexes :

- **URL qui renvoie `undefined` → aucune requête.** Utile pour attendre : `() => this.id() ? \`${API}/contrats/${this.id()}\` : undefined`.
- Après un `POST` / `DELETE` fait avec `HttpClient`, appelle `contrats.reload()` pour resynchroniser la liste.

**`httpResource` ou `HttpClient` direct ?**

| Besoin                                                            | Outil                           |
| ----------------------------------------------------------------- | ------------------------------- |
| Afficher une donnée qui dépend de signals (liste, détail)         | `httpResource`                  |
| Déclencher une action ponctuelle (créer, supprimer, se connecter) | `HttpClient` + `firstValueFrom` |

### `rxResource()` : la 3ᵉ variante, pour un flux RxJS que tu écris toi-même

Entre `resource` (§8 — le `loader` renvoie une `Promise`) et `httpResource` (rien à écrire, HTTP simple) : **`rxResource`**, où le `loader` (appelé `stream`) renvoie un **`Observable`** — tu peux donc y brancher les opérateurs du §5. Utile pour des requêtes **chaînées** (l'une dépend du résultat de l'autre), que `httpResource` seul ne sait pas faire :

```ts
import { rxResource } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

readonly clientId = signal(1);

// charge le client, PUIS ses contrats — deux appels dépendants, un seul resource
readonly detailRes = rxResource({
  params: () => this.clientId(),
  stream: ({ params }) =>
    this.http.get<Client>(`${API}/clients/${params}`).pipe(
      switchMap((client) =>
        this.http
          .get<ContratDTO[]>(`${API}/contrats`, { params: { clientId: client.id } })
          .pipe(map((dtos) => ({ client, contrats: dtos.map(versContrat) }))),
      ),
    ),
  defaultValue: undefined,
});
```

`detailRes.value()` / `.isLoading()` / `.error()` / `.reload()` — exactement comme `httpResource`, mais tu contrôles toi-même l'enchaînement des requêtes.

|          | `resource`                       | `httpResource`             | `rxResource`                                                    |
| -------- | -------------------------------- | -------------------------- | --------------------------------------------------------------- |
| Tu écris | une fonction `async` → `Promise` | rien (juste l'URL/requête) | un `Observable` (opérateurs RxJS)                               |
| Bon pour | asynchrone non-HTTP              | une requête HTTP simple    | des requêtes HTTP **chaînées** ou combinées avec des opérateurs |

---

## 10. Un intercepteur fonctionnel

Un `HttpInterceptorFn` s'intercale entre `HttpClient` et le réseau. C'est une fonction : `(req, next) => next(req)`. Elle tourne dans un **contexte d'injection** → `inject()` y fonctionne.

```ts
// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthService).session();
  if (!session) {
    return next(req); // pas connecté → on ne touche rien
  }
  // les requêtes sont immuables : on clone avec l'en-tête en plus
  const authentifiee = req.clone({
    setHeaders: { Authorization: `Bearer ${session.token}` },
  });
  return next(authentifiee);
};
```

```ts
// src/app/interceptors/log.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  const debut = performance.now();
  return next(req).pipe(
    finalize(() => {
      const ms = Math.round(performance.now() - debut);
      console.log(`${req.method} ${req.urlWithParams} — ${ms} ms`);
    }),
  );
};
```

Enregistrés dans `provideHttpClient(withInterceptors([authInterceptor, logInterceptor]))` (§2). Un intercepteur peut aussi **gérer les erreurs au centre** — par ex. `catchError` (§5) sur un `401` pour rediriger vers `/login`.

---

## 11. `JSON` à la main : `localStorage` et la session

`HttpClient` fait le JSON tout seul. Les vrais besoins de `JSON.parse` / `JSON.stringify` sont **ailleurs** : dès qu'on stocke un objet dans un endroit qui ne connaît que le texte — `localStorage`, `sessionStorage`, une URL, un log.

```ts
const CLE_SESSION = 'assurlite.session';

function lireSession(): Session | null {
  const brut = localStorage.getItem(CLE_SESSION); // string | null
  if (brut === null) {
    return null;
  }
  try {
    return JSON.parse(brut) as Session; // texte → objet
  } catch {
    localStorage.removeItem(CLE_SESSION); // donnée corrompue : on nettoie
    return null;
  }
}

function ecrireSession(session: Session): void {
  localStorage.setItem(CLE_SESSION, JSON.stringify(session)); // objet → texte
}
```

`JSON.parse` peut **jeter** (`SyntaxError`) sur du texte invalide → toujours dans un `try/catch`. `JSON.stringify(obj, null, 2)` (2 = indentation) sert aussi à afficher proprement un corps d'erreur dans un log.

---

## 12. Dates : `toISOString()` à l'aller, `new Date()` au retour

Le modèle `Contrat` a `dateDebut: Date`. Le serveur ne connaît que du texte.

**À l'envoi** (`POST`) — on sérialise en ISO 8601 (`"2026-09-10T12:00:00.000Z"`, trié naturellement, sans ambiguïté de fuseau) :

```ts
const corps = {
  clientId: donnees.clientId,
  type: donnees.type,
  statut: 'actif' as const,
  prime,
  reference,
  dateDebut: new Date().toISOString(), // Date → string
};
this.http.post<ContratDTO>(`${API}/contrats`, corps);
```

**Au retour** — le JSON renvoie `dateDebut` en **`string`**, pas en `Date`. Piège : `httpResource<Contrat[]>` _prétend_ que c'est un `Date` (c'est un cast), mais `contrat.dateDebut.getFullYear()` plantera. D'où un **DTO** + un mapper :

```ts
interface ContratDTO extends Omit<Contrat, 'dateDebut'> {
  dateDebut: string;
}

function versContrat(dto: ContratDTO): Contrat {
  return { ...dto, dateDebut: new Date(dto.dateDebut) }; // string → Date
}
```

`Date` a aussi `getTime()` (déjà utilisé Module 1) pour trier, et `toISOString()` renvoie toujours en UTC (`Z`).

---

## 13. Nombres : `parseInt` / `parseFloat`

Tout ce qui vient d'une **URL**, d'un **paramètre de route** ou d'un **champ texte** arrive en `string`.

```ts
// paramètre de route : contrats/:id → toujours une string
readonly id = input.required<string>();
readonly contratId = computed(() => parseInt(this.id(), 10)); // radix 10 OBLIGATOIRE

// valeur numérique tolérante venant d'une source texte
const montant = parseFloat('1234.50 €'); // → 1234.5 (s'arrête au premier caractère non numérique)
```

Règles :

- **Toujours** `parseInt(x, 10)`. Sans radix, certaines entrées (`"0x1F"`, historiquement `"08"`) sont mal interprétées.
- `parseInt` / `parseFloat` **s'arrêtent** au premier caractère invalide : `parseInt('12px', 10)` → `12`. `Number('12px')` → `NaN`. À choisir selon qu'on veut être tolérant ou strict.
- Les deux renvoient `NaN` si ça commence par du non-numérique → prévoir un garde (`Number.isNaN(...)`).

---

## 14. `Object.hasOwn` : valider la forme d'une réponse

`httpResource<Contrat[]>` ne garantit **rien** à l'exécution : si le serveur renvoie autre chose, TS ne le voit pas. Un garde de type te protège :

```ts
function estContrat(x: unknown): x is Contrat {
  return (
    typeof x === 'object' &&
    x !== null &&
    Object.hasOwn(x, 'id') &&
    Object.hasOwn(x, 'type') &&
    Object.hasOwn(x, 'statut')
  );
}
```

Branché dans l'option `parse` de `httpResource` (le point d'entrée prévu pour ça — c'est là qu'on mettrait un schéma Zod dans un vrai projet) :

```ts
readonly contrats = httpResource<Contrat[]>(() => `${API}/contrats`, {
  defaultValue: [],
  parse: (brut) => (Array.isArray(brut) ? (brut as unknown[]).filter(estContrat) : []),
});
```

`Object.hasOwn(x, 'id')` plutôt que `'id' in x` : `in` regarde **aussi la chaîne de prototypes** ; `Object.hasOwn` ne regarde que les propriétés **propres**. Il remplace l'ancien `Object.prototype.hasOwnProperty.call(x, 'id')` (verbeux, et cassé si `x` possède lui-même une clé `hasOwnProperty`).

---

## 15. `Map` : un cache de primes de devis

Recalculer `calculerPrimeDevis` à chaque frappe est inutile si les paramètres n'ont pas changé. Une `Map` sert de mémoire : clé = signature du devis, valeur = prime déjà calculée.

```ts
const cachePrimes = new Map<string, number>();

function cleDevis(d: Devis): string {
  // les options triées pour que l'ordre ne change pas la clé
  return `${d.typeDeContrat}|${d.ageClient}|${[...d.optionsChoisies].sort().join(',')}`;
}

function primeAvecCache(d: Devis): number {
  const cle = cleDevis(d);
  if (cachePrimes.has(cle)) {
    return cachePrimes.get(cle)!; // has() garantit la présence ; le ! rassure TS
  }
  const prime = calculerPrimeDevis(d);
  cachePrimes.set(cle, prime);
  return prime;
}

function invaliderDevis(d: Devis): void {
  cachePrimes.delete(cleDevis(d)); // ex : un tarif change
}

function viderCache(): void {
  cachePrimes.clear(); // ex : déconnexion, changement de client
}
```

`Map` plutôt qu'un objet `{}` : clés qui ne sont pas des identifiants JS (ici avec des `|`), `.size` direct, itérable (`for…of`, `.entries()`), ordre d'insertion garanti, aucune collision avec `toString` / `constructor`.

⚠️ **Réactivité** : muter une `Map` ne réveille **pas** un signal. Deux options — soit le cache reste **hors** signal (calcul pur, comme ci-dessus), soit `signal<Map<…>>` avec recopie `new Map(prev)` à chaque écriture (le même patron que le `Set` des filtres au Module 3).

---

## 16. Une authentification simple (pédagogique)

On assemble : `HttpClient` + promesse + `JSON`/`localStorage` + intercepteur + guard.

```ts
interface Session {
  userId: number;
  nom: string;
  token: string;
}

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _session = signal<Session | null>(lireSession()); // relit localStorage au démarrage
  readonly session = this._session.asReadonly();
  readonly estConnecte = computed(() => this._session() !== null);

  login(email: string, motDePasse: string): Promise<void> {
    return firstValueFrom(this.http.get<Utilisateur[]>(`${API}/users`, { params: { email } })).then(
      (users) => {
        const u = users[0];
        if (!u || u.password !== motDePasse) {
          throw new Error('Identifiants invalides');
        }
        const session: Session = {
          userId: u.id,
          nom: u.nom,
          token: `demo-${u.id}-${Date.now()}`, // faux jeton
        };
        this._session.set(session);
        ecrireSession(session); // JSON.stringify → localStorage
      },
    );
  }

  logout(): void {
    this._session.set(null);
    localStorage.removeItem(CLE_SESSION);
  }
}
```

Côté page de connexion : `auth.login(email, mdp).then(() => this.router.navigate(['/contrats'])).catch((e: unknown) => this.erreur.set((e as Error).message)).finally(() => this.envoiEnCours.set(false));`

Le guard réutilise le patron du Module 4 :

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.estConnecte() ? true : inject(Router).parseUrl('/login');
};
```

> **Encadré sécurité.** Comparer le mot de passe **dans le navigateur** n'est jamais acceptable en production : tout le monde peut lire la liste `/users`. `json-server` ne fait pas d'authentification ; ce montage sert **uniquement** à exercer `HttpClient`, l'intercepteur et `localStorage`. Une vraie auth : le serveur reçoit `{ email, password }`, compare un **hash** (bcrypt/argon2), renvoie un **JWT signé** à durée limitée, et rien de sensible ne transite ni ne se stocke en clair.

---

## 17. Où s'insèrent les méthodes JS de ce module

| Méthode                                        | Cas métier AssurLite                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `then`                                         | `.then(users => …)` après `firstValueFrom` dans `AuthService.login`          |
| `catch`                                        | `.catch(e => this.erreur.set(…))` sur l'échec de connexion / de chargement   |
| `finally`                                      | `.finally(() => this.chargement.set(false))` — quel que soit le résultat     |
| `JSON.stringify`                               | `ecrireSession` : objet `Session` → texte pour `localStorage`                |
| `JSON.parse`                                   | `lireSession` : texte `localStorage` → objet `Session` (dans un `try/catch`) |
| `toISOString`                                  | `dateDebut: new Date().toISOString()` dans le corps du `POST /contrats`      |
| `parseInt`                                     | `contrats/:id` (string) → `number`, avec radix 10                            |
| `parseFloat`                                   | lecture d'un montant texte tolérant renvoyé par l'API                        |
| `Object.hasOwn`                                | garde `estContrat(x)` branché dans `parse` de `httpResource`                 |
| `Map.set` / `get` / `has` / `delete` / `clear` | cache de primes de devis (`cachePrimes`)                                     |

`toPrecision` reste à caser (affichage d'une prime « à 3 chiffres significatifs » quelque part, ou à reporter au Module 8).

Côté RxJS (hors traçabilité, mais couverture Angular du module) : `map` / `filter` / `tap` / `catchError` / `finalize` (§5), `debounceTime` / `distinctUntilChanged` / `switchMap` (§6), `takeUntilDestroyed` (§4), `toObservable` (§6), `rxResource` (§9).

---

## Pour la pratique

1. **Backend.** `npm install -D json-server@0.17.4`, créer `db.json` (`clients`, `contrats`, `sinistres`, `users` — reprendre les mocks, dates en texte ISO), ajouter le script `"api"`. Vérifier `GET http://localhost:3000/contrats` dans le navigateur.
2. **Provider.** Ajouter `provideHttpClient()` dans `app.config.ts` (pas de `withFetch()`, déprécié — `fetch` est déjà le backend par défaut en v22 ; `withInterceptors([...])` viendra à l'étape 8 avec les intercepteurs). Créer `src/app/core/api.ts` (`export const API = …`).
3. **Lecture.** Dans `ContratService`, remplacer `signal<Contrat[]>(CONTRATS_MOCKS)` par `contratsRes = httpResource<ContratDTO[]>(() => \`${API}/contrats\`, { defaultValue: [] })`. Exposer un `computed` `contrats`qui mappe les DTO en`Contrat` (`versContrat`, §12). Garder `contratsFiltres`/`primeTotale`en`computed`par-dessus. Adapter`ListeContrats`:`@if (contratsRes.isLoading())`/`error()` / sinon la table.
4. **Création.** `souscrireContrat` → `firstValueFrom(this.http.post<ContratDTO>(\`${API}/contrats\`, corps))`avec`corps.dateDebut = new Date().toISOString()`et **sans`id`**. Enchaîner `.then`/`.catch`/`.finally`, puis `this.contratsRes.reload()`. Supprimer le `push` sur copie et le calcul d'`id` maison.
5. **Détail.** `ContratDetail` → `httpResource<ContratDTO>(() => this.id() ? \`${API}/contrats/${this.id()}\` : undefined)`. Gérer le 404 via `.statusCode() === 404`. `parseInt(this.id(), 10)` si tu compares l'id ailleurs.
6. **Garde de forme.** Écrire `estContrat(x): x is Contrat` avec `Object.hasOwn`, la brancher dans `parse` du `httpResource` de l'étape 3.
7. **Cache de devis.** Ajouter `cachePrimes` (`Map<string, number>`) au calcul de prime du formulaire de devis (Module 6) ou dans un petit `DevisService` : `has` / `get` / `set`, plus `delete` au changement d'un paramètre et `clear` au reset.
8. **Auth.** `AuthService` (login via `GET /users?email=`, session en `signal` + `localStorage` JSON), `authInterceptor` (Bearer), `logInterceptor` (durée), `authGuard` sur les routes `contrats*`, une page `login` minimale (Reactive **ou** Signal Forms — occasion de re-pratiquer un des deux).
9. **Traçabilité.** Cocher `then` / `catch` / `finally`, `JSON.parse` / `JSON.stringify`, `toISOString`, `parseInt` / `parseFloat`, `Object.hasOwn`, `Map.*`. Faire le point : que reste-t-il pour le Module 8 (chaînes) et les `pop` / `shift` / `unshift` ?
10. **Bonus RxJS (optionnel).** Une recherche client en direct (§6) — champ texte dans `ListeContrats` ou une nouvelle page → `toObservable` → `debounceTime(300)` → `distinctUntilChanged()` → `switchMap` vers `GET /clients?nom_like=...` → `catchError` → `toSignal`. Ou tente la même chose avec `rxResource` (§9) pour avoir `.isLoading()` / `.error()` gratuits.

---

## Ce qu'on ne fait pas encore

- **Vraie authentification** (hash serveur, JWT signé, refresh token, expiration) — hors formation : `json-server` est un faux backend.
- **`HttpParams` / `HttpHeaders` avancés**, upload de fichiers, `reportProgress`, `HttpContext`.
- **Opérateurs RxJS avancés** (`retry`, `shareReplay`, `combineLatest`, gestion de flux WebSocket, tests avec des marble diagrams) — on reste sur le socle utile au quotidien (§4-6).
- **`resource` en écriture optimiste** (`.set()` / `.update()` local avant confirmation serveur) — mentionné §8, pas creusé.
- **SSR / `TransferState` / hydration** — le champ `id` de `resource` existe pour ça, hors sujet ici.

Voir la table de suivi : [`docs/traçabilité-js.md`](./traçabilité-js.md).
