# Module 8 — Pipes, directives, `@defer` et finitions

## Objectifs

À la fin de ce module, tu sauras :

- Utiliser les **pipes intégrés** (`date`, `currency`, `number`, `percent`, `uppercase`, `titlecase`…) et leur passer des **paramètres**
- Passer l'application **en français** (`LOCALE_ID`) pour que les dates et les montants s'affichent « à la française »
- Écrire un **pipe personnalisé** (`@Pipe`, `PipeTransform`), et savoir quand préférer un `computed()`
- Distinguer les **trois familles de directives** et reconnaître les directives intégrées que tu utilises déjà
- Écrire une **directive d'attribut** personnalisée (`@Directive`, `host`, `input()`)
- Écrire une directive qui **touche au DOM** proprement (`ElementRef`, `afterNextRender`) — ici pour l'accessibilité
- **Différer** le chargement d'un morceau de page avec `@defer`, ses déclencheurs et ses blocs `@placeholder` / `@loading` / `@error`
- Utiliser un tableau comme une **pile** ou une **file** (`push` / `pop` / `shift` / `unshift` / `slice`) sans casser la réactivité des signals
- Nettoyer une **saisie texte** avant d'en faire un nombre (`replace` + `parseFloat`), afficher un nombre avec `toPrecision`

Ce module **termine** la table de traçabilité : les 10 méthodes encore ⏳ (`pop`, `shift`, `unshift`, `slice` tableau, `indexOf`, `slice` / `substring` / `replace` chaîne, `toPrecision`, `parseFloat`) trouvent toutes leur cas métier ici.

---

## 1. Les pipes : transformer une valeur pour l'affichage

Un **pipe** transforme une valeur **au moment de l'afficher**, dans le template, sans toucher à la donnée elle-même.

```html
<p>{{ contrat.dateDebut | date: 'dd/MM/yyyy' }}</p>
<!--   valeur d'entrée  ↑ nom  ↑ paramètre  -->
```

Tu en utilises déjà un : le `date` du détail de contrat. La barre `|` se lit « passe cette valeur dans ».

Pourquoi ne pas simplement formater dans le TypeScript ?

- **La donnée reste propre** : `dateDebut` reste une vraie `Date` (on peut encore la comparer, la trier). Seul l'**affichage** change.
- **Réutilisable** : le même pipe sert dans tous les templates, sans recopier de code.
- **Performant** : un pipe « pur » (le cas par défaut) n'est recalculé que si sa valeur d'entrée change (§5).

### Paramètres et chaînage

```html
{{ prime | currency: 'EUR' : 'symbol' : '1.2-2' }}
<!-- plusieurs paramètres, séparés par « : » -->
{{ client.nom | slice: 0 : 10 | uppercase }}
<!-- chaînage : de gauche à droite -->
```

Chaque pipe reçoit **le résultat du précédent**. Ici : on coupe à 10 caractères, **puis** on met en majuscules.

### Importer un pipe

Comme les composants, un pipe doit être **importé** dans le composant qui l'utilise :

```ts
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe, CurrencyPipe],
  // ...
})
```

Oublier l'import donne l'erreur `NG0302: The pipe 'currency' could not be found`.

---

## 2. Les pipes intégrés les plus utiles

Tous viennent de `@angular/common`.

