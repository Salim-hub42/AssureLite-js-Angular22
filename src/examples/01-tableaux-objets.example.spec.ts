import { describe, expect, it } from 'vitest';
import {
  afficherCatalogue,
  auMoinsUnProduitEnRupture,
  categorieExiste,
  categoriesUniques,
  champsDuProduit,
  nomsDesProduits,
  prixTotalDuStock,
  produitsEnStock,
  resumerProduit,
  tousLesProduitsSontValorises,
  trouverProduitParNom
} from './01-tableaux-objets.example';

describe('Exemple générique — tableaux et objets', () => {
  it('find : retourne le produit correspondant, ou undefined', () => {
    expect(trouverProduitParNom('Clavier')?.prix).toBe(39.9);
    expect(trouverProduitParNom('Inconnu')).toBeUndefined();
  });

  it('filter : ne garde que les produits en stock', () => {
    expect(produitsEnStock().map((p) => p.nom)).toEqual(['Clavier', 'Cahier', 'Stylo']);
  });

  it('map : transforme la liste de produits en liste de noms', () => {
    expect(nomsDesProduits()).toEqual(['Clavier', 'Souris', 'Cahier', 'Stylo']);
  });

  it('reduce : additionne les prix des produits en stock', () => {
    expect(prixTotalDuStock()).toBeCloseTo(39.9 + 2.5 + 1.2);
  });

  it('forEach : ne lève pas d’erreur en parcourant le catalogue', () => {
    expect(() => afficherCatalogue()).not.toThrow();
  });

  it('some : détecte au moins une rupture de stock', () => {
    expect(auMoinsUnProduitEnRupture()).toBe(true);
  });

  it('every : tous les produits ont un prix strictement positif', () => {
    expect(tousLesProduitsSontValorises()).toBe(true);
  });

  it('includes : vérifie la présence d’une catégorie', () => {
    expect(categorieExiste('papeterie')).toBe(true);
    expect(categorieExiste('jardinage')).toBe(false);
  });

  it('Object.keys : liste les champs d’un produit', () => {
    expect(champsDuProduit({ nom: 'Test', categorie: 'x', prix: 1, enStock: true })).toEqual([
      'nom',
      'categorie',
      'prix',
      'enStock'
    ]);
  });

  it('Object.entries + map : résume un produit en texte', () => {
    expect(resumerProduit({ nom: 'Stylo', categorie: 'papeterie', prix: 1.2, enStock: true })).toBe(
      'nom=Stylo, categorie=papeterie, prix=1.2, enStock=true'
    );
  });

  it('Set : élimine les doublons de catégories', () => {
    const categories = categoriesUniques();
    expect(categories.has('informatique')).toBe(true);
    expect(categories.size).toBe(2);
  });
});
