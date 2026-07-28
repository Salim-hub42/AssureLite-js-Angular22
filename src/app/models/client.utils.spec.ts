import { describe, expect, it } from 'vitest';
import { CLIENTS_MOCKS } from '../data/mock-data';
import { rechercherClientParEmail } from './client.utils';

describe('rechercherClientParEmail', () => {
  it('trouve un client par email exact', () => {
    const resultat = rechercherClientParEmail(CLIENTS_MOCKS, 'jack@gmail.com');
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
