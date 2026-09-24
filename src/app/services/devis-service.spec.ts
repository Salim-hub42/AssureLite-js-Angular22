import { TestBed } from '@angular/core/testing';

import { Devis } from '../models/devis.model';
import { DevisService } from './devis-service';

describe('DevisService', () => {
  let service: DevisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ne recalcule pas la prime pour un devis déjà en cache', () => {
    // Arrange
    const devis: Devis = {
      id: 1,
      clientId: 42,
      typeDeContrat: 'auto',
      ageClient: 30,
      optionsChoisies: ['assistance'],
    };
    // Act
    const premierAppel = service.calculerAvecCache(devis);
    const deuxiemeAppel = service.calculerAvecCache(devis);

    // Assert
    expect(deuxiemeAppel).toBe(premierAppel);
    expect(service.taille).toBe(1);
  });

  // Un devis différent à chaque âge → une clé de cache différente
  const devisAge = (ageClient: number): Devis => ({
    id: 0,
    clientId: 1,
    typeDeContrat: 'auto',
    ageClient,
    optionsChoisies: [],
  });

  it('ne dépasse jamais 20 entrées (Map.delete de la plus ancienne)', () => {
    for (let age = 18; age < 18 + 25; age++) {
      service.calculerAvecCache(devisAge(age));
      expect(service.taille).toBeLessThanOrEqual(20);
    }
    expect(service.taille).toBe(20);
  });

  it('vide tout le cache à la déconnexion (Map.clear)', () => {
    service.calculerAvecCache(devisAge(30));
    service.calculerAvecCache(devisAge(40));
    expect(service.taille).toBe(2);

    service.reinitialiserCache();

    expect(service.taille).toBe(0);
  });
});
