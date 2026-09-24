import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  convertToParamMap,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { contratExisteGuard } from './contrat-existe.guard';
import { API } from '../core/api';

describe('contratExisteGuard', () => {
  let httpMock: HttpTestingController;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => contratExisteGuard(...guardParameters));

  // Simule la route /contrats/:id avec l'id donné (toujours une chaîne, comme dans l'URL)
  const lancer = (id: string) =>
    executeGuard(
      { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Vérifie qu'aucune requête inattendue n'est restée sans réponse
  afterEach(() => httpMock.verify());

  it('laisse passer si le serveur trouve le contrat (200)', async () => {
    const resultat = lancer('1');

    httpMock.expectOne(`${API}/contrats/1`).flush({ id: 1 });

    expect(await resultat).toBe(true);
  });

  it("redirige vers /contrats si le contrat n'existe pas (404)", async () => {
    const resultat = lancer('999');

    httpMock.expectOne(`${API}/contrats/999`).flush(null, { status: 404, statusText: 'Not Found' });

    const decision = await resultat;
    expect(decision).toBeInstanceOf(UrlTree);
    expect(String(decision)).toBe('/contrats');
  });

  it("redirige sans appeler le serveur si l'id n'est pas un nombre", () => {
    const resultat = lancer('abc');

    // Réponse synchrone, et afterEach → verify() garantit qu'aucune requête n'est partie
    expect(resultat).toBeInstanceOf(UrlTree);
    expect(String(resultat)).toBe('/contrats');
  });
});
