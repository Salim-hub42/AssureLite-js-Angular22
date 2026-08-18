# Table de traçabilité — les 40 méthodes JavaScript

Mise à jour à la fin de chaque module. Statut : ✅ utilisée dans un **vrai cas métier** (le code de pratique AssurLite, écrit par l'utilisateur) · ⏳ pas encore.

> L'exemple générique de chaque module (dossier `src/examples/`) ne compte **pas** ici : il est délibérément artificiel et sert uniquement à isoler la syntaxe. Seul le code de la partie "Pratique" (dans `src/app/`) valide une ligne de ce tableau.

## Tableaux (15)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `push` | ✅ | `liste-contrats.ts:21` | Module 2 |
| `pop` | ⏳ | — | Module 2 |
| `shift` | ⏳ | — | Module 2 |
| `unshift` | ⏳ | — | Module 2 |
| `map` | ✅ | `contrat.utils.ts:24` | Module 1 |
| `filter` | ✅ | `client.utils.ts:21` | Module 1 |
| `find` | ✅ | `client.utils.ts:5` | Module 1 |
| `findIndex` | ✅ | `liste-contrats.ts:36` | Module 2 |
| `some` | ✅ | `contrat.utils.ts:28` | Module 1 |
| `every` | ✅ | `contrat.utils.ts:4` | Module 1 |
| `reduce` | ✅ | `contrat.utils.ts:32` | Module 1 |
| `forEach` | ✅ | `contrat.utils.ts:8` | Module 1 |
| `includes` | ✅ | `contrat.utils.ts:36` | Module 1 |
| `slice` | ⏳ | — | Module 2 |
| `splice` | ✅ | `liste-contrats.ts:37` | Module 2 |

## Chaînes (10)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `includes` | ✅ | `client.utils.ts:28` | Module 1 |
| `indexOf` | ⏳ | — | Module 8 |
| `slice` | ⏳ | — | Module 8 |
| `substring` | ⏳ | — | Module 8 |
| `replace` | ⏳ | — | Module 8 |
| `split` | ✅ | `client.utils.ts:28` | Module 1 |
| `trim` | ✅ | `client.utils.ts:4,5` | Module 1 |
| `toUpperCase` | ⏳ | — | Module 8 |
| `toLowerCase` | ✅ | `client.utils.ts:4,5` | Module 1 |
| `concat` | ⏳ | — | Module 5 |

## Objets (5)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `Object.keys` | ✅ | `contrat.utils.ts:14` | Module 1 |
| `Object.values` | ✅ | `contrat.utils.ts:4` | Module 1 |
| `Object.entries` | ✅ | `contrat.utils.ts:8` | Module 1 |
| `Object.assign` | ⏳ | — | Module 2 |
| `Object.hasOwn` | ⏳ | — | Module 5 |

## Nombres / Math (5)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `toFixed` | ✅ | `contrat.utils.ts:36` | Module 1 |
| `toPrecision` | ⏳ | — | Module 6 |
| `parseInt` | ⏳ | — | Module 5 |
| `parseFloat` | ⏳ | — | Module 5 |
| `Math.random` | ⏳ | — | Module 5 |

## Dates (5)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `getFullYear` | ✅ | `client.utils.ts:10` | Module 1 |
| `getMonth` | ✅ | `client.utils.ts:11,12` | Module 1 |
| `getDate` | ✅ | `client.utils.ts:13` | Module 1 |
| `toISOString` | ⏳ | — | Module 7 |
| `getTime` | ✅ | `contrat.utils.ts:45` | Module 1 |

## Sets & Maps (10)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `Set.add` | ✅ | `contrat.utils.ts:19` | Module 1 |
| `Set.delete` | ⏳ | — | Module 2 |
| `Set.has` | ✅ | `sinistre.utils.ts:36` | Module 1 |
| `Set.clear` | ⏳ | — | Module 2 |
| `Set.size` | ✅ | `sinistre.utils.ts:41` | Module 1 |
| `Map.set` | ⏳ | — | Module 7 |
| `Map.get` | ⏳ | — | Module 7 |
| `Map.has` | ⏳ | — | Module 7 |
| `Map.delete` | ⏳ | — | Module 7 |
| `Map.clear` | ⏳ | — | Module 7 |

## Autres (5)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `then` | ⏳ | — | Module 7 |
| `catch` | ⏳ | — | Module 7 |
| `finally` | ⏳ | — | Module 7 |
| `JSON.parse` | ⏳ | — | Module 7 |
| `JSON.stringify` | ⏳ | — | Module 7 |
| `console.log` | ✅ | `contrat.utils.ts:10` | Module 1 |

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
- **Pratique** (`ContratsService`, refactor de `ListeContrats`, composant enfant `ContratLigne`) : ⏳ à coder par l'utilisateur — voir la section "Pour la pratique" de la leçon (pistes pour `Object.assign` et `Set.delete`/`Set.clear`)

Prochain module (après la pratique du Module 3) : Module 4 — Routing et navigation, guards.