| Pipe        | Classe à importer | Exemple                                      | Résultat (en français)          |
| ----------- | ----------------- | -------------------------------------------- | ------------------------------- |
| `date`      | `DatePipe`        | `d \| date: 'longDate'`                      | `25 septembre 2026`             |
| `date`      | `DatePipe`        | `d \| date: 'dd/MM/yyyy'`                    | `25/09/2026`                    |
| `currency`  | `CurrencyPipe`    | `1234.5 \| currency: 'EUR'`                  | `1 234,50 €`                    |
| `number`    | `DecimalPipe`     | `3.14159 \| number: '1.0-2'`                 | `3,14`                          |
| `percent`   | `PercentPipe`     | `0.125 \| percent: '1.1-1'`                  | `12,5 %`                        |
| `uppercase` | `UpperCasePipe`   | `'auto' \| uppercase`                        | `AUTO`                          |
| `lowercase` | `LowerCasePipe`   | `'AUTO' \| lowercase`                        | `auto`                          |
| `titlecase` | `TitleCasePipe`   | `'habitation' \| titlecase`                  | `Habitation`                    |
| `slice`     | `SlicePipe`       | `liste \| slice: 0 : 3`                      | les 3 premiers éléments         |
| `json`      | `JsonPipe`        | `objet \| json`                              | l'objet en texte (debug)        |
| `keyvalue`  | `KeyValuePipe`    | `@for (e of objet \| keyvalue; track e.key)` | parcourir un objet              |
| `async`     | `AsyncPipe`       | `obs$ \| async`                              | dernière valeur d'un Observable |

Le format `'1.2-2'` des pipes numériques se lit : **au moins 1 chiffre** avant la virgule, **entre 2 et 2** chiffres après. `'1.0-2'` : de 0 à 2 décimales.

> `percent` attend une **fraction** : `0.125` s'affiche `12,5 %`. Lui donner `12.5` afficherait `1 250 %`.

---

## 3. Passer l'application en français : `LOCALE_ID`

Par défaut, Angular formate « à l'américaine » : `$1,234.50`, `September 25, 2026`. Pour le français, deux choses dans `app.config.ts` :

```ts
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// 1. Charger les règles françaises (noms des mois, séparateurs…)
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. Dire à Angular d'utiliser ces règles partout
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }, // `| currency` sans paramètre → euros
    // ... les autres providers
  ],
};
```

- `registerLocaleData` **charge** les données de la langue (sans lui : erreur `Missing locale data for the locale "fr-FR"`).
- `LOCALE_ID` est un **jeton d'injection** (comme au Module 3) : tous les pipes le lisent pour savoir comment formater.
- Après ça, `{{ 1234.5 | currency }}` affiche `1 234,50 €`.

> Les espaces dans `1 234,50 €` sont des **espaces insécables** (caractères `U+00A0` et `U+202F`), pas des espaces normaux : ça empêche un retour à la ligne entre `1` et `234`. À savoir si tu compares ce texte dans un test (utilise une regex avec `\s`).

---

## 4. Écrire un pipe personnalisé

