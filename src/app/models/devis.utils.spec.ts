import { describe, expect, it } from 'vitest';
import { Devis } from './devis.model';
import { appliquerMajorationAge, calculerPrimeDevis, primeDeBase } from './devis.utils';

describe('primeDeBase', () => {
  it('renvoie le prix de base pour un contrat auto', () => {
    expect(primeDeBase('auto')).toBe(400);
  });

  it('renvoie le prix de base pour un contrat habitation', () => {
    expect(primeDeBase('habitation')).toBe(250);
  });

  it('renvoie le prix de base pour un contrat santé', () => {
    expect(primeDeBase('sante')).toBe(300);
  });
});

describe('appliquerMajorationAge', () => {
  it('majore de 20% en dessous de 25 ans', () => {
    expect(appliquerMajorationAge(400, 20)).toBe(480);
  });

  it('majore de 10% au-dessus de 65 ans', () => {
    expect(appliquerMajorationAge(400, 70)).toBe(440);
  });

  it('ne majore pas entre 25 et 65 ans inclus', () => {
    expect(appliquerMajorationAge(400, 40)).toBe(400);
  });

  it('ne majore pas à exactement 25 ans (limite basse incluse)', () => {
    expect(appliquerMajorationAge(400, 25)).toBe(400);
  });

  it('ne majore pas à exactement 65 ans (limite haute incluse)', () => {
    expect(appliquerMajorationAge(400, 65)).toBe(400);
  });
});

describe('calculerPrimeDevis', () => {
  it('compose primeDeBase et appliquerMajorationAge pour un jeune assuré', () => {
    const devis: Devis = { id: 1, clientId: 1, typeDeContrat: 'auto', ageClient: 20, optionsChoisies: [] };

    expect(calculerPrimeDevis(devis)).toBe(480);
  });

  it('compose primeDeBase et appliquerMajorationAge pour un assuré senior', () => {
    const devis: Devis = { id: 2, clientId: 2, typeDeContrat: 'habitation', ageClient: 70, optionsChoisies: [] };

    expect(calculerPrimeDevis(devis)).toBe(275);
  });

  it('ne majore pas pour un assuré entre 25 et 65 ans', () => {
    const devis: Devis = { id: 3, clientId: 3, typeDeContrat: 'sante', ageClient: 40, optionsChoisies: [] };

    expect(calculerPrimeDevis(devis)).toBe(300);
  });
});
