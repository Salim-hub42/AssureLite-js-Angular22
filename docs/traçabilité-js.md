# Table de traçabilité — les 40 méthodes JavaScript

Mise à jour à la fin de chaque module. Statut : ✅ utilisée dans un **vrai cas métier** (le code de pratique AssurLite, écrit par l'utilisateur) · ⏳ pas encore.

> L'exemple générique de chaque module (dossier `src/examples/`) ne compte **pas** ici : il est délibérément artificiel et sert uniquement à isoler la syntaxe. Seul le code de la partie "Pratique" (dans `src/app/`) valide une ligne de ce tableau.

## Tableaux (15)

| Méthode     | Statut | Fichier : ligne                            | Module   |
| ----------- | ------ | ------------------------------------------ | -------- |
| `push`      | ✅     | `contrat-service.ts:74` (souscrireContrat) | Module 2 |
| `pop`       | ⏳     | —                                          | Module 2 |
| `shift`     | ⏳     | —                                          | Module 2 |
| `unshift`   | ⏳     | —                                          | Module 2 |
| `map`       | ✅     | `contrat.utils.ts:24`                      | Module 1 |
| `filter`    | ✅     | `client.utils.ts:21`                       | Module 1 |
| `find`      | ✅     | `client.utils.ts:5`                        | Module 1 |
| `findIndex` | ✅     | `contrat-service.ts:86` (supprimerContrat) | Module 2 |
| `some`      | ✅     | `contrat.utils.ts:28`                      | Module 1 |
| `every`     | ✅     | `contrat.utils.ts:4`                       | Module 1 |
| `reduce`    | ✅     | `contrat.utils.ts:32`                      | Module 1 |
| `forEach`   | ✅     | `contrat.utils.ts:8`                       | Module 1 |
| `includes`  | ✅     | `contrat.utils.ts:36`                      | Module 1 |
| `slice`     | ⏳     | —                                          | Module 2 |
| `splice`    | ✅     | `contrat-service.ts:87` (supprimerContrat) | Module 2 |

## Chaînes (10)

| Méthode       | Statut | Fichier : ligne                                                                    | Module   |
| ------------- | ------ | ---------------------------------------------------------------------------------- | -------- |
| `includes`    | ✅     | `client.utils.ts:28`                                                               | Module 1 |
| `indexOf`     | ✅     | `pipes/masquer-email-pipe.ts:8` (position du `@`, `-1` si absent)                  | Module 8 |
| `slice`       | ✅     | `pipes/masquer-email-pipe.ts:13` (2 premiers caractères du nom)                    | Module 8 |
| `substring`   | ✅     | `pipes/masquer-email-pipe.ts:12-13` (nom avant le `@`, domaine à partir du `@`)    | Module 8 |
| `replace`     | ⏳     | —                                                                                  | Module 8 |
| `split`       | ✅     | `client.utils.ts:28`                                                               | Module 1 |
| `trim`        | ✅     | `client.utils.ts:4,5`                                                              | Module 1 |
| `toUpperCase` | ✅     | `contrat-service.ts:64` (préfixe de la référence de contrat : `'auto'` → `'AUTO'`) | Module 5 |
| `toLowerCase` | ✅     | `client.utils.ts:4,5`                                                              | Module 1 |
| `concat`      | ✅     | `contrat.utils.ts:50` (genererReference)                                           | Module 5 |

## Objets (5)

| Méthode          | Statut | Fichier : ligne                                                                                     | Module   |
| ---------------- | ------ | --------------------------------------------------------------------------------------------------- | -------- |
| `Object.keys`    | ✅     | `contrat.utils.ts:14`                                                                               | Module 1 |
| `Object.values`  | ✅     | `contrat.utils.ts:4`                                                                                | Module 1 |
| `Object.entries` | ✅     | `contrat.utils.ts:8`                                                                                | Module 1 |
| `Object.assign`  | ✅     | `contrat-service.ts:77`                                                                             | Module 3 |
| `Object.hasOwn`  | ✅     | `contrat.utils.ts:57` (`estContrat`, branché dans le `parse` du `httpResource` de `ContratService`) | Module 7 |

## Nombres / Math (5)

| Méthode       | Statut | Fichier : ligne                                                                                     | Module   |
| ------------- | ------ | --------------------------------------------------------------------------------------------------- | -------- |
| `toFixed`     | ✅     | `contrat.utils.ts:36`                                                                               | Module 1 |
| `toPrecision` | ⏳     | —                                                                                                   | Module 6 |
| `parseInt`    | ✅     | `guards/contrat-existe.guard.ts:10` (id de route `string` → `number`, base 10, `NaN` → redirection) | Module 7 |
| `parseFloat`  | ⏳     | — (reporté : montant saisi en texte dans la déclaration de sinistre, avec `replace`)                | Module 8 |
| `Math.random` | ✅     | `contrat.utils.ts:50` (genererReference)                                                            | Module 5 |

## Dates (5)

| Méthode       | Statut | Fichier : ligne                            | Module   |
| ------------- | ------ | ------------------------------------------ | -------- |
| `getFullYear` | ✅     | `client.utils.ts:10`                       | Module 1 |
| `getMonth`    | ✅     | `client.utils.ts:11,12`                    | Module 1 |
| `getDate`     | ✅     | `client.utils.ts:13`                       | Module 1 |
| `toISOString` | ✅     | `contrat-service.ts:72` (souscrireContrat) | Module 7 |
| `getTime`     | ✅     | `contrat.utils.ts:45`                      | Module 1 |

## Sets & Maps (10)

| Méthode      | Statut | Fichier : ligne                                                                                                      | Module   |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------- | -------- |
| `Set.add`    | ✅     | `contrat.utils.ts:19`                                                                                                | Module 1 |
| `Set.delete` | ✅     | `contrat-service.ts:28`                                                                                              | Module 3 |
| `Set.has`    | ✅     | `sinistre.utils.ts:36`                                                                                               | Module 1 |
| `Set.clear`  | ✅     | `contrat-service.ts:41`                                                                                              | Module 3 |
| `Set.size`   | ✅     | `sinistre.utils.ts:41`                                                                                               | Module 1 |
| `Map.set`    | ✅     | `devis-service.ts:28` (`calculerAvecCache`, prime calculée mise en cache ; branché dans `SouscriptionContrat.prime`) | Module 7 |
| `Map.get`    | ✅     | `devis-service.ts:21` (`calculerAvecCache`, prime déjà connue)                                                       | Module 7 |
| `Map.has`    | ✅     | `devis-service.ts:20` (`calculerAvecCache`)                                                                          | Module 7 |
| `Map.delete` | ✅     | `devis-service.ts:26` (cache limité à 20 entrées : on supprime la plus ancienne, `keys().next().value`)              | Module 7 |
| `Map.clear`  | ✅     | `devis-service.ts:35` (`reinitialiserCache`, appelé par `App.deconnecter()` dans `app.ts:26`)                        | Module 7 |

## Autres (5)

| Méthode          | Statut | Fichier : ligne                                                                                      | Module   |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------------- | -------- |
| `then`           | ✅     | `contrat-service.ts:76` (souscrireContrat)                                                           | Module 7 |
| `catch`          | ✅     | `contrat-service.ts:80` (souscrireContrat)                                                           | Module 7 |
| `finally`        | ✅     | `contrat-service.ts:84` (souscrireContrat)                                                           | Module 7 |
| `JSON.parse`     | ✅     | `models/session.utils.ts:16` (`lireSession` : texte `localStorage` → `Session`, dans un `try/catch`) | Module 7 |
| `JSON.stringify` | ✅     | `models/session.utils.ts:6` (`ecrireSession` : `Session` → texte pour `localStorage`)                | Module 7 |
| `console.log`    | ✅     | `contrat.utils.ts:10`                                                                                | Module 1 |

---

## État du Module 1

- **Leçon** (`docs/01-bases-js.md`) : ✅ rédigée
- **Exemple générique** (`src/examples/01-tableaux-objets.example.ts`) : ✅ rédigé (ne compte pas dans la traçabilité, cf. remarque en tête de fichier)
- **Pratique** (modèles `Client`/`Contrat`/`Devis`/`Sinistre` + fonctions métier dans `src/app/`) : ✅ terminée — `Client`, `Contrat`, `Devis` et `Sinistre` modélisés, avec toutes leurs fonctions métier dans `client.utils.ts`, `contrat.utils.ts`, `devis.utils.ts` et `sinistre.utils.ts`. `Sinistre` clôt le module avec `sinistresParStatut` (filter), `montantTotalSinistres` (reduce), `sinistrePlusRecent` (reduce), `afficherSinistreEnConsole` (Object.entries/forEach), `contratsAvecSinistre` (Set.add), `contratADejaUnSinistre` (Set.has) et `nombreDeContratsAvecSinistre` (Set.size)

24 / 40 méthodes validées à la fin du Module 1 (`find`, `filter`, `every`, `forEach`, `trim`, `toLowerCase`, `Object.keys`, `Object.values`, `Object.entries`, `getFullYear`, `getMonth`, `getDate`, `console.log`, `Set.add`, `Set.has`, `Set.size`, `map`, `some`, `reduce`, `includes` tableau, `includes` chaîne, `split`, `toFixed`, `getTime`) — le tableau se remplit au fur et à mesure que la pratique est codée.

**Module 1 terminé.**

## État du Module 2

- **Leçon** (`docs/02-composants-signals.md`) : ✅ rédigée
- **Exemple générique** (`src/examples/02-signals-controlflow.example.ts`) : ✅ rédigé (`ExempleTaches` — signal, computed, `@if`/`@for`/`@switch`/`@empty`, push/shift/findIndex+splice sur copie)
- **Pratique** (`src/app/contrats/liste-contrats/`) : ✅ composant `ListeContrats` — signal `contrats`, `computed` `primeTotale` (réutilise `primeTotal` du Module 1), tableau `p-table` (PrimeNG) avec `@switch` pour le statut, ajout d'un contrat (`push` sur copie) et suppression d'un contrat précis (`findIndex` + `splice` sur copie)

**27 / 40 méthodes validées** (+`push`, `findIndex`, `splice` par rapport au Module 1). `pop`/`shift`/`unshift` restent à caser dans un cas métier réel (pas forcé artificiellement) — voir Module 3 ou plus tard si l'occasion se présente.

## État du Module 3

- **Leçon** (`docs/03-services-di.md`) : ✅ rédigée — service (`@Injectable`, `providedIn: 'root'`), signal privé + `asReadonly()`, `inject()`, SRP, `input()`/`output()` parent-enfant, aperçu de `model()`, `Object.assign` (fusion sans mutation, section 9), `Set` immuable (add/delete/has/clear, section 10)
- **Exemple générique** (`src/examples/03-services-di.example.ts`) : ✅ rédigé (`ExempleCompteurService` + `ExempleBoutonCompteur`/`ExempleCompteurParent` — providedIn root, signal protégé, inject(), input.required/input avec défaut, output() ; `fusionnerPatch`/`modifierItem` — Object.assign ; `ExempleFiltreTags` — Set.add/delete/has/clear copié à chaque update())
- **Pratique** (`ContratService` dans `src/app/services/contrat-service.ts`, refactor de `ListeContrats`, composant enfant `ContratLigne`) : ✅ terminée — service + injection (`@Service()`, signal privé + `asReadonly()`), composant enfant `ContratLigne` (`input.required`/`output`), `modifierContrat` (`Object.assign`), filtre par statut avec `Set` (`toggle`/`contratsFiltres`/`reinitialiserFiltres` — `has`/`delete`/`add`/`size`/`clear`) câblé à des checkboxes + bouton reset dans `liste-contrats.html`, vérifié dans le navigateur (filtre et reset fonctionnels, aucune erreur console)

**30 / 40 méthodes validées** (+`Object.assign`, `Set.delete`, `Set.clear` par rapport au Module 2).

**Module 3 terminé.**

## État du Module 4

- **Leçon** (`docs/04-routing-navigation.md`) : ✅ rédigée — `Routes`/`provideRouter`, `RouterOutlet`, `routerLink` vs navigation programmatique, paramètres de route via `input.required()` + `withComponentInputBinding()`, lazy loading (`loadComponent`), guards fonctionnels (`CanActivateFn`)
- **Exemple générique** (`src/examples/04-routing-navigation.example.ts` + spec) : ✅ rédigé (domaine recettes, pas assurance) — `ExempleListeRecettes`/`ExempleRecetteDetail` (paramètre `:id` en `input.required<string>()`), `exempleRecetteExisteGuard` (`CanActivateFn` qui redirige si l'id n'existe pas), testé via `RouterTestingHarness` (3 tests passent)
- **Pratique** : ✅ terminée — `<router-outlet/>` dans `app.html`, routes `contrats` (lazy) et `contrats/:id` dans `app.routes.ts`, `withComponentInputBinding()` activé, nouveau composant `ContratDetail` (`id = input.required<string>()` + `computed()` de recherche via `Number`/`.find()`), lien `routerLink` depuis `ContratLigne` vers le détail, guard `contratExisteGuard` (`.some()` + `router.parseUrl`) qui redirige si l'id n'existe pas. Vérifié dans le navigateur (redirection racine, param valide/invalide, guard, navigation par lien). Suite de tests : 49/51 (2 bugs pré-existants sans rapport).

**Module 4 terminé.**

Ce module ne fait pas progresser le compteur de méthodes JS (routing = Angular pur) — reste à **30 / 40**.

## État du Module 5

- **Leçon** (`docs/05-reactive-forms.md`) : ✅ rédigée — `FormGroup`/`FormControl` typés, `Validators` intégrés, validateur personnalisé (pattern factory `ValidatorFn`), binding template (`formGroup`/`formControlName`), `valueChanges` + `toSignal()`, `FormArray`, et un exemple isolé (domaine inscription à un événement) pour `parseInt`/`parseFloat`/`Math.random`/`.concat()`/`Object.hasOwn`
- **Exemple générique** (`src/examples/05-reactive-forms.example.ts` + spec, 14 tests passent) : ✅ rédigé (domaine inscription à un événement, pas assurance) — `ExempleInscriptionEvenement` (`FormGroup` typé, validateur `ageMinimum` personnalisé, `valueChanges`+`toSignal` pour un montant recalculé en direct), `genererReference` (`Math.random`+`.concat()`), `montantSaisi` (`parseFloat` tolérant), `aUneErreurRequise` (`Object.hasOwn`)
- **Pratique** (`SouscriptionContrat` + `ContratService.souscrireContrat`) : ✅ terminée
  - `FormGroup` typé (`clientId`, `typeDeContrat`, `ageClient`, `optionsChoisies`) + validateur personnalisé `ageMinimum(18)` (`src/app/validators/age-minimum.validator.ts`)
  - prime recalculée **en direct** via `valueChanges` → `toSignal()` → `computed`, réutilise `calculerPrimeDevis` ; `primeAffichee` formate avec `toFixed(2)`
  - `genererReference()` (`contrat.utils.ts:50`) : `Math.random` + `.concat()` — génère le n° de contrat (ex. `AUTO-73412`)
  - `onSubmit()` : garde `form.invalid` + `markAllAsTouched()`, `getRawValue()`, narrowing des `null`, appel `ContratService.souscrireContrat(...)`, redirection vers `/contrats`
  - `ContratService.souscrireContrat(donnees)` : construit un `Devis`, calcule la prime, génère la référence, `push` le `Contrat` sur une copie du signal, renvoie le contrat créé
  - bouton « Ajouter un contrat » (poussait un contrat en dur) → lien `routerLink="/contrats/nouveau"` ; `ajouterContrat()` (service) et `ajoutContrat()` (liste) supprimés
  - champ `reference?: string` ajouté au modèle `Contrat`
  - correctif au passage : `appliquerMajorationAge` arrondit à 2 décimales (`Math.round(x*100)/100`) — supprime l'imprécision flottante `400 * 1.1 = 440.00000000000006` et répare le test `devis.utils.spec.ts` correspondant

**32 / 40 méthodes validées** (+`Math.random`, +`concat` chaîne). `parseInt` / `parseFloat` / `Object.hasOwn` : aucun cas métier naturel dans ce formulaire (champs `type="number"`, `hasError()` d'Angular suffit) → reportés au Module 7 (test de forme sur les réponses JSON de `HttpClient`).

Suite de tests : 65/66 (le seul échec restant, `app.spec.ts > should render title`, est le test « Hello world » du scaffold CLI, sans rapport — nettoyage prévu au Module 9).

**Module 5 terminé.**

## État du Module 6

- **Leçon** (`docs/06-signal-forms.md`) : ✅ rédigée — modèle `signal()`, `form()` + schéma, validateurs intégrés (`required`/`min`/`minLength`/`email`/`pattern`…), `validate()` personnalisé, binding `[formField]` / `[formRoot]`, lecture d'état 100 % signals, logique inter-champs `disabled`/`hidden` avec `{ when }` (sans `valueChanges`), `submit()`, tableau de comparaison Reactive Forms ↔ Signal Forms. Calée sur l'API réelle `@angular/forms/signals` d'Angular 22.0.7.
- **Exemple générique** (`src/examples/06-signal-forms.example.ts` + spec, 12 tests passent) : ✅ rédigé (domaine « inscription à un événement », même que le Module 5 pour comparaison ligne à ligne) — `ExempleInscriptionSignal` (`signal()` modèle, `form()` + schéma, `min` intégré à la place du validateur perso, `validate()` custom « pas d'espace », `disabled({ when })` inter-champs, `computed` de prix dérivé sans `valueChanges`, `submit()`), helpers purs `contientEspace` / `genererReference`.
- **Pratique** (`SouscriptionContratSignal` + route `contrats/nouveau-signal`) : ✅ terminée — reprise du formulaire de souscription du Module 5, mais en Signal Forms :
  - modèle `signal<SouscriptionModel>({ clientId, typeDeContrat, ageClient, optionsChoisies })` en données brutes (`typeDeContrat: TypeContrat | ''` pour rester assignable au `<select>`)
  - `form(this.model, path => …)` + schéma : `required` (`clientId`, `typeDeContrat`, `ageClient`), `min(18)` / `max(99)` sur `ageClient` (remplace le validateur perso `ageMinimum` du Module 5), et **deux** `validate()` personnalisés — `clientId` entier (`Number.isInteger`) et « au moins une option » sur `optionsChoisies` (`required` ne se déclenche pas sur `[]` : `isEmpty([])` est faux)
  - prime en direct **sans `valueChanges` ni `toSignal`** : simple `computed` qui lit `this.model()` et réutilise `calculerPrimeDevis` ; `primeAffichee` = `toFixed(2)`
  - template : `[formRoot]` sur le `<form>`, `[formField]` sur `clientId` / `ageClient` (`<input type="number">` natifs) et `typeDeContrat` (`<select>` natif) ; erreurs via `@for (e of f.champ().errors())` gardées par `f.champ().touched()`
  - `optionsChoisies` géré **à la main** (pas de `[formField]` pour un groupe de cases → tableau) : `estOptionCochee()` (`includes`) + `basculerOption()` (`[...liste, v]` / `filter`, mise à jour immuable via `.value.update()`, puis `markAsTouched()`)
  - `submit(this.formSouscription, async f => …)` : lit `f().value()`, narrowing des `null` / `''`, appelle `ContratService.souscrireContrat({ type: … })` **réutilisé tel quel du Module 5**, puis `router.navigate(['/contrats'])`
  - style aligné sur la version RF (PrimeNG `p-card` / `pInputText` / `p-divider` / `pButton`, `<select>` natif habillé en SCSS) ; état invalide via `[class.p-invalid]` conditionné par `touched() && invalid()`, et neutralisation du halo natif `:-moz-ui-invalid` (l'attribut `required` recopié par `[formField]` rend le champ `:invalid` dès le chargement)

Ce module ne fait pas progresser le compteur de méthodes JS (Signal Forms = Angular pur) — reste à **32 / 40**.

**Module 6 terminé.**

## État du Module 7

- **Leçon** (`docs/07-http-resource-api.md`, 17 sections) : ✅ rédigée — `HttpClient`, `httpResource`, `rxResource`, promesses (`then`/`catch`/`finally`), `JSON.parse`/`JSON.stringify`, intercepteur fonctionnel, opérateurs RxJS de base (`tap`/`map`/`catchError`/`finalize`/`switchMap`/`debounceTime`/`distinctUntilChanged`), `toObservable`/`toSignal`, `takeUntilDestroyed`
- **Exemple générique** (`src/examples/07-http-resource.example.ts` + spec, 35 tests passent) : ✅ rédigé (domaine bibliothèque de livres, pas assurance) — `estLivreDTO` (Object.hasOwn), `versLivre`/`corpsNouveauLivre` (toISOString), `parseAnnee`/`parsePrix` (parseInt/parseFloat), favoris via `localStorage` (JSON.parse/JSON.stringify), `CacheResumes` (Map complet : has/get/set/delete/clear/size), intercepteur, pipeline de recherche RxJS, `BiblioService` (httpResource, then/catch/finally, subscribe, pipe)
- **Pratique** : ✅ terminée
  - `ContratService` (`src/app/services/contrat-service.ts`) : ✅ `httpResource<ContratDTO[]>` avec `parse` filtrant via `estContrat` (`contrat.utils.ts:57`, `Object.hasOwn`) ; `souscrireContrat` fait un `http.post` puis `.then()` (reload + conversion), `.catch()` (log + relance), `.finally()` (log) ; `dateDebut` sérialisée en ISO (`toISOString`) avant l'envoi ; `supprimerContrat` en `then`/`catch` sur un `http.delete`
  - `DevisService` (`src/app/services/devis-service.ts`) : ✅ cache de primes `Map<string, number>` (`has`/`get`/`set`), **branché** dans `SouscriptionContrat.prime` ; limité à 20 entrées (`delete` de la plus ancienne clé, l'ordre d'insertion de la `Map` faisant office de file) ; vidé à la déconnexion (`clear`) ; testé (`devis-service.spec.ts` : cache, limite, vidage)
  - **Authentification** : `AuthService` (`login` via `GET /users?email=` + `then`, session en `signal` + `localStorage` via `JSON.stringify`/`JSON.parse` dans `models/session.utils.ts`), page `login` en Signal Forms (`submission.action` asynchrone), `authInterceptor` (`req.clone` + `Authorization: Bearer`, branché par `withInterceptors`), `authGuard` (redirection `/login`), bouton « Se déconnecter » dans `App` (`logout` + `reinitialiserCache` + navigation) ; tout vérifié dans le navigateur
  - **Guards** : `contratExisteGuard` réécrit en guard **asynchrone** (`parseInt(id, 10)` + `Number.isNaN`, puis `firstValueFrom(http.get)` → `.then(() => true)` / `.catch(() => UrlTree)`) — corrige la redirection à tort quand on tape `/contrats/1` au démarrage ; routes `contrats…` regroupées sous une **route parente** avec `canActivateChild: [authGuard]` (leçon §17)
  - **Tests** : `auth-guard.spec.ts`, `contrat-existe.guard.spec.ts` (200 / 404 / id non numérique via `HttpTestingController`), `auth.interceptor.spec.ts` (avec / sans session), `app.spec.ts` (bouton de déconnexion), `devis-service.spec.ts` — 127 tests passent
  - Non fait (optionnel) : recherche RxJS bonus (debounce), filtre `API` dans l'intercepteur, `returnUrl` après login

**Méthodes validées dans ce module** : `toUpperCase` (déjà utilisé depuis le Module 5 dans `souscrireContrat`, jamais coché), `Object.hasOwn`, `toISOString`, `then`, `catch`, `finally`, `JSON.parse`, `JSON.stringify`, `parseInt`, `Map.set`, `Map.get`, `Map.has`, `Map.delete`, `Map.clear`.

**Encore ⏳ au global** : `pop`, `shift`, `unshift`, `slice` (tableau), `indexOf`, `slice` / `substring` / `replace` (chaînes), `toPrecision`, `parseFloat` → prévus au Module 8 (pipes, formulaire de sinistre, finitions).

**Module 7 terminé.**

## État du Module 8

- **Leçon** (`docs/08-pipes-directives-defer.md`, 12 sections) : ✅ rédigée — pipes intégrés (paramètres, chaînage), `LOCALE_ID` / `registerLocaleData` / `DEFAULT_CURRENCY_CODE`, pipe personnalisé (`@Pipe`, `PipeTransform`, pur / impur, pipe ou `computed`), les trois familles de directives, directive d'attribut (`host` + `input` avec alias), directive DOM (`ElementRef` + `afterNextRender`, autofocus), `@defer` (blocs, déclencheurs, règles), tableaux pile / file avec signals, `replace` + `parseFloat`, `toPrecision`
- **Exemple générique** (`src/examples/08-pipes-directives-defer.example.ts` + spec, 18 tests passent) : ✅ rédigé (domaine boutique de vélos, pas assurance) — `TronquerPipe` (indexOf + substring), `MasquerTelephonePipe` (replace + slice), `SurbrillanceDirective`, `AutofocusDirective`, `ajouterAHistorique` (slice + unshift + pop), `FileCommandes` (push / unshift / shift), `parserPrix` (replace + parseFloat), `noteMoyenne` (toPrecision), `ExempleBoutique` (currency / date / titlecase / uppercase en `fr-FR`, `@defer (on viewport)` testé avec `DeferBlockBehavior.Manual`)
- **Pratique** : ⏳ à faire (7 étapes, voir « Pour la pratique » de la leçon)

**Module 8 en cours.**
