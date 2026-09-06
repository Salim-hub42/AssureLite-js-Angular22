# Module 6 — Signal Forms

## Objectifs

À la fin de ce module, tu sauras :

- Expliquer en quoi les **Signal Forms** changent de paradigme par rapport aux Reactive Forms du Module 5
- Créer un **modèle** de formulaire avec `signal()` et le brancher avec `form()`
- Écrire un **schéma** de validation (règles intégrées + `validate()` personnalisé)
- Brancher les champs au template avec la directive `[formField]`
- Lire l'état d'un champ (`value`, `errors`, `touched`, `valid`) — tout est signal
- Faire de la **logique inter-champs** (`disabled` / `hidden` conditionnels) sans `valueChanges` ni `subscribe`
- Soumettre avec `submit()`
- Comparer, ligne à ligne, l'ancien monde (Reactive Forms) et le nouveau

> Signal Forms est marqué `@publicApi 22.0` — c'est une API publique et stable dans cette version d'Angular (22.0.7 ici). Import : `@angular/forms/signals` (pas `@angular/forms`). Quelques briques restent expérimentales (`validateHttp`, l'exposition WebMCP) — on ne les touche pas.

Ce module ne fait **pas** avancer la table de traçabilité JS (0 nouvelle méthode) : c'est un module 100 % Angular, comme le Module 4.

---

## 1. Le changement de paradigme

|                                      | Reactive Forms (Module 5)                                   | Signal Forms (Module 6)                                                                       |
| ------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Source de vérité                     | des objets `FormControl` / `FormGroup` que **tu construis** | un `signal()` **de données brutes** que tu possèdes déjà                                      |
| Le formulaire                        | _est_ la structure de contrôles                             | _enveloppe_ le modèle : `form(model)` ne copie rien, il lit/écrit directement dans ton signal |
| Validation                           | des `Validators` **attachés au contrôle** à la construction | un **schéma** : une fonction qui reçoit des « chemins » et y **applique des règles**          |
| État (`valid`, `touched`, `errors`…) | des propriétés + des `Observable` (`valueChanges`)          | **des signals**, lisibles directement dans un `computed`/template                             |
| Réagir à un changement               | `valueChanges.subscribe()` ou `toSignal()`                  | rien à faire : tout est déjà réactif                                                          |
| Template                             | `[formGroup]` + `formControlName="x"`                       | `[formField]="f.x"`                                                                           |

L'idée centrale : en Reactive Forms, l'état du formulaire vit **dans les contrôles** et tu le synchronises avec ton modèle métier. En Signal Forms, **ton modèle métier EST l'état du formulaire** — `form()` lui ajoute juste une couche de validation et de suivi (touché, soumis…), sans jamais dupliquer la donnée.

---

## 2. Le modèle : un `signal()`

```ts
import { signal } from '@angular/core';

const model = signal({
  nom: '',
  age: null as number | null,
  options: [] as string[],
});
```

- Un `WritableSignal` d'un objet ordinaire. **Aucun type Angular** ici — c'est de la donnée pure.
- Le typage se fait avec `as` sur les valeurs initiales ambiguës (`null as number | null`), exactement comme on a dû typer les `FormControl<number | null>` au Module 5.
- Ce signal est la **source de vérité unique**. `form()` écrira dedans quand l'utilisateur tape ; toi tu peux le lire (`model()`) ou le remettre à zéro (`model.set(...)`).

---

## 3. `form()` : envelopper le modèle

```ts
import { form } from '@angular/forms/signals';

readonly f = form(this.model);
```

`f` est un **`FieldTree`** : un arbre qui suit la forme du modèle.

- `f` lui-même est **appelable** : `f()` renvoie l'état du champ racine (tout le formulaire).
- Chaque propriété du modèle devient un sous-champ, appelable aussi : `f.nom`, `f.age`, `f.options`.
- `f.nom()` renvoie le **`FieldState`** du champ `nom` : `f.nom().value()`, `f.nom().valid()`, `f.nom().touched()`, `f.nom().errors()`… **tout est signal**.
- `f.nom().value` est un `WritableSignal` : `f.nom().value.set('Alice')` met à jour… le modèle d'origine. `form()` ne garde pas de copie.

```ts
const nameModel = signal({ first: '', last: '' });
const nameForm = form(nameModel);
nameForm.first().value.set('John');
nameForm().value(); // { first: 'John', last: '' }
nameModel(); // { first: 'John', last: '' }  ← le même objet
```

---

## 4. Le schéma : appliquer des règles aux chemins

Deuxième argument de `form()` : une fonction qui reçoit un **arbre de chemins** (`path`) et appelle des règles dessus.

```ts
import { form, required, min, minLength } from '@angular/forms/signals';

readonly f = form(this.model, (path) => {
  required(path.nom);
  minLength(path.nom, 2);
  required(path.age);
  min(path.age, 18);
});
```

- `path.nom` n'est **pas** une valeur : c'est un jeton qui désigne l'emplacement `nom` dans le modèle. `required(path.nom)` dit « le champ `nom` est requis ».
- Un même champ peut recevoir plusieurs règles (`required` + `minLength`) — comme un tableau de `Validators` en RF.
- Si le schéma grossit, on peut l'extraire avec `schema()` et le réutiliser :

```ts
import { schema } from '@angular/forms/signals';

const souscriptionSchema = schema<Souscription>((path) => {
  required(path.typeDeContrat);
  // …
});

readonly f = form(this.model, souscriptionSchema);
```

---

## 5. Les validateurs intégrés

Signal Forms en fournit **plus** que les Reactive Forms, et ils portent une erreur **typée** :

| Règle                                           | Erreur produite (`kind`)                              |
| ----------------------------------------------- | ----------------------------------------------------- |
| `required(path.x)`                              | `'required'`                                          |
| `min(path.x, 18)` / `max(path.x, 99)`           | `'min'` / `'max'` (avec `.min` / `.max` sur l'erreur) |
| `minLength(path.x, 2)` / `maxLength(path.x, 5)` | `'minLength'` / `'maxLength'`                         |
| `email(path.x)`                                 | `'email'`                                             |
| `pattern(path.x, /^\d+$/)`                      | `'pattern'`                                           |
| `minDate(path.x, d)` / `maxDate(path.x, d)`     | `'minDate'` / `'maxDate'`                             |

Chaque règle accepte une option `{ message }` :

```ts
min(path.age, 18, { message: 'Âge minimum : 18 ans.' });
```

Le `message` remonte tel quel dans l'objet erreur — pratique pour l'affichage (plus besoin d'un `@if hasError('min')` avec le texte codé en dur dans le template).

> Notre validateur perso `ageMinimum(18)` du Module 5 **disparaît** ici : c'est exactement `min(path.age, 18)`. C'est le genre de simplification que Signal Forms apporte.

---

## 6. Un validateur vraiment personnalisé : `validate()`

Pour une règle qui n'existe pas en intégré :

```ts
import { validate } from '@angular/forms/signals';

validate(path.reference, ({ value }) => {
  return value().includes(' ')
    ? { kind: 'sansEspace', message: "La référence ne doit pas contenir d'espace." }
    : null; // null / undefined = valide
});
```

- Le callback reçoit un **`FieldContext`** : `value` (signal de la valeur du champ), `state` (l'état complet), et `valueOf(path.autreChamp)` pour lire un **autre** champ (section 9).
- Retour : `null`/`undefined` si valide, sinon un objet `{ kind: string, message?: string }` (ou un tableau d'objets pour plusieurs erreurs à la fois).
- Le `kind` est ta clé : le template la teste (`e.kind === 'sansEspace'`), comme `hasError('ageMinimum')` en RF.

C'est le pendant du _pattern factory_ `ValidatorFn` du Module 5, en plus direct : pas de fonction qui renvoie une fonction, juste `validate(chemin, règle)`.

---

## 7. Brancher au template : `[formField]`

Deux directives à importer depuis `@angular/forms/signals` : **`FormRoot`** (sur le `<form>`) et **`FormField`** (sur chaque champ).

```ts
import { FormField, FormRoot } from '@angular/forms/signals';

@Component({
  imports: [FormField, FormRoot],
  // …
})
```

```html
<form [formRoot]="f" (submit)="onSubmit($event)">
  <label for="nom">Nom</label>
  <input id="nom" [formField]="f.nom" />

  <label for="age">Âge</label>
  <input id="age" type="number" [formField]="f.age" />

  <button type="submit" [disabled]="f().invalid()">Valider</button>
</form>
```

- `[formField]="f.nom"` fait le **two-way binding** valeur ↔ input, relaie les events (marque `touched` au blur), reporte `disabled`/`required` sur l'élément natif. C'est l'équivalent de `formControlName="nom"`, mais on passe **le champ lui-même**, pas une chaîne.
- `[formRoot]="f"` sur le `<form>` : intègre la soumission (ajoute `novalidate`, capte l'event `submit`).
- Marche sur `<input>`, `<textarea>`, `<select>` natifs. Pour un composant tiers (PrimeNG `p-select`…), il faut un contrôle qui expose `value` — on regarde ça dans la pratique.

---

## 8. Lire l'état d'un champ

Tout est signal, donc directement lisible dans le template :

```html
@if (f.age().touched() && f.age().invalid()) { @for (e of f.age().errors(); track e.kind) {
<small role="alert">{{ e.message }}</small>
} }
```

| Accès                                   | Renvoie                                |
| --------------------------------------- | -------------------------------------- |
| `f.age().value()`                       | la valeur courante                     |
| `f.age().valid()` / `f.age().invalid()` | booléens                               |
| `f.age().touched()` / `f.age().dirty()` | booléens                               |
| `f.age().errors()`                      | tableau d'erreurs `{ kind, message? }` |
| `f.age().disabled()`                    | booléen                                |
| `f().valid()`                           | validité de **tout** le formulaire     |
| `f().value()`                           | l'objet modèle complet                 |

Plus besoin de `form.controls.age.hasError(...)` : on itère `errors()` et on lit `e.message` / `e.kind`.

---

## 9. Logique inter-champs — sans `valueChanges`

Au Module 5 (bonus), pour « vider les options quand le type change », il fallait un `subscribe` sur `valueChanges` + `takeUntilDestroyed`. En Signal Forms, la logique conditionnelle fait partie du **schéma** :

```ts
import { form, required, disabled, hidden } from '@angular/forms/signals';

readonly f = form(this.model, (path) => {
  required(path.typeDeContrat);

  // le champ "options" est désactivé tant qu'aucun type n'est choisi
  disabled(path.options, { when: ({ valueOf }) => valueOf(path.typeDeContrat) == null });

  // masquer un champ selon un autre
  hidden(path.detailAuto, { when: ({ valueOf }) => valueOf(path.typeDeContrat) !== 'auto' });
});
```

- `disabled(path.x, { when: ctx => booléen })` / `hidden(...)` / `readonly(...)` : la règle est **réévaluée automatiquement** dès qu'une valeur qu'elle lit change. Aucune souscription, aucun nettoyage. (Passer la fonction directement, sans `{ when: … }`, marche encore mais est `@deprecated` en 22.)
- `valueOf(path.autreChamp)` : lit la valeur d'un autre champ **dans le contexte du schéma**.
- Un champ `hidden` ne contribue plus à la validité ni au `touched` du parent — pense à le retirer du DOM avec `@if (!f.detailAuto().hidden()) { … }`.
- Les validateurs eux-mêmes acceptent un `{ when: … }` (n'appliquer `min` que si un autre champ vaut X), et `applyWhen(path, ctx => booléen, sousSchema)` applique tout un sous-schéma sous condition.

Le « reset des options au changement de type » se fait toujours à part (un `effect` qui observe `f.typeDeContrat().value()`), mais **désactiver** dépendamment d'un autre champ devient déclaratif.

---

## 10. Soumission : `submit()`

```ts
import { submit } from '@angular/forms/signals';

async onSubmit(event: Event): Promise<void> {
  event.preventDefault();

  await submit(this.f, async (f) => {
    // ne s'exécute QUE si le formulaire est valide (sinon submit marque tout touched)
    const donnees = f().value();          // l'objet modèle, typé, complet
    this.service.souscrireContrat(donnees);
    return undefined;                      // ou des erreurs serveur : { kind, message, fieldTree? }
  });
}
```

- `submit(f, action)` : marque tout le formulaire `touched`, et **n'appelle `action` que si `f().valid()`**. Plus besoin du `if (form.invalid) { markAllAsTouched(); return; }` manuel du Module 5.
- `action` peut être `async` : `submit` suit l'état `submitting()` pendant ce temps.
- Si `action` renvoie des erreurs (validation serveur), elles sont réinjectées sur les champs.

---

## 11. Reactive Forms ↔ Signal Forms, côte à côte

Même formulaire « nom + âge ≥ 18 », dans les deux mondes :

```ts
// ─── Reactive Forms (Module 5) ───
form = new FormGroup({
  nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  age: new FormControl<number | null>(null, {
    validators: [Validators.required, ageMinimum(18)],
  }),
});

onSubmit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  const v = this.form.getRawValue();
  // …
}
```

```ts
// ─── Signal Forms (Module 6) ───
model = signal({ nom: '', age: null as number | null });

f = form(this.model, (path) => {
  required(path.nom);
  required(path.age);
  min(path.age, 18);           // le validateur perso devient un intégré
});

async onSubmit(e: Event) {
  e.preventDefault();
  await submit(this.f, async (f) => { const v = f().value(); /* … */ });
}
```

```html
<!-- Reactive Forms -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="nom" />
  @if (form.controls.nom.hasError('required') && form.controls.nom.touched) { … }
</form>

<!-- Signal Forms -->
<form [formRoot]="f" (submit)="onSubmit($event)">
  <input [formField]="f.nom" />
  @if (f.nom().touched()) { @for (err of f.nom().errors(); track err.kind) {
  <small>{{ err.message }}</small> } }
</form>
```

**Ce qu'on gagne :** le modèle métier est directement l'état ; zéro `subscribe`/`toSignal` ; validation déclarative et réutilisable (`schema()`) ; `submit()` gère la garde de validité.
**Ce qu'on perd / ce qui change :** binding par référence de champ (`f.nom`) au lieu d'une chaîne ; l'intégration avec les composants tiers (PrimeNG) demande un contrôle compatible ; API récente, moins de tutos.

---

## Pour la pratique

Objectif : **refaire le formulaire de souscription du Module 5 en Signal Forms**, dans un composant séparé, pour garder les deux versions comparables.

1. Nouveau composant `SouscriptionContratSignal` + route `contrats/nouveau-signal` (lazy, comme les autres).
2. Modèle : `signal({ clientId, typeDeContrat, ageClient, optionsChoisies })` — mêmes champs que le `FormGroup` du Module 5, mais en données brutes.
3. `form(this.model, path => { … })` avec le schéma :
   - `required` sur `clientId`, `typeDeContrat`, `ageClient`
   - `min(path.ageClient, 18, { message: … })` — à la place du validateur perso `ageMinimum`
   - un `validate()` **personnalisé** quelque part (une règle qui n'a pas d'équivalent intégré — à toi de trouver laquelle a du sens : p. ex. `clientId` strictement positif via une règle métier, ou une contrainte sur les options)
4. Prime en direct : plus besoin de `valueChanges` + `toSignal` ! Un simple `computed(() => calculerPrimeDevis(...))` qui lit `this.f.ageClient().value()` / `this.f.typeDeContrat().value()` / `this.f.optionsChoisies().value()`.
5. Template : `[formRoot]` sur le `<form>`, `[formField]` sur `clientId` et `ageClient` (inputs natifs). Pour `typeDeContrat` et `optionsChoisies` : voir plus bas.
6. Soumission : `submit(this.f, async f => { … })` qui appelle `ContratService.souscrireContrat(f().value())` puis redirige — **on réutilise la méthode service du Module 5 telle quelle**, elle prend déjà un objet de données.
7. Affichage des erreurs : itérer `f.champ().errors()` et afficher `e.message`.

**Le point délicat — les `<p-select>` :** la directive `[formField]` cible les contrôles natifs. Deux options, à décider dans le code :

- garder des `<select>`/`<input type="checkbox">` **natifs** pour cette version (plus simple, et ça montre bien le cœur de Signal Forms) ;
- ou écrire un petit contrôle compatible autour de `p-select` (exposer un `value` model) — plus ambitieux, à ne faire que si le natif te frustre visuellement.

Commence par le natif.

---

## Ce qu'on ne fait pas encore

- **`validateHttp` / `validateAsync`** (validation serveur d'un champ) → nécessite `HttpClient`, Module 7
- **Contrôles personnalisés Signal Forms** (`FormValueControl`) pour intégrer proprement PrimeNG → seulement si le besoin se fait sentir, hors programme de base
- **`FormArray` équivalent** (tableaux de champs dynamiques) : le modèle étant un signal, un champ tableau se gère avec `applyEach` — on n'en a pas besoin pour la souscription

Voir la table de suivi : [`docs/traçabilité-js.md`](./traçabilité-js.md).
