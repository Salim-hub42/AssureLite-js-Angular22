import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth-service';

describe('authGuard', () => {
  // Faux AuthService : seul estConnecte() compte pour le guard
  const estConnecte = signal(false);

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  // Le guard n'utilise ni la route ni l'état : des objets vides suffisent
  const lancer = () => executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { estConnecte } }],
    });
  });

  it("laisse passer l'utilisateur connecté", () => {
    estConnecte.set(true);
    expect(lancer()).toBe(true);
  });

  it("redirige vers /login l'utilisateur non connecté", () => {
    estConnecte.set(false);
    const resultat = lancer();

    expect(resultat).toBeInstanceOf(UrlTree);
    expect(String(resultat)).toBe('/login');
  });
});