Quand aucun pipe intégré ne fait l'affaire, on écrit le sien. Exemple : couper une description trop longue **sans couper un mot en deux**.

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tronquer' })
export class TronquerPipe implements PipeTransform {
  transform(texte: string, max = 20): string {
    if (texte.length <= max) {
      return texte;
    }
    const espace = texte.indexOf(' ', max); // premier espace à partir de la position max
    return espace === -1 ? texte : texte.substring(0, espace) + '…';
  }
}
```

```html
<p>{{ velo.description | tronquer: 30 }}</p>
<!--        1er argument ↑        ↑ 2e argument (max) -->
```

Décortiquons :

- **`@Pipe({ name: 'tronquer' })`** : le nom utilisé dans le template. Comme pour les composants, pas besoin de `standalone: true` (c'est le défaut).
- **`implements PipeTransform`** : un **contrat** TypeScript. Il oblige la classe à avoir une méthode `transform`. Si tu l'oublies ou la nommes mal, TypeScript te prévient.
- **`transform(valeur, ...paramètres)`** : la valeur à gauche du `|` arrive en **premier argument**, les paramètres après les `:` ensuite. Ici `max = 20` est un **paramètre par défaut** : si le template n'en donne pas, il vaut 20.
- Le pipe renvoie une **nouvelle** valeur, il ne modifie jamais celle qu'il reçoit.

### Les méthodes de chaînes qui servent dans les pipes

| Méthode                     | Rôle                                                                  | Exemple                                 |
| --------------------------- | --------------------------------------------------------------------- | --------------------------------------- |
| `indexOf(cherche, depuis?)` | position de la **première** occurrence, ou `-1`                       | `'a@b.fr'.indexOf('@')` → `1`           |
| `slice(debut, fin?)`        | extrait de `debut` **jusqu'à** `fin` (exclue) ; accepte les négatifs  | `'0612345678'.slice(-2)` → `'78'`       |
| `substring(debut, fin?)`    | comme `slice`, mais **sans** négatifs (un négatif vaut 0)             | `'bonjour'.substring(0, 3)` → `'bon'`   |
| `replace(motif, par)`       | remplace la **première** occurrence (ou toutes avec une regex `/…/g`) | `'1 234'.replace(/\s/g, '')` → `'1234'` |

`slice` ou `substring` ? Pour des positions positives, c'est identique. `slice(-2)` (« les 2 derniers ») n'a pas d'équivalent simple avec `substring` : c'est la raison d'être de `slice`.

`-1` est la réponse de `indexOf` quand il ne trouve rien. **Toujours** le tester avant d'utiliser la position : `texte.substring(0, -1)` donnerait une chaîne vide, sans erreur, et le bug passerait inaperçu.

Deuxième exemple, pour `replace` et `slice` : masquer un numéro de téléphone.

```ts
@Pipe({ name: 'masquerTelephone' })
export class MasquerTelephonePipe implements PipeTransform {
  transform(tel: string): string {
    const chiffres = tel.replace(/\s/g, ''); // "06 12 34 56 78" → "0612345678"
    if (chiffres.length < 4) {
      return tel;
    }
    return chiffres.slice(0, 2) + '•'.repeat(chiffres.length - 4) + chiffres.slice(-2);
  } // → "06••••••78"
}
```

`/\s/g` est une **expression régulière** : `\s` = « n'importe quel espace », `g` = « **tous**, pas seulement le premier ». Sans le `g`, seul le premier espace disparaîtrait.

---

## 5. Pipe pur, pipe impur, et pipe ou `computed()` ?

Par défaut, un pipe est **pur** : Angular ne rappelle `transform` que si la valeur d'entrée (ou un paramètre) **change de référence**. Deux conséquences :

- C'est rapide : même si la page se redessine 100 fois, le pipe ne recalcule que quand il le faut.
- Si tu **modifies** un tableau sur place (`liste.push(x)`), la référence ne change pas → le pipe ne voit rien. C'est une raison de plus de toujours **recopier** (même règle que pour les signals, §10).

Un pipe **impur** (`@Pipe({ name: '…', pure: false })`) est recalculé à **chaque** vérification de la page. À éviter : c'est lent, et presque toujours contournable.

**Pipe ou `computed()` ?**

| Utilise un…      | Quand…                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **pipe**         | c'est une **mise en forme** réutilisable dans plusieurs templates (date, montant, masquage)                     |
| **`computed()`** | c'est une **donnée dérivée** propre à un composant (total, liste filtrée), ou que le TypeScript doit aussi lire |

Exemple AssurLite : `primeTotale` est un `computed` (c'est une donnée, on peut la réutiliser dans un calcul) ; son **affichage** en euros est un pipe (`{{ primeTotale() | currency }}`).

---

## 6. Les directives : trois familles

Une **directive** ajoute un comportement à un élément HTML. Il en existe trois familles :

| Famille                    | Ce qu'elle fait                                               | Exemples                                                         |
| -------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Composant**              | une directive **avec un template**                            | tous tes composants (`<app-contrat-ligne>`…)                     |
| **Directive structurelle** | ajoute / retire des éléments du DOM                           | `*ngIf`, `*ngFor` — **remplacées** par `@if` / `@for` (Module 2) |
| **Directive d'attribut**   | modifie l'aspect ou le comportement d'un élément **existant** | `routerLink`, `[formField]`, `formControlName`, `pButton`        |

Tu utilises déjà beaucoup de directives d'attribut « classiques », fournies par Angular ou PrimeNG :

- `routerLink` (Module 4) : transforme un `<a>` en lien de navigation interne ;
- `formControlName` / `[formGroup]` (Module 5) et `[formField]` (Module 6) : relient un `<input>` à un formulaire ;
- `pButton` (PrimeNG) : donne le style et le comportement d'un bouton PrimeNG à un `<button>` ordinaire.

Point commun : on les écrit **comme un attribut** sur un élément qui existe déjà. C'est ce qu'on va apprendre à écrire.

---

## 7. Écrire une directive d'attribut : `host` + `input()`

Objectif : mettre en évidence un élément selon une condition, par exemple les vélos en promotion.

```ts
import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appSurbrillance]',
  host: {
    '[class.surbrillance]': 'actif()',
  },
})
export class SurbrillanceDirective {
  readonly actif = input(false, { alias: 'appSurbrillance' });
}
```

```html
<li [appSurbrillance]="velo.enPromo">…</li>
```

- **`selector: '[appSurbrillance]'`** : les **crochets** veulent dire « tout élément qui porte l'**attribut** `appSurbrillance` ». (Un composant a un sélecteur sans crochets, `'app-…'` : c'est une **balise**.) Le préfixe `app` évite les collisions avec de futurs attributs HTML.
- **`host`** : ce que la directive fait **sur l'élément qui la porte** (son « hôte »). `'[class.surbrillance]': 'actif()'` est une liaison de classe, exactement comme `[class.surbrillance]="…"` dans un template : la classe est ajoutée quand `actif()` vaut `true`.
- **`input(false, { alias: 'appSurbrillance' })`** : l'alias permet d'écrire `[appSurbrillance]="…"` (nom de la directive **et** valeur en même temps) au lieu de `appSurbrillance [actif]="…"`.

> Ne pas utiliser `@HostBinding` / `@HostListener` : ce sont les anciens décorateurs. On met tout dans l'objet `host` (règle du projet). Pour écouter un événement : `host: { '(click)': 'auClic()' }`.

Il faut aussi **importer** la directive dans le composant qui l'utilise (`imports: [SurbrillanceDirective]`), comme un pipe. Et la classe `.surbrillance` doit exister dans le SCSS de ce composant.

> **Accessibilité** : une couleur seule ne suffit jamais à transmettre une information (WCAG 1.4.1). Si la surbrillance veut dire « en promo », le texte doit aussi le dire (un badge « Promo », une étiquette…). La surbrillance ne fait que **renforcer** visuellement.

---

## 8. Une directive qui touche au DOM : l'autofocus

Sur une page de connexion, l'utilisateur veut taper son e-mail tout de suite. L'attribut HTML `autofocus` existe, mais il ne marche qu'au **premier chargement** de la page, pas quand Angular affiche une nouvelle route. D'où une directive :

```ts
import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => this.element.nativeElement.focus());
  }
}
```

```html
<input id="email" appAutofocus />
```

- **`ElementRef`** : une « poignée » vers l'élément HTML qui porte la directive. `nativeElement` est le vrai élément du navigateur (`HTMLElement`). Le `<HTMLElement>` entre chevrons précise son type (c'est un **générique**, comme `signal<number>`).
- **`afterNextRender(...)`** : « exécute ça **une fois**, juste après le prochain affichage ». Dans le constructeur, l'élément n'est pas encore dans la page ; le focus doit attendre qu'il le soit.
- Pas de `host` ici : on n'a rien à lier, on agit **une fois** sur l'élément.

> **Accessibilité** : l'autofocus aide sur une page dont c'est **la seule action** (login, recherche). Ailleurs, il désoriente (un lecteur d'écran saute au milieu de la page). À réserver à ces cas-là.

---

## 9. `@defer` : ne charger un morceau de page que quand il sert

Certaines parties d'une page sont **lourdes** (un graphique, des statistiques) et **pas visibles tout de suite** (en bas de page). `@defer` retarde leur chargement :

```html
@defer (on viewport) {
<app-avis-velo [notes]="notes()" />
} @placeholder {
<p>Les avis s'afficheront en arrivant ici…</p>
} @loading (minimum 300ms) {
<p>Chargement des avis…</p>
} @error {
<p>Impossible de charger les avis.</p>
}
```

Ce qui se passe :

1. Au départ, Angular affiche le **`@placeholder`**. Le code du composant `AvisVelo` n'est **pas** téléchargé.
2. Quand le déclencheur se produit (ici : le placeholder entre dans l'écran), Angular **télécharge** le code du composant et affiche **`@loading`** pendant ce temps.
3. Une fois chargé, le contenu principal remplace tout. En cas d'échec du téléchargement : **`@error`**.

`@placeholder`, `@loading` et `@error` sont **facultatifs**. `minimum 300ms` évite un clignotement quand le chargement est très rapide.

### Les déclencheurs

| Déclencheur            | Le bloc se charge…                                             |
| ---------------------- | -------------------------------------------------------------- |
| `on idle` (par défaut) | quand le navigateur n'a plus rien à faire                      |
| `on viewport`          | quand le bloc **entre dans l'écran** (défilement)              |
| `on interaction`       | au premier **clic** ou **touche** sur le placeholder           |
| `on hover`             | quand la souris **survole** le placeholder                     |
| `on timer(2s)`         | après un délai                                                 |
| `on immediate`         | tout de suite après l'affichage de la page                     |
| `when condition`       | quand une **condition** devient vraie (`when afficherStats()`) |

On peut aussi **précharger** en avance : `@defer (on interaction; prefetch on idle)` télécharge le code dès que le navigateur est libre, mais n'affiche le bloc qu'au clic.

### Les règles à connaître

- Seuls les composants, directives et pipes **standalone** peuvent être différés (c'est le cas de tous les tiens).
- Le composant différé ne doit **pas être utilisé ailleurs** dans le même fichier en dehors d'un `@defer`, sinon il est chargé d'emblée et le `@defer` ne sert plus à rien.
- `on viewport`, `on interaction` et `on hover` surveillent le **`@placeholder`** : il doit contenir **un seul** élément racine.
- `@defer` ne charge pas de **données** : il retarde le **code** et l'**affichage**. Si le composant différé fait une requête HTTP, elle ne partira qu'à ce moment-là, ce qui est souvent un bonus.

---

## 10. Les tableaux comme piles et comme files

Jusqu'ici tu as surtout transformé des tableaux (`map`, `filter`, `reduce`). Quatre méthodes servent à **ajouter ou retirer aux extrémités** :

```
             unshift →  [ A, B, C, D ]  ← push
             ← shift                     pop →
                 (début)          (fin)
