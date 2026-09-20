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
});
