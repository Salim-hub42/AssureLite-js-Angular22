import { describe, expect, it } from 'vitest';
import { CLIENTS_MOCKS } from '../data/mock-data';
import { Client } from './client.model';
import { calculerAge, listerClientsMajeurs, rechercherClientParEmail } from './client.utils';
import { CONTRATS_MOCKS } from '../data/mock-data';
import { afficherContratEnConsole } from './contrat.utils'

describe('rechercherClientParEmail', () => {
  it('trouve un client par email exact', () => {
    const resultat = rechercherClientParEmail(CLIENTS_MOCKS, 'jack@gmail.com');
    afficherContratEnConsole(CONTRATS_MOCKS[0])
    expect(resultat?.id).toBe(2);
  });

  it('trouve un client même avec une casse et des espaces différents', () => {
    const resultat = rechercherClientParEmail(CLIENTS_MOCKS, ' SKSnumerique@Gmail.com ');
    expect(resultat?.id).toBe(1);
  });

  it('retourne undefined si aucun client ne correspond', () => {
    const resultat = rechercherClientParEmail(CLIENTS_MOCKS, 'inconnu@mail.com');
    expect(resultat).toBeUndefined();
  });
});

describe('calculerAge', () => {
  it('calcule correctement quand l’anniversaire est déjà passé cette année', () => {
    expect(calculerAge(new Date(1990, 4, 12), new Date(2026, 6, 27))).toBe(36);
  });

  it('calcule correctement quand l’anniversaire n’est pas encore passé cette année', () => {
    expect(calculerAge(new Date(1990, 4, 12), new Date(2026, 0, 27))).toBe(35);
  });

  it('gère le jour exact de l’anniversaire', () => {
    expect(calculerAge(new Date(1990, 4, 12), new Date(2026, 4, 12))).toBe(36);
  });
});

describe('listerClientsMajeurs', () => {
  it('ne garde que les clients ayant 18 ans ou plus à la date de référence', () => {
    const majeur: Client = { id: 1, nom: 'Adulte', email: 'adulte@mail.com', dateNaissance: new Date(1990, 4, 12) };
    const mineur: Client = { id: 2, nom: 'Mineur', email: 'mineur@mail.com', dateNaissance: new Date(2015, 0, 1) };

    const resultat = listerClientsMajeurs([majeur, mineur], new Date(2026, 6, 27));

    expect(resultat.map((client) => client.id)).toEqual([1]);
  });
});