```

| Méthode      | Où ?     | Fait              | Renvoie                           |
| ------------ | -------- | ----------------- | --------------------------------- |
| `push(x)`    | à la fin | ajoute `x`        | la nouvelle longueur              |
| `pop()`      | à la fin | retire le dernier | l'élément retiré (ou `undefined`) |
| `unshift(x)` | au début | ajoute `x`        | la nouvelle longueur              |
| `shift()`    | au début | retire le premier | l'élément retiré (ou `undefined`) |

Les quatre **modifient le tableau sur place**. Deux usages classiques :

- **Une file (FIFO, « premier arrivé, premier servi »)** : on ajoute à la fin (`push`), on traite depuis le début (`shift`). Exemple : des commandes à préparer, des notifications à afficher.
- **Un historique borné** : on ajoute le plus récent **au début** (`unshift`), et quand c'est trop long on retire le plus ancien **à la fin** (`pop`).

### `slice` sur un tableau

`slice(debut, fin?)` renvoie une **copie** d'un morceau du tableau, sans modifier l'original :

```ts
const derniers = historique.slice(0, 3); // les 3 premiers éléments
const copie = historique.slice(); // sans argument : une copie complète
```

(Même nom et même logique que `slice` sur les chaînes, §4.)

### Avec les signals : copier, modifier la copie, renvoyer la copie

`push` / `pop` / `shift` / `unshift` modifient **sur place**. Or un signal ne voit un changement que si on lui donne une **nouvelle référence** (règle du projet : pas de `mutate`). On applique donc le même patron que pour le `Set` des filtres (Module 3) :

```ts
readonly file = signal<string[]>([]);

