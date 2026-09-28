# 🛡️ AssurLite — Apprendre Angular 22 et JavaScript par la pratique

AssurLite est une **mini-application d'assurance** construite pas à pas. Elle sert de **formation progressive** à **Angular 22** (approche moderne : zoneless, signals, standalone) et aux **40 méthodes JavaScript les plus utiles**.

Chaque notion est vue en **3 temps** :

1. 📖 **Leçon** : explication théorique dans `docs/`
2. 🧪 **Exemple générique** : un exemple isolé et minimal dans `src/examples/`, avec ses tests
3. 🏗️ **Pratique** : la notion appliquée dans l'application AssurLite

---

## 🧰 Stack technique

| Outil | Rôle |
| --- | --- |
| **Angular 22** | Framework (standalone, zoneless, OnPush, signals) |
| **TypeScript 6** (strict) | Langage |
| **PrimeNG 22** + PrimeFlex + PrimeIcons | Composants UI et mise en page |
| **json-server** | Fausse API REST (`db.json`) |
| **Vitest** | Tests unitaires |
| **Prettier** | Formatage du code |

---

## 📋 Le domaine métier

- **Clients** : nom, email, date de naissance
- **Contrats** : auto / habitation / santé, avec un statut (actif, résilié, suspendu)
- **Devis** : calcul d'une prime selon l'âge, le type de contrat et les options
- **Sinistres** : déclaration, montant, statut de traitement
- **Authentification** : connexion, routes protégées par des guards, intercepteur HTTP

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS récente)
- npm

### Installation

```bash
git clone https://github.com/Salim-hub42/AssureLite-js-Angular22.git
cd AssureLite-js-Angular22
npm install
```

### Lancer l'application

Il faut **deux terminaux** : un pour l'API, un pour Angular.

```bash
# Terminal 1 : l'API json-server sur http://localhost:3000
npm run api
```

```bash
# Terminal 2 : l'application Angular sur http://localhost:4200
npm start
```

Ouvre ensuite [http://localhost:4200](http://localhost:4200) dans ton navigateur.

---

## 🛠️ Commandes utiles

| Commande | Description |
| --- | --- |
| `npm start` | Serveur de développement (rechargement automatique) |
| `npm run api` | Lance json-server sur le port 3000 |
| `npm test` | Lance tous les tests unitaires (Vitest) |
| `npm test -- --include src/app/app.spec.ts` | Lance un seul fichier de test |
| `npm run build` | Build de production dans `dist/` |
| `npx prettier --write <fichiers>` | Formate le code |

---

## 📚 Plan de la formation

| # | Module | Leçon |
| --- | --- | --- |
| 1 | Bases JS (modèles de données, tableaux, objets) | [01-bases-js.md](docs/01-bases-js.md) |
| 2 | Composants, signals, control flow | [02-composants-signals.md](docs/02-composants-signals.md) |
| 3 | Services, injection de dépendances | [03-services-di.md](docs/03-services-di.md) |
| 4 | Routing, navigation, guards | [04-routing-navigation.md](docs/04-routing-navigation.md) |
| 5 | Reactive Forms (souscription d'un contrat) | [05-reactive-forms.md](docs/05-reactive-forms.md) |
| 6 | Signal Forms (comparaison avec les Reactive Forms) | [06-signal-forms.md](docs/06-signal-forms.md) |
| 7 | HttpClient, Resource API, promesses, JSON | [07-http-resource-api.md](docs/07-http-resource-api.md) |
| 8 | Pipes, directives, `@defer` | [08-pipes-directives-defer.md](docs/08-pipes-directives-defer.md) |
| 9 | Récapitulatif et vérification finale | 🚧 à venir |

Pour savoir **où chaque méthode JavaScript est utilisée** dans le projet, consulte la table de traçabilité : [docs/traçabilité-js.md](docs/traçabilité-js.md).

---

## ✅ Concepts Angular couverts

- Composants standalone, `input()`, `output()`, `model()`
- Signals : `signal`, `computed`, `effect`, `linkedSignal`
- Control flow : `@if`, `@for` (avec `track`), `@switch`, `@empty`, `@defer`
- Injection avec `inject()` et le décorateur `@Service()`
- Routing : lazy loading, paramètres de route, guards (`canActivate`, `canActivateChild`), resolvers
- `HttpClient`, `resource`, `httpResource`, intercepteur d'authentification
- **Reactive Forms** : `FormGroup`, `FormControl`, `FormArray`, `Validators`, validateurs personnalisés
- **Signal Forms** : le même formulaire refait avec la nouvelle API
- Pipes intégrés et pipe personnalisé (`masquerEmail`)
- Directives personnalisées (`autofocus`, `surbrillance`)

## 🟨 Les 40 méthodes JavaScript

| Catégorie | Méthodes |
| --- | --- |
| Tableaux (15) | `push`, `pop`, `shift`, `unshift`, `map`, `filter`, `find`, `findIndex`, `some`, `every`, `reduce`, `forEach`, `includes`, `slice`, `splice` |
| Chaînes (10) | `includes`, `indexOf`, `slice`, `substring`, `replace`, `split`, `trim`, `toUpperCase`, `toLowerCase`, `concat` |
| Objets (5) | `Object.keys`, `Object.values`, `Object.entries`, `Object.assign`, `Object.hasOwn` |
| Nombres / Math (5) | `toFixed`, `toPrecision`, `parseInt`, `parseFloat`, `Math.random` |
| Dates (5) | `getFullYear`, `getMonth`, `getDate`, `toISOString`, `getTime` |
| Set & Map (10) | `add`, `delete`, `has`, `clear`, `size` / `set`, `get`, `has`, `delete`, `clear` |
| Autres | `then`, `catch`, `finally`, `JSON.parse`, `JSON.stringify`, `console.log` |

Chaque méthode est utilisée **dans un vrai cas métier** (calcul de primes, filtrage de contrats, historique, notifications…), jamais de façon artificielle.

---

## 🗂️ Structure du projet

```
├── db.json                  # Données de l'API (clients, contrats, sinistres, users)
├── docs/                    # Leçons de la formation + table de traçabilité
├── public/                  # Fichiers statiques
└── src/
    ├── examples/            # Exemples génériques de chaque module (+ tests)
    └── app/
        ├── auth/            # Page de connexion
        ├── contrats/        # Liste, détail, souscription (Reactive + Signal Forms)
        ├── sinistres/       # Liste des sinistres
        ├── services/        # Auth, contrats, devis, sinistres, historique, notifications
        ├── guards/          # Protection des routes
        ├── interceptors/    # Ajout du token aux requêtes HTTP
        ├── pipes/           # Pipe personnalisé
        ├── directives/      # Directives personnalisées
        ├── validators/      # Validateurs de formulaires
        ├── models/          # Types TypeScript du domaine
        └── app.routes.ts    # Routes (lazy loading)
```

---

## 📈 Avancement

- [x] Modules 1 à 7
- [ ] Module 8 : pipes, directives, `@defer` (en cours)
- [ ] Module 9 : récapitulatif final

---

## 👤 Auteur

**Salim** — [@Salim-hub42](https://github.com/Salim-hub42)

Projet d'apprentissage personnel.
