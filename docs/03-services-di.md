# Module 3 — Services, injection de dépendances et communication entre composants

## Objectifs

À la fin de ce module, tu sauras :

- Expliquer pourquoi on sort l'état et la logique métier d'un composant pour les mettre dans un **service**
- Créer un service avec `@Service()`
- L'injecter avec `inject()` (jamais via le constructeur — règle du projet)
- Protéger l'état d'un service avec un signal **privé** exposé en lecture seule (`asReadonly()`)
- Découper un composant en **parent / enfant** et les faire communiquer avec `input()` et `output()`
- Savoir où `model()` s'insère dans ce tableau (aperçu, creusé plus tard)

On quitte le "tout dans un seul composant" du Module 2 : la logique de `ListeContrats` va être extraite dans un service, et on va faire apparaître un premier composant enfant.

---

## 1. Le problème : où vit l'état ?

Depuis le Module 2, `contrats` est un signal qui vit **à l'intérieur** de `ListeContrats`. Ça fonctionne tant qu'un seul composant a besoin de cette donnée.

Mais dès qu'un deuxième composant a besoin des mêmes contrats — une page de détail client qui affiche "ses" contrats, un résumé en en-tête de l'application, un futur composant de filtres — le signal enfermé dans `ListeContrats` devient un problème : soit on le duplique (et les deux copies divergent), soit on le fait remonter artificiellement de composant en composant (`@Input` en cascade), ce qui devient vite illisible.

La solution Angular : sortir l'état de tout composant et le mettre dans un **service**. Un service n'a pas de template, pas de cycle de vie de composant — c'est une classe injectable, accessible depuis n'importe quel composant qui en a besoin, sans passer par la hiérarchie parent/enfant.

---

## 2. Créer un service : `@Service()`

```ts
import { Service, signal, computed } from '@angular/core';
import { Contrat } from '../models/contrat.model';
import { CONTRATS_MOCKS } from '../data/mock-data';
import { primeTotal } from '../models/contrat.utils';

@Service()
export class ContratsService {
  private readonly _contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  readonly contrats = this._contrats.asReadonly();
  readonly primeTotale = computed(() => primeTotal(this._contrats()));
}
```

- `@Service()` marque la classe comme service et la rend **automatiquement disponible** dans tout le système d'injection de dépendances — une seule instance créée au premier composant qui l'injecte, partagée par tous les suivants (singleton). Pas besoin de tableau `providers: [...]` ni de préciser où elle doit vivre : c'est le comportement par défaut.
- Si Angular ne trouve **aucun** composant qui injecte ce service, il n'est même pas inclus dans le bundle final (*tree-shaking*).
- `ng generate service` (Angular CLI, version installée dans ce projet) génère `@Service()` par défaut désormais — c'est la manière moderne d'écrire un service "normal" dans cette version d'Angular.