ajouter(commande: string): void {
  this.file.update((f) => {
    const copie = f.slice(); // 1. copie
    copie.push(commande);    // 2. on modifie la COPIE
    return copie;            // 3. on renvoie la copie → nouvelle référence
  });
}

traiterSuivante(): string | undefined {
  const copie = this.file().slice();
  const premiere = copie.shift(); // on récupère ET on retire le premier
  this.file.set(copie);
  return premiere;
}
```

`shift()` renvoie l'élément retiré, ce qui est pratique pour une file : on sait **quoi** traiter. Si la file est vide, il renvoie `undefined`, d'où le type de retour `string | undefined`.

Historique borné, en fonction pure :

```ts
export const MAX_HISTORIQUE = 5;

export function ajouterAHistorique(historique: string[], recherche: string): string[] {
  const copie = historique.slice();
  copie.unshift(recherche); // la plus récente en tête
  if (copie.length > MAX_HISTORIQUE) {
    copie.pop(); // la plus ancienne (en queue) sort
  }
  return copie;
}
```

---

## 11. Nombres : nettoyer une saisie, arrondir un affichage

### `replace` + `parseFloat` : un montant tapé à la française

Un champ `type="number"` refuse `1 299,90`. Or c'est ainsi qu'un Français écrit un montant. On accepte donc du **texte**, puis on le **nettoie** :

```ts
export function parserPrix(saisie: string): number | null {
  const normalise = saisie.replace(/\s/g, '').replace(',', '.'); // "1 299,90 €" → "1299.90€"
  const prix = parseFloat(normalise); // → 1299.9 (s'arrête au "€")
  return Number.isNaN(prix) ? null : prix;
}
```

- **`replace(/\s/g, '')`** retire **tous** les espaces (y compris insécables).
- **`replace(',', '.')`** : `parseFloat` ne comprend que le **point** décimal. Sans ce remplacement, `parseFloat('1299,90')` renverrait `1299` : les centimes disparaîtraient sans erreur.
- **`parseFloat`** lit le début de la chaîne et **s'arrête** au premier caractère invalide (ici `€`). C'est pour ça qu'on l'utilise plutôt que `Number('1299.90€')`, qui renverrait `NaN`.
- **`Number.isNaN`** : si rien n'est lisible (`'abc'`), on renvoie `null` et c'est au formulaire d'afficher une erreur.

### `toPrecision` : un nombre de chiffres **significatifs**

`toFixed(2)` (Module 1) fixe le nombre de chiffres **après la virgule**. `toPrecision(n)` fixe le nombre de chiffres **au total**, quelle que soit la taille du nombre :

```ts
(4.3333).toPrecision(2); // "4.3"
(0.012345).toPrecision(3); // "0.0123"
(12.345).toPrecision(3); // "12.3"
(5).toPrecision(2); // "5.0"
```

Utile pour un **ratio** ou une **moyenne**, où seuls les premiers chiffres ont du sens :

```ts
export function noteMoyenne(notes: number[]): string {
  if (notes.length === 0) {
    return '–';
  }
  const moyenne = notes.reduce((somme, n) => somme + n, 0) / notes.length;
  return moyenne.toPrecision(2); // [4, 5, 4] → "4.3"
}
```

Comme `toFixed`, `toPrecision` renvoie une **chaîne** (avec un point, pas une virgule). Pour un affichage français, on la repasse en nombre et dans le pipe `number` : `{{ +moyenne | number }}`, ou on garde la chaîne telle quelle quand le point ne gêne pas.

> Attention : pour de très grands ou très petits nombres, `toPrecision` passe en **notation scientifique** : `(123456).toPrecision(2)` → `"1.2e+5"`. Réserve-le aux valeurs dont tu connais l'ordre de grandeur (un pourcentage, une note sur 5).

---

## 12. Où s'insèrent les méthodes JS de ce module

| Méthode           | Cas métier AssurLite                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| `indexOf`         | pipe `masquerEmail` : position du `@` dans l'e-mail de l'utilisateur connecté          |
| `slice` (chaîne)  | pipe `masquerEmail` : garder les 2 premiers caractères                                 |
| `substring`       | pipe `masquerEmail` : garder le domaine, du `@` jusqu'à la fin                         |
| `replace`         | déclaration de sinistre : retirer les espaces et remplacer la virgule du montant saisi |
| `parseFloat`      | déclaration de sinistre : montant texte → nombre                                       |
| `toPrecision`     | statistiques des sinistres : taux de sinistralité (sinistres / primes)                 |
| `unshift`         | historique des contrats consultés : le plus récent en tête                             |
| `pop`             | historique des contrats consultés : on retire le plus ancien au-delà de 5              |
| `slice` (tableau) | copie avant modification (signals) ; afficher les 3 derniers consultés                 |
| `shift`           | file de notifications : on ferme la plus ancienne                                      |

---

## Pour la pratique

Objectif du module côté `src/app/`, en petites étapes :

1. **Français et pipes intégrés.** `registerLocaleData(localeFr)` + `LOCALE_ID` + `DEFAULT_CURRENCY_CODE` dans `app.config.ts`. Puis remplacer les `{{ … }} €` écrits à la main par `| currency` (ligne de contrat, détail, total), mettre la date du détail en `longDate`, et le type de contrat en `| titlecase`.
2. **Pipe `masquerEmail`.** `salim@gmail.com` → `sa***@gmail.com` (`indexOf`, `slice`, `substring`), avec un test. Ajouter `email` à la `Session` (le login le connaît déjà), et afficher « Connecté : sa***@gmail.com » à côté du bouton « Se déconnecter ».
3. **Directives.** `appAutofocus` sur le champ e-mail du login ; `appSurbrillance` sur les lignes de contrats **résiliés** dans la liste.
4. **Historique des contrats consultés.** Un `HistoriqueService` (`signal<number[]>`, `unshift` + `pop`, maximum 5) alimenté par `ContratDetail`, et les 3 derniers (`slice`) affichés dans la liste sous forme de liens.
5. **File de notifications.** Un `NotificationService` : `push` pour un message normal (contrat souscrit, supprimé), `unshift` pour une erreur (elle passe devant), `shift` quand l'utilisateur ferme la notification affichée. Affichage dans `App`.
6. **Sinistres.** Renommer la collection `sinistre` → `sinistres` dans `db.json`. Une page `/sinistres` (lazy, protégée) avec la liste (`httpResource` + pipes) et un formulaire de déclaration (Reactive Forms) dont le **montant est un champ texte** nettoyé par `replace` + `parseFloat`. En bas de page, un bloc **statistiques** en `@defer (on viewport)` avec le taux de sinistralité (`toPrecision`).
7. **Traçabilité et bilan.** Les 10 méthodes restantes cochées, et vérification finale au Module 9.

---

## Ce qu'on ne fait pas encore

- **Internationalisation complète** (`@angular/localize`, plusieurs langues, traduction des textes) : ici on règle seulement le **format** des dates et nombres.
- **Directives structurelles personnalisées** (`ng-template`, `ViewContainerRef`) : le control flow `@if` / `@for` couvre presque tous les besoins.
- **Composition de directives** (`hostDirectives`) : utile dans une bibliothèque de composants, pas dans une petite app.
- **`@defer` et le rendu serveur** (hydratation incrémentale, `hydrate on …`) : hors sujet sans SSR.

Voir la table de suivi : [`docs/traçabilité-js.md`](./traçabilité-js.md).
