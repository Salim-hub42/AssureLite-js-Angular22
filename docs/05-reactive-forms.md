# Module 5 — Reactive Forms

## Objectifs

À la fin de ce module, tu sauras :

- Expliquer pourquoi ce projet utilise les **Reactive Forms** plutôt que les formulaires *template-driven* (`[(ngModel)]`)
- Construire un formulaire avec `FormGroup`/`FormControl`, **typé**
- Valider avec les `Validators` intégrés, puis écrire un **validateur personnalisé**
- Afficher les erreurs de validation proprement dans le template
- Réagir aux changements de valeur avec `valueChanges`
- Gérer une liste dynamique de champs avec `FormArray`
- Soumettre un formulaire et en récupérer la valeur, typée

Ce module couvre aussi 4 méthodes JS de la table de traçabilité : `parseInt`, `parseFloat`, `Math.random`, `Object.hasOwn`, `concat` (chaînes) — vues en section 8.

---

## 1. Pourquoi Reactive Forms, pas Template-driven

Angular propose deux façons de gérer un formulaire :

- **Template-driven** : `[(ngModel)]` dans le HTML, l'état du formulaire vit implicitement dans le DOM, Angular le déduit. Nécessite `FormsModule`.
- **Reactive** : le formulaire est un **objet explicite** (`FormGroup`) construit en TypeScript, le template ne fait que s'y **brancher**. Nécessite `ReactiveFormsModule`.

Ce projet impose Reactive Forms (voir `.claude/CLAUDE.md`), pour des raisons concrètes :

