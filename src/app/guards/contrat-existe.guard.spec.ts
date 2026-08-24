import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { contratExisteGuard } from './contrat-existe.guard';

describe('contratExisteGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => contratExisteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
