# Table de traçabilité — les 40 méthodes JavaScript

Mise à jour à la fin de chaque module. Statut : ✅ utilisée dans un **vrai cas métier** (le code de pratique AssurLite, écrit par l'utilisateur) · ⏳ pas encore.

> L'exemple générique de chaque module (dossier `src/examples/`) ne compte **pas** ici : il est délibérément artificiel et sert uniquement à isoler la syntaxe. Seul le code de la partie "Pratique" (dans `src/app/`) valide une ligne de ce tableau.

## Tableaux (15)

| Méthode | Statut | Fichier : ligne | Module |
|---|---|---|---|
| `push` | ⏳ | — | Module 2 |
| `pop` | ⏳ | — | Module 2 |
| `shift` | ⏳ | — | Module 2 |
| `unshift` | ⏳ | — | Module 2 |
| `map` | ✅ | `contrat.utils.ts:24` | Module 1 |
| `filter` | ✅ | `client.utils.ts:21` | Module 1 |
| `find` | ✅ | `client.utils.ts:5` | Module 1 |
| `findIndex` | ⏳ | — | Module 2 |
| `some` | ✅ | `contrat.utils.ts:28` | Module 1 |
| `every` | ✅ | `contrat.utils.ts:4` | Module 1 |
| `reduce` | ✅ | `contrat.utils.ts:32` | Module 1 |
| `forEach` | ✅ | `contrat.utils.ts:8` | Module 1 |
| `includes` | ✅ | `contrat.utils.ts:36` | Module 1 |
| `slice` | ⏳ | — | Module 2 |
| `splice` | ⏳ | — | Module 2 |

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
| `Set.has` | ⏳ | — | Module 1 |
| `Set.clear` | ⏳ | — | Module 2 |
| `Set.size` | ⏳ | — | Module 1 |
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
- **Pratique** (modèles `Client`/`Contrat`/`Devis`/`Sinistre` + fonctions métier dans `src/app/`) : 🔄 en cours — `Client` et `Contrat` modélisés, `Object.keys/values/entries`, `Set.add`, `map`, `some`, `reduce`, `includes` (tableau + chaîne), `split`, `toFixed` et `getTime` faits ; reste `Set.has`/`Set.size` (facultatif), et le modèle `Devis`/`Sinistre`

22 / 40 méthodes validées (`find`, `filter`, `every`, `forEach`, `trim`, `toLowerCase`, `Object.keys`, `Object.values`, `Object.entries`, `getFullYear`, `getMonth`, `getDate`, `console.log`, `Set.add`, `map`, `some`, `reduce`, `includes` tableau, `includes` chaîne, `split`, `toFixed`, `getTime`) — le tableau se remplit au fur et à mesure que la pratique est codée.
