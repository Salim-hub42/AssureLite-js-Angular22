# Module 2 — Composants, Signals et nouveau Control Flow

## Objectifs

À la fin de ce module, tu sauras :

- Créer un **composant standalone** Angular (template, style, sélecteur)
- Gérer un **état réactif** avec `signal()`
- Dériver un état avec `computed()`
- Comprendre pourquoi Angular n'a **plus besoin de zone.js** quand on utilise des signals (mode **zoneless**)
- Afficher une liste avec le nouveau **control flow** : `@if`, `@for` (avec `track`), `@switch`, `@empty`
- Ajouter/retirer un élément d'un signal-tableau **sans le muter directement** (et au passage, utiliser `push`/`pop`/`shift`/`unshift`/`splice`)

On quitte le TypeScript pur du Module 1 : on entre dans Angular. Premier cas pratique : la **liste des contrats**, à l'écran.

---

## 1. Un composant standalone, c'est quoi ?

Un composant Angular, c'est trois choses réunies : une **classe TypeScript** (la logique), un **template** (le HTML), et éventuellement un **style** (le CSS/SCSS).

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-contrats',
  template: `<p>Bientôt la liste des contrats ici</p>`,
  styles: `p { color: gray; }`
})
export class ListeContrats {}
```

- `selector` : le nom de la balise HTML qu'on pourra utiliser ailleurs (`<app-liste-contrats />`)
- `template` : le HTML du composant. Pour un petit composant, on l'écrit **inline** (directement dans le décorateur) plutôt que dans un fichier `.html` séparé — règle du projet.
- **Standalone** : depuis Angular v20+, un composant est standalone **par défaut** — pas besoin d'écrire `standalone: true`, et pas de `NgModule` à déclarer. Le composant importe directement ce dont il a besoin (d'autres composants, des pipes, des directives) via un tableau `imports: [...]` dans le décorateur.

---

## 2. Les signals : un état qui se surveille lui-même

Jusqu'ici (Module 1), nos fonctions recevaient des données en paramètre et renvoyaient un résultat — pas d'état à gérer. Dans un composant, on a besoin de **mémoriser une valeur qui peut changer** (la liste des contrats affichés, un filtre choisi par l'utilisateur...) et de **redessiner l'écran automatiquement** quand elle change.

C'est le rôle d'un `signal` :

```ts
import { signal } from '@angular/core';

const contrats = signal<Contrat[]>(CONTRATS_MOCKS);

contrats();          // lit la valeur actuelle → Contrat[]
contrats.set([]);     // remplace complètement la valeur
contrats.update(liste => [...liste, nouveauContrat]);  // calcule la nouvelle valeur à partir de l'ancienne
```

Trois choses à retenir :

- Un signal se **lit** en l'appelant comme une fonction : `contrats()`, pas `contrats`.
- On ne modifie **jamais** son contenu en place (interdiction du projet : pas de `mutate`). On fournit toujours une **nouvelle valeur** via `.set(...)` ou `.update(...)`.
- Angular détecte automatiquement quels bouts de template dépendent d'un signal, et ne redessine **que ceux-là** quand il change — c'est beaucoup plus précis (et rapide) que l'ancien système.

---

## 3. `computed()` : une valeur qui se recalcule toute seule

Certaines valeurs ne sont jamais stockées directement : elles se **déduisent** d'un ou plusieurs signals. C'est exactement le rôle de `reduce`/`filter` qu'on utilisait au Module 1, mais version réactive :

```ts
import { computed } from '@angular/core';

const contrats = signal<Contrat[]>(CONTRATS_MOCKS);

