import { TestBed } from '@angular/core/testing';

import { Historique } from './historique';

describe('Historique', () => {
  let service: Historique;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Historique);
  });

  it('démarre avec un historique vide', () => {
    expect(service.consultes()).toEqual([]);
  });

  // Règle 1 : le dernier contrat consulté est en tête (unshift)
  it('place le dernier contrat consulté en tête', () => {
    service.enregistrer(1);
    service.enregistrer(3);

    expect(service.consultes()).toEqual([3, 1]);
  });

  // Règle 2 : pas de doublon, un id déjà présent remonte en tête (filter)
  it('ne crée pas de doublon et remonte un contrat déjà consulté', () => {
    service.enregistrer(1);
    service.enregistrer(3);
    service.enregistrer(1);

    expect(service.consultes()).toEqual([1, 3]);
  });

  // Règle 3 : 5 éléments au maximum, le plus ancien est retiré (pop)
  it('garde au maximum 5 contrats en retirant le plus ancien', () => {
    [1, 2, 3, 4, 5, 6].forEach((id) => service.enregistrer(id));

    expect(service.consultes()).toEqual([6, 5, 4, 3, 2]);
  });

  // Cas limite : exactement 5 consultations → rien n'est retiré
  it('garde bien 5 contrats quand on en consulte exactement 5', () => {
    [1, 2, 3, 4, 5].forEach((id) => service.enregistrer(id));

    expect(service.consultes()).toHaveLength(5);
  });
});
