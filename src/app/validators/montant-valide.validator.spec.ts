import { describe, expect, it } from 'vitest';
import { FormControl } from '@angular/forms';
import { montantValide } from './montant-valide.validator';

describe('montantValide', () => {
  const valider = (texte: string | null) => montantValide()(new FormControl(texte));

  it('accepte un montant au format français', () => {
    expect(valider('1 500,00 €')).toBeNull();
  });

  it('accepte un montant simple', () => {
    expect(valider('800')).toBeNull();
  });

  it('laisse passer un champ vide (géré par Validators.required)', () => {
    expect(valider('')).toBeNull();
    expect(valider(null)).toBeNull();
  });

  it('refuse un texte illisible', () => {
    expect(valider('abc')).toEqual({ montantInvalide: true });
  });

  it('refuse un montant nul ou négatif', () => {
    expect(valider('0')).toEqual({ montantInvalide: true });
    expect(valider('-50')).toEqual({ montantInvalide: true });
  });
});