> **Note historique — `@Injectable({ providedIn: 'root' })`** : c'est l'ancienne façon d'obtenir exactement le même résultat (singleton auto-fourni), et tu la verras dans beaucoup de tutoriels/code existant. `@Injectable` n'est pas déprécié — il reste nécessaire pour des cas plus spécifiques (ex : un provider avec une factory custom via un `InjectionToken`, ou du code qui doit encore fonctionner avec l'ancien système de `NgModule`). Mais pour un service "normal" comme `ContratsService`, `@Service()` est le choix par défaut désormais dans ce projet.

---

## 3. Protéger l'état : signal privé + `asReadonly()`

Remarque le préfixe `_` et le `private` sur `_contrats` : c'est volontaire. Le service est **le seul** à pouvoir modifier l'état (`_contrats.set(...)` / `_contrats.update(...)`) — via des méthodes qu'il expose lui-même (`ajouter`, `retirer`, `modifier`...). Les composants qui consomment `contrats` (la version publique, `.asReadonly()`) ne peuvent que **lire**.

```ts
@Service()
export class ContratsService {
  private readonly _contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  readonly contrats = this._contrats.asReadonly(); // lecture seule pour l'extérieur

  ajouter(contrat: Contrat): void {
    this._contrats.update((liste) => {
      const copie = [...liste];
      copie.push(contrat);
      return copie;
    });
  }

  retirer(id: number): void {
    this._contrats.update((liste) => {
      const copie = [...liste];
      const index = copie.findIndex((c) => c.id === id);
      copie.splice(index, 1);
      return copie;
    });
  }
}
```

Sans `asReadonly()`, n'importe quel composant pourrait faire `contratsService.contrats.set([])` depuis n'importe où — la donnée ne serait plus fiable, impossible de savoir qui l'a modifiée. Un seul point d'écriture (le service), plusieurs points de lecture (les composants) : c'est la règle à retenir.

---

## 4. `inject()` plutôt que le constructeur

```ts
import { Component, inject } from '@angular/core';
import { ContratsService } from '../../services/contrats.service';

@Component({ /* ... */ })
export class ListeContrats {
  private readonly contratsService = inject(ContratsService);

  protected readonly contrats = this.contratsService.contrats;
  protected readonly primeTotale = this.contratsService.primeTotale;
}
```

`inject()` fait la même chose qu'un paramètre de constructeur (`constructor(private contratsService: ContratsService) {}`) mais en tant que **fonction**, appelée dans l'initialisation d'un champ de classe. Deux avantages concrets :

- Ça fonctionne **n'importe où** dans la classe (pas seulement dans le constructeur), y compris dans l'initialisation d'un autre champ — utile si un `computed()` ou un `effect()` a besoin du service au moment de sa création.
- Pas de liste de paramètres à faire grossir avec `private`/`readonly` répétés à chaque nouvelle dépendance — chaque ligne `inject(...)` est indépendante et lisible seule.

Règle du projet : `inject()` toujours, l'injection par constructeur jamais.

---

## 5. Un service, une responsabilité

`ContratsService` ne gère que les contrats. Quand on aura besoin de gérer les clients ou les sinistres, ce sera un `ClientsService` et un `SinistresService` séparés — pas un `ContratsService` qui grossit pour tout faire. Chaque service reste petit, testable isolément, et ne dépend que de ce dont il a vraiment besoin.

---

## 6. Découper en composants : parent → enfant avec `input()`

Un composant enfant reçoit des données de son parent via des **inputs**. Avec la nouvelle API (Angular 17+), on les déclare comme des champs de classe, pas des décorateurs :

```ts
import { Component, input } from '@angular/core';
import { Contrat } from '../../models/contrat.model';

@Component({
  selector: 'app-contrat-ligne',
  template: `
    <span>{{ contrat().type }} — {{ contrat().prime }} €</span>
  `
})
export class ContratLigne {
  contrat = input.required<Contrat>(); // obligatoire, pas de valeur par défaut
  compact = input<boolean>(false);      // optionnel, valeur par défaut
}
```

Dans le template du parent :

```html
<app-contrat-ligne [contrat]="unContrat" [compact]="true" />
```

- `input.required<T>()` : Angular refuse de compiler si le parent oublie de le fournir — plus sûr que l'ancien `@Input()` qui laissait passer `undefined` silencieusement.
- `input<T>(valeurParDefaut)` : optionnel, avec une valeur de repli.
- Comme un signal, `contrat` se **lit** en l'appelant : `contrat()`, aussi bien dans le template que dans la classe.

---

## 7. Enfant → parent avec `output()`

Pour l'autre sens — l'enfant signale un événement au parent (ex : "l'utilisateur a cliqué sur supprimer pour CE contrat") — on utilise `output()` :

```ts
import { Component, input, output } from '@angular/core';
import { Contrat } from '../../models/contrat.model';

@Component({
  selector: 'app-contrat-ligne',
  template: `
    <span>{{ contrat().type }} — {{ contrat().prime }} €</span>
    <button (click)="supprimer.emit(contrat().id)">Supprimer</button>
  `
})
export class ContratLigne {
  contrat = input.required<Contrat>();
  supprimer = output<number>(); // émet l'id du contrat supprimé
}
```

Dans le parent :

```html
<app-contrat-ligne [contrat]="unContrat" (supprimer)="onSupprimer($event)" />
```

```ts
onSupprimer(id: number): void {
  this.contratsService.retirer(id);
}
```

L'enfant ne connaît pas le service, ni comment la suppression est réellement faite — il se contente de **signaler** l'intention (`supprimer.emit(id)`). C'est le parent qui décide quoi faire de l'événement. Ce découplage est ce qui rend un composant enfant réutilisable ailleurs sans le modifier.

---

## 8. Et `model()` ?

`model()` combine un `input()` et un `output()` en un seul champ, pour le **two-way binding** (`[(valeur)]="..."`) — utile quand l'enfant doit à la fois *recevoir* une valeur et *la modifier directement* pour le parent (typiquement un champ de formulaire personnalisé). On ne l'utilise pas encore dans AssurLite : le premier cas d'usage réel sera un composant de formulaire aux Modules 5-6 (Reactive Forms / Signal Forms), où ce besoin apparaît naturellement. Le mentionner ici sert juste à savoir où il se situe par rapport à `input()`/`output()`.

---

## Pour la pratique

Objectif du module côté `src/app/` :

1. Créer `ContratsService` (`providedIn: 'root'`) qui reprend l'état et les méthodes actuellement dans `ListeContrats` (`contrats`, `primeTotale`, ajout, suppression).
2. Faire injecter ce service par `ListeContrats` via `inject()`, à la place du signal local.
3. Extraire un composant enfant `ContratLigne` (une ligne du tableau) avec `input.required<Contrat>()` et un `output()` pour la suppression.
4. Chercher une occasion réelle d'utiliser `Object.assign` (ou l'équivalent en spread) : par exemple une méthode `modifierContrat(id, patch: Partial<Contrat>)` sur le service, qui fusionne un patch sur le contrat existant **sans le muter**.
5. Chercher une occasion réelle d'utiliser `Set.delete` / `Set.clear` : par exemple un filtre par statut (l'utilisateur coche/décoche des statuts à afficher, stockés dans un `Set<StatutContrat>`), avec un bouton "réinitialiser les filtres" qui vide le `Set`.

Pas d'obligation de tout faire dans un seul composant — si le filtre par statut mérite son propre composant enfant, c'est une bonne occasion supplémentaire de pratiquer `input()`/`output()`.

---

## Ce qu'on ne fait pas encore

- `effect()` / `linkedSignal()` → toujours en attente d'un vrai besoin de synchronisation externe
- `model()` concret (two-way binding) → Modules 5 et 6, sur les formulaires
- Plusieurs pages et navigation entre elles → **Module 4** (routing, guards)
- `Map` (cache de devis) → **Module 7**, avec `HttpClient`/Resource API

Voir la table de suivi complète : [`docs/traçabilité-js.md`](./traçabilité-js.md).
