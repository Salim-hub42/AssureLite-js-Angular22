# Module 1 — Bases JavaScript dans le contexte du projet

## Objectifs

À la fin de ce module, tu sauras :

- Modéliser des données métier avec des **interfaces TypeScript**
- Parcourir, filtrer et transformer des **tableaux d'objets** (`find`, `filter`, `map`, `reduce`, `forEach`, `some`, `every`, `includes`)
- Manipuler des **objets** avec `Object.keys` / `Object.values` / `Object.entries`
- Travailler avec des **dates** (calcul d'âge, durée)
- Utiliser un **`Set`** pour gérer des valeurs uniques (types de contrats)
- Écrire des fonctions **pures et testables** (aucun effet de bord, résultat prévisible)

On reste volontairement **hors Angular** pour ce module : pas de composant, pas de signal. Juste du TypeScript pur, testé avec Vitest. Angular arrive au Module 2.

---

## 1. Modéliser les données métier

Une **interface** décrit la forme d'un objet : quels champs il a, et leur type. Elle n'existe qu'au moment de la compilation (aucun code généré), contrairement à une `class`.

```ts
export interface Client {
  id: number;
  nom: string;
  email: string;
  dateNaissance: Date;
}
```

Pour les champs qui n'ont qu'un nombre limité de valeurs possibles (le "statut" d'un contrat, par exemple), on utilise un **type union** plutôt qu'une simple `string`. Ça donne de l'autocomplétion et empêche d'écrire une valeur invalide par erreur :

```ts
export type StatutContrat = 'actif' | 'resilie' | 'suspendu';
```

Dans AssurLite, on modélise ainsi `Client`, `Contrat`, `Devis` et `Sinistre` (voir `src/app/models/`).

> **Pourquoi ne pas appeler `new Date()` dans nos fonctions ?**
> La règle du projet dit : *"Ne pas supposer que des globales comme `new Date()` sont disponibles."* Concrètement, ça veut dire qu'une fonction qui a besoin de "la date d'aujourd'hui" doit la recevoir **en paramètre**, plutôt que d'appeler `new Date()` elle-même. Résultat : la fonction est prévisible et testable (un test peut lui donner n'importe quelle date, sans dépendre de l'horloge de la machine qui l'exécute).

---

## 2. Les méthodes de tableaux qu'on utilise ici

Toutes ces méthodes ont un point commun : elles **ne modifient pas** le tableau d'origine (contrairement à `push`, `pop`, `splice`... qu'on verra au Module 2, quand on aura une vraie liste interactive à l'écran).

| Méthode | Rôle | Exemple dans AssurLite |
|---|---|---|
| `find` | trouve le **premier** élément qui correspond | trouver un client par email |
| `filter` | garde **tous** les éléments qui correspondent | contrats actifs, clients majeurs |
| `map` | transforme chaque élément en autre chose | extraire les types de contrats |
| `reduce` | agrège tous les éléments en **une seule valeur** | montant total des sinistres |
| `forEach` | exécute une action pour chaque élément (pas de retour) | afficher un récapitulatif |
| `some` | est-ce qu'**au moins un** élément correspond ? | y a-t-il un contrat actif ? |
| `every` | est-ce que **tous** les éléments correspondent ? | tous les contrats ont-ils une prime valide ? |
| `includes` | une valeur est-elle présente ? | l'email contient-il "@" ? |

```ts
const contratsActifs = contrats.filter(c => c.statut === 'actif');
const primeTotale = contrats.reduce((total, c) => total + c.prime, 0);
```

`find`/`filter`/`map`/`reduce` reçoivent tous une **fonction de rappel** (callback) appelée pour chaque élément — c'est le même principe à chaque fois, seul ce qu'on fait du résultat change.

---

## 3. Manipuler des objets

Trois méthodes statiques de `Object` permettent d'inspecter un objet sans connaître ses clés à l'avance :

```ts
Object.keys(client);    // ['id', 'nom', 'email', 'dateNaissance']
Object.values(client);  // [1, 'Camille Durand', 'camille@mail.com', Date(...)]
Object.entries(client); // [['id', 1], ['nom', 'Camille Durand'], ...]
```

`Object.entries` combiné à `map` est très utile pour transformer un objet en texte ou en liste affichable — on l'utilise pour résumer un client en une ligne.

---

## 4. Dates : calculer un âge

Un objet `Date` expose des méthodes pour lire ses composantes :

```ts
const d = new Date(1990, 4, 12); // 12 mai 1990 (le mois commence à 0 !)
d.getFullYear(); // 1990
d.getMonth();    // 4
d.getDate();     // 12
d.getTime();     // nombre de millisecondes depuis 1970 (utile pour calculer une durée)
```

Calculer un âge n'est pas juste `annéeActuelle - annéeNaissance` : il faut vérifier si l'anniversaire est déjà passé cette année (voir `calculerAge` dans `client.utils.ts`).

---

## 5. `Set` : des valeurs uniques

Un `Set` est une collection qui **élimine automatiquement les doublons**. Parfait pour extraire, par exemple, la liste des types de contrats présents sans répétition :

```ts
const types = new Set<string>();
types.add('auto');
types.add('auto');   // ignoré, déjà présent
types.has('auto');   // true
types.size;           // 1
```

---

## 6. Chaînes de caractères : normaliser avant de comparer

Deux emails peuvent être "identiques" pour un humain mais différents pour le code (`"Camille@Mail.com "` vs `"camille@mail.com"`). On normalise toujours avant de comparer :

```ts
email.trim().toLowerCase();
```

`.includes('@')` et `.split('@')` permettent une validation d'email minimale (volontairement simple — une vraie validation d'email est un sujet à part entière).

---

## Ce qu'on ne fait PAS encore

- `push` / `pop` / `shift` / `unshift` / `splice` (mutation de tableau) → **Module 2**, avec les signals et une vraie liste à l'écran
- `parseInt` / `parseFloat` / `Math.random` / formatage de chaînes avancé (`concat`, `replace`, `toUpperCase`) → quand on générera des numéros de contrat et qu'on écrira le pipe de formatage (**Modules 5 et 8**)
- `then` / `catch` / `JSON.parse` / `JSON.stringify` → dès qu'on parlera au backend json-server (**Module 7**)

Voir la table de suivi complète : [`docs/traçabilité-js.md`](./traçabilité-js.md).
