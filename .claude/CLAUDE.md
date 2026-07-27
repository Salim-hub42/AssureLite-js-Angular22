
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

---

# AssurLite — Formation Angular 22 + JavaScript par la pratique

## Objectif du projet

Construire une mini-application d'assurance (« AssurLite ») qui sert de **formation complète et progressive**. Chaque notion est enseignée en 3 temps :

1. **Leçon** : explication théorique bien structurée et pédagogique dans un fichier `docs/XX-nom-module.md`
2. **Exemple générique** : petit exemple isolé et minimal de la notion
3. **Pratique** : application de la notion dans le projet AssurLite

L'utilisateur est débutant : il veut comprendre tous les concepts Angular et les 40 méthodes les plus utiles en JavaScript.

## Le domaine métier (volontairement simple)

- **Clients** : nom, email, date de naissance
- **Contrats** : auto / habitation / santé, statut (actif, résilié, suspendu)
- **Devis** : calcul d'une prime selon âge, type de contrat, options
- **Sinistres** : déclaration, montant, statut de traitement

Backend : json-server, avec authentification à mettre en place.

## Couverture Angular 22 obligatoire

Utiliser exclusivement les pratiques modernes (projet zoneless, OnPush par défaut) :

- Composants standalone, `input()` / `output()` / `model()`
- Signals : `signal`, `computed`, `effect`, `linkedSignal`
- Nouveau control flow : `@if`, `@for` (avec `track`), `@switch`, `@defer`, `@empty`
- `inject()` (jamais l'injection par constructeur)
- Services et injection de dépendances
- Routing : lazy loading, paramètres de route, guards, resolvers
- Resource API : `resource`, `httpResource` (stables en v22), `HttpClient`
- **Reactive Forms** : `FormGroup`, `FormControl`, `FormArray`, `Validators`, validateurs personnalisés, `valueChanges` — module dédié important (formulaire de souscription, déclaration de sinistre)
- **Signal Forms** (stables en v22) : refaire un des formulaires en Signal Forms pour comparer ancien/nouveau monde
- Pipes intégrés + un pipe personnalisé, directive personnalisée et classique
- `HttpClient` + un intercepteur simple

## Couverture JavaScript obligatoire : les 40 méthodes

Chaque méthode doit être utilisée **au moins une fois dans un vrai cas métier** (pas artificiellement). Tenir à jour une **table de traçabilité** dans `docs/traçabilité-js.md` : méthode → fichier → ligne/contexte → module de la formation.

- **Tableaux (15)** : push, pop, shift, unshift, map, filter, find, findIndex, some, every, reduce, forEach, includes, slice, splice → listes de contrats, sinistres, calculs de totaux
- **Chaînes (10)** : includes, indexOf, slice, substring, replace, split, trim, toUpperCase, toLowerCase, concat → recherche client, formatage, validation d'email
- **Objets (5)** : Object.keys, values, entries, assign, hasOwn → manipulation des modèles
- **Nombres/Math (5)** : toFixed, toPrecision, parseInt, parseFloat, Math.random → calcul de devis, primes, numéros de contrat
- **Dates (5)** : getFullYear, getMonth, getDate, toISOString, getTime → âge du client, échéances
- **Sets & Maps (10)** : add, delete, has, clear, size / set, get, has, delete, clear → types de contrats uniques, cache de devis
- **Autres (5)** : then, catch, finally, JSON.parse, JSON.stringify, console.log → chargement des données JSON

## Plan de formation (ordre imposé)

1. Bases JS dans le contexte du projet (modèles de données, méthodes tableaux/objets)
2. Composants, signals, control flow (liste des contrats)
3. Services, DI, communication entre composants
4. Routing et navigation (pages clients / contrats / sinistres), guards
5. Reactive Forms (souscription d'un contrat — module long)
6. Signal Forms (comparaison sur le formulaire de devis)
7. HttpClient, Resource API, promesses, JSON
8. Pipes, directives, `@defer`, finitions
9. Récapitulatif + vérification de la table de traçabilité (les 40 méthodes et tous les concepts Angular cochés)

## Règles de travail

- Tout en **français** (code en anglais, commentaires et docs en français)
- TypeScript strict, mais expliquer les types quand ils apparaissent
- À la fin de chaque module : résumé de ce qui a été appris + mise à jour de la traçabilité
- Ne jamais sauter les étapes « leçon » et « exemple générique » avant la pratique
