// Exemple générique — Module 1 (bases JS)
// Volontairement hors du domaine "assurance" : on isole la syntaxe pure,
// sans le bruit du métier. La version "assurance" est dans src/app/models/*.utils.ts.

interface Produit {
  nom: string;
  categorie: string;
  prix: number;
  enStock: boolean;
}

const produits: Produit[] = [
  { nom: 'Clavier', categorie: 'informatique', prix: 39.9, enStock: true },
  { nom: 'Souris', categorie: 'informatique', prix: 19.9, enStock: false },
  { nom: 'Cahier', categorie: 'papeterie', prix: 2.5, enStock: true },
  { nom: 'Stylo', categorie: 'papeterie', prix: 1.2, enStock: true }
];

// find : le PREMIER élément qui correspond, ou undefined si aucun
export function trouverProduitParNom(nom: string): Produit | undefined {
  return produits.find((produit) => produit.nom === nom);
}

// filter : TOUS les éléments qui correspondent
export function produitsEnStock(): Produit[] {
  return produits.filter((produit) => produit.enStock);
}

// map : transforme chaque élément (même longueur en sortie qu'en entrée)
export function nomsDesProduits(): string[] {
  return produits.map((produit) => produit.nom);
}

// reduce : agrège tout le tableau en une seule valeur
export function prixTotalDuStock(): number {
  return produitsEnStock().reduce((total, produit) => total + produit.prix, 0);
}

// forEach : exécute une action pour chaque élément, ne retourne rien
export function afficherCatalogue(): void {
  produits.forEach((produit) => console.log(`${produit.nom} — ${produit.prix} €`));
}

// some : au moins un élément correspond ?
export function auMoinsUnProduitEnRupture(): boolean {
  return produits.some((produit) => !produit.enStock);
}

// every : tous les éléments correspondent ?
export function tousLesProduitsSontValorises(): boolean {
  return produits.every((produit) => produit.prix > 0);
}

// includes : une valeur précise est-elle présente dans le tableau ?
export function categorieExiste(categorie: string): boolean {
  return produits.map((produit) => produit.categorie).includes(categorie);
}

// Object.keys / values / entries : inspecter un objet sans connaître ses clés à l'avance
export function champsDuProduit(produit: Produit): string[] {
  return Object.keys(produit);
}

export function resumerProduit(produit: Produit): string {
  return Object.entries(produit)
    .map(([champ, valeur]) => `${champ}=${valeur}`)
    .join(', ');
}

// Set : extraire des valeurs uniques
export function categoriesUniques(): Set<string> {
  const categories = new Set<string>();
  produits.forEach((produit) => categories.add(produit.categorie));
  return categories;
}
