import { describe, expect, it } from 'vitest';
import { parserMontant } from './sinistre.utils';

describe('parserMontant', () => {
  it('convertit un montant simple au format français', () => {
    expect(parserMontant('450,00 €')).toBe(450);
  });

  // Cas qui piégeait trim() : parseFloat s'arrêtait à l'espace des milliers et renvoyait 1
  it('supprime l’espace des milliers', () => {
    expect(parserMontant('1 299,99 €')).toBe(1299.99);
  });
});