- La logique de validation vit dans une classe TypeScript **testable indépendamment du DOM** (pas besoin de monter un composant pour tester qu'un email invalide est rejeté).
- L'état du formulaire est un **objet manipulable** — tu peux le construire dynamiquement (ajouter/retirer des champs), le typer, le sérialiser.
- Cohérent avec le reste du projet : pas de binding bidirectionnel magique caché, comme on a déjà évité `[(ngModel)]` pour les checkboxes de filtre au Module 3-4.

---

## 2. `FormControl` et `FormGroup`, typés

```ts
import { FormControl, FormGroup, Validators } from '@angular/forms';

const form = new FormGroup({
  nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  age: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
});
```

- Chaque champ du formulaire est un `FormControl` : il porte **une valeur**, **son état de validation**, **son historique d'interaction** (touché ou non, modifié ou non).
- `FormGroup` **regroupe** plusieurs `FormControl` sous un seul objet — `form.value` renvoie `{ nom: string, age: number | null }`, TypeScript infère ce type automatiquement depuis la définition.
- `{ nonNullable: true }` : la valeur ne redeviendra jamais `null`/`undefined` (utile pour les champs texte — un `reset()` revient à `''`, pas à `null`). Pour un champ qui doit accepter `null` comme état légitime (aucun âge saisi), on type explicitement `FormControl<number | null>` sans `nonNullable`.
- Lire une valeur : `form.value` (tout l'objet), `form.controls.nom.value` ou `form.get('nom')?.value` (un seul champ).

---

## 3. Les validateurs intégrés

```ts
import { Validators } from '@angular/forms';

new FormControl('', {
  validators: [Validators.required, Validators.email, Validators.minLength(3)],
});
```

Les plus courants : `required`, `min(n)`/`max(n)`, `minLength(n)`/`maxLength(n)`, `email`, `pattern(regex)`. Un tableau de validateurs = **toutes** les règles doivent passer.

État d'un contrôle :

```ts
control.valid       // true si toutes les règles passent
control.invalid     // l'inverse
control.errors      // null si valide, sinon { required: true, min: { min: 0, actual: -5 } }
control.hasError('required')  // raccourci pratique
```

---

## 4. Un validateur personnalisé

Un validateur est une simple **fonction** qui reçoit le contrôle et renvoie `null` (valide) ou un objet d'erreurs.

```ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function ageMinimum(minimum: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age === null || age >= minimum) {
      return null; // valide
    }
    return { ageMinimum: { minimum, actuel: age } };
  };
}
```

```ts
new FormControl<number | null>(null, {
  validators: [Validators.required, ageMinimum(18)],
});
```

- **Pattern factory** : `ageMinimum(18)` ne *fait* pas la validation elle-même — elle **renvoie une fonction** qui la fera. C'est ce qui permet de paramétrer le validateur (`ageMinimum(18)` vs `ageMinimum(21)`) tout en gardant la signature `ValidatorFn` attendue par Angular (`(control) => ValidationErrors | null`).
- Renvoyer `null` : pas d'erreur. Renvoyer un objet : chaque **clé** devient une entrée dans `control.errors`, que le template peut tester avec `hasError('ageMinimum')`.
- Ne jamais oublier le cas `age === null` (champ vide) : c'est le rôle de `Validators.required` de le signaler, pas à ton validateur personnalisé de le dupliquer.

---

## 5. Brancher le formulaire au template

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="nom" />
  @if (form.controls.nom.invalid && form.controls.nom.touched) {
    <p>Le nom est requis.</p>
  }

  <input type="number" formControlName="age" />
  @if (form.controls.age.hasError('ageMinimum')) {
    <p>Âge minimum non atteint.</p>
  }

  <button type="submit" [disabled]="form.invalid">Valider</button>
</form>
```

- `[formGroup]="form"` sur le `<form>` : connecte tout l'objet.
- `formControlName="nom"` sur chaque champ : le relie à **son** `FormControl` par son nom dans le `FormGroup`.
- `.touched` : `true` seulement après que l'utilisateur ait **quitté** le champ (blur) — évite d'afficher une erreur "requis" avant même que l'utilisateur ait eu la chance de taper quoi que ce soit.
- `(ngSubmit)` plutôt que `(click)` sur le bouton : capte aussi la soumission au clavier (touche Entrée dans un champ), pas seulement le clic.

---

## 6. `valueChanges` : réagir en direct

```ts
form.controls.age.valueChanges.subscribe((valeur) => {
  console.log('Âge modifié :', valeur);
});
```

`valueChanges` est un **Observable** (RxJS) qui émet à chaque frappe/changement — utile pour un recalcul en direct (ex : recalculer une prime pendant que l'utilisateur choisit ses options).

Ce projet est signal-first : pour éviter un `subscribe()` manuel (et devoir penser à s'en désabonner), Angular fournit un pont RxJS → signal :

```ts
import { toSignal } from '@angular/core/rxjs-interop';

private readonly age = toSignal(this.form.controls.age.valueChanges, { initialValue: this.form.controls.age.value });
```

`age` devient un signal normal, lisible avec `age()`, utilisable dans un `computed()` — plus besoin de `subscribe`/`unsubscribe` manuel, la désinscription est gérée automatiquement par Angular.

---

## 7. `FormArray` : une liste dynamique de champs

Pour un nombre **variable** de champs (ex : plusieurs options cochées, plusieurs bénéficiaires) :

```ts
import { FormArray, FormControl } from '@angular/forms';

const options = new FormArray<FormControl<string>>([]);

options.push(new FormControl('vol', { nonNullable: true }));
options.push(new FormControl('bris de glace', { nonNullable: true }));

options.value;          // ['vol', 'bris de glace']
options.removeAt(0);     // retire 'vol'
```

Même logique qu'un tableau signal (Module 2) : `push`/`removeAt` modifient la structure, `.value` donne un tableau JS classique à un instant donné.

Dans le template :

```html
<div formArrayName="options">
  @for (option of optionsArray.controls; track $index) {
    <input [formControlName]="$index" />
  }
</div>
```

---

## 8. Où s'insèrent les méthodes JS de ce module

Petit exemple isolé, domaine "inscription à un événement" (pas assurance) :

```ts
// Générer une référence unique à la soumission
function genererReference(prefixe: string): string {
  const numero = Math.floor(Math.random() * 100000);
  return prefixe.concat('-', String(numero));
  // équivalent plus courant : `${prefixe}-${numero}`
  // .concat() est demandé explicitement par la table de traçabilité
}

// Convertir une saisie texte libre en nombre, sans planter sur un format imparfait
function montantSaisi(texte: string): number {
  return parseFloat(texte) || 0;
  // parseFloat('12,50 €') -> 12.5 (s'arrête au premier caractère invalide)
  // Number('12,50 €')     -> NaN (rejette tout le texte si un seul caractère ne colle pas)
}

// Inspecter l'objet errors d'un contrôle sans passer par hasError()
function aUneErreurRequise(errors: Record<string, unknown> | null): boolean {
  return errors !== null && Object.hasOwn(errors, 'required');
}
```

- **`parseInt(texte, 10)`** / **`parseFloat(texte)`** : convertissent le **début** d'une chaîne en nombre, en ignorant ce qui suit dès que ça devient invalide — contrairement à `Number(texte)` qui rejette tout si la chaîne entière n'est pas un nombre pur. Utile pour un champ texte libre où l'utilisateur peut taper un symbole monétaire ou une unité.
- **`Math.random()`** : renvoie un nombre décimal entre 0 (inclus) et 1 (exclus) — `Math.floor(Math.random() * 100000)` donne un entier entre 0 et 99999.
- **`.concat()`** : assemble des chaînes, comme `+`, mais c'est la méthode explicitement demandée par la traçabilité (le spread/template-literal restent ce que tu utiliseras le plus souvent en dehors de ce cas précis).
- **`Object.hasOwn(objet, cle)`** : renvoie `true`/`false` selon que `cle` existe **directement** sur `objet` — plus sûr que `objet.hasOwnProperty(cle)` (qui peut planter si `objet` a été créé sans prototype) ou qu'un simple `cle in objet` (qui remonte aussi les propriétés héritées).

---

## Pour la pratique

Objectif : remplacer le bouton "Ajouter un Contrat" actuel (qui pousse un contrat en dur) par un vrai **formulaire de souscription**.

1. Nouveau composant `SouscriptionContrat`, nouvelle route `contrats/nouveau` (lazy, comme les autres).
2. `FormGroup` typé : `type` (TypeContrat), `clientId`, `ageClient`, `optionsChoisies` — les champs dont `calculerPrimeDevis` (Module 1, `devis.utils.ts`) a besoin.
3. Validateurs : `required` sur les champs essentiels, + un validateur personnalisé (section 4) — par exemple un âge minimum pour souscrire.
4. Réutilise `calculerPrimeDevis` (import direct, aucune raison de la réécrire) pour afficher la prime calculée **en direct** pendant la saisie, via `valueChanges`/`toSignal` (section 6).
5. À la soumission : génère un numéro de contrat avec `genererReference` (section 8, `Math.random` + `concat`), appelle une nouvelle méthode sur `ContratService` (à créer, sur le modèle de `ajouterContrat` existant) qui accepte les données du formulaire plutôt que des valeurs en dur.
6. Affiche les erreurs de validation dans le template (section 5), avec `Object.hasOwn` quelque part dans la logique d'affichage des erreurs si l'occasion s'y prête naturellement (section 8) — pas à forcer si ça ne colle pas.

`FormArray` (section 7) : à utiliser seulement si `optionsChoisies` devient une vraie liste de checkboxes dynamique plutôt qu'un tableau fixe — à voir selon ce qui semble le plus naturel une fois dans le code.

---

## Ce qu'on ne fait pas encore

- **Signal Forms** → Module 6, sur ce même formulaire, pour comparer les deux approches côte à côte
- **Validateurs asynchrones** (ex : vérifier côté serveur qu'un email n'est pas déjà pris) → nécessite `HttpClient`, Module 7
- **Déclaration de sinistre** (mentionnée dans `CLAUDE.md` comme second formulaire du projet) → une fois ce premier formulaire solide, le même schéma se répète

Voir la table de suivi complète : [`docs/traçabilité-js.md`](./traçabilité-js.md).