const primeTotale = computed(() => primeTotal(contrats()));         // réutilise la fonction du Module 1 !
const contratsActifs = computed(() => contrats().filter(c => c.statut === 'actif'));
```

`computed()` se recalcule **automatiquement** dès que `contrats` change — pas besoin de le faire soi-même. Et comme `primeTotal`/`filter` sont des fonctions pures qu'on a déjà écrites et testées au Module 1, on n'a rien à réécrire : les signals viennent simplement les **brancher** sur l'état du composant.

---

## 4. Zoneless + `OnPush` : pourquoi ça marche automatiquement

Historiquement, Angular utilisait `zone.js` pour détecter "quelque chose a peut-être changé quelque part, je revérifie tout l'écran par sécurité". C'est efficace mais un peu brutal.

Avec les **signals**, Angular sait **précisément** quel signal a changé et quel bout de template en dépend — plus besoin de tout revérifier. C'est ce qu'on appelle le mode **zoneless** (pas de `zone.js` du tout), combiné à la stratégie `OnPush` sur les composants : un composant `OnPush` ne se redessine que si un `@Input` change de référence ou si un signal qu'il lit change de valeur.

Concrètement pour toi : tant que tu lis tes données via des signals dans le template, tu n'as **rien de spécial à faire** — ça fonctionne "tout seul".

---

## 5. Le nouveau control flow

Angular a remplacé les anciennes directives structurelles (`*ngIf`, `*ngFor`, `*ngSwitch`) par une syntaxe intégrée au langage de template, plus proche de JS/TS et plus performante.

### `@if` / `@else`

```html
@if (contrats().length > 0) {
  <p>{{ contrats().length }} contrat(s)</p>
} @else {
  <p>Aucun contrat</p>
}
```

### `@for` — avec `track` **obligatoire**

```html
@for (contrat of contrats(); track contrat.id) {
  <li>{{ contrat.type }} — {{ contrat.prime }} €</li>
} @empty {
  <li>Aucun contrat à afficher</li>
}
```

`track` dit à Angular **comment identifier chaque élément** d'une itération à l'autre (ici, par son `id`, qui ne change jamais) — sans ça, Angular ne peut pas savoir si un élément affiché correspond au même contrat après une mise à jour de la liste, et il redessinerait tout à chaque fois. C'est l'équivalent du `key` en React, en plus strict (le compilateur Angular **exige** un `track`, ce n'est pas juste une bonne pratique).

`@empty` est le bloc affiché si le tableau est vide — ça remplace le `*ngIf="liste.length === 0"` qu'on écrivait à côté d'un `*ngFor` avant.

### `@switch`

```html
@switch (contrat.statut) {
  @case ('actif') { <span>✅ Actif</span> }
  @case ('suspendu') { <span>⏸️ Suspendu</span> }
  @default { <span>❌ Résilié</span> }
}
```

---

## 6. Modifier un tableau-signal sans le muter (et utiliser `push`/`splice`...)

Le Module 1 a délibérément évité `push`/`pop`/`shift`/`unshift`/`splice` : ce sont des méthodes qui **mutent** le tableau d'origine, ce qu'on voulait éviter tant qu'on écrivait des fonctions pures.

Mais un signal a justement besoin d'une **nouvelle référence de tableau** à chaque changement (sinon Angular ne détecte rien). La technique : on **copie** le tableau, on mute **la copie**, puis on renvoie la copie via `update()`.

```ts
// Ajouter un contrat
contrats.update(liste => {
  const copie = [...liste];
  copie.push(nouveauContrat);
  return copie;
});

// Retirer le contrat à l'index 2
contrats.update(liste => {
  const copie = [...liste];
  copie.splice(2, 1);
  return copie;
});
```

Le tableau original (`liste`, ce qu'il y avait dans le signal juste avant) n'est jamais touché — seule la copie l'est. C'est ce compromis qui permet d'utiliser `push`/`pop`/`shift`/`unshift`/`splice` (utiles et bien réels dans la vraie vie) **sans** violer la règle d'immutabilité des signals.

### Retirer UN élément précis : `findIndex` + `splice`

`pop`/`shift` ne retirent que le dernier/premier élément — pratique, mais rarement ce qu'on veut vraiment (un utilisateur clique sur "supprimer" à côté d'une ligne **précise**, pas forcément la première ou la dernière).

`findIndex` répond à la question *"à quelle position se trouve l'élément qui correspond ?"* — comme `find`, mais il renvoie l'**index** (un nombre, `-1` si rien ne correspond) plutôt que l'élément lui-même. On combine avec `splice(index, 1)` pour retirer exactement 1 élément à cette position, sur la copie :

```ts
retirer(id: number): void {
  this.taches.update((liste) => {
    const copie = [...liste];
    const index = copie.findIndex((tache) => tache.id === id);
    copie.splice(index, 1);
    return copie;
  });
}
```

---

## Ce qu'on ne fait PAS encore

- `input()` / `output()` (communication entre composants) → **Module 3**, quand on aura plusieurs composants qui se parlent
- `effect()` / `linkedSignal()` → dès qu'un cas d'usage réel s'y prêtera (pas de synchronisation externe à faire pour l'instant)
- `@defer` (chargement différé) → **Module 8**
- Formulaires (`FormGroup`, Signal Forms) → **Modules 5 et 6**
- `parseInt`/`Math.random`/formatage avancé de chaînes → plus tard, quand on génèrera des numéros de contrat

Voir la table de suivi complète : [`docs/traçabilité-js.md`](./traçabilité-js.md).
