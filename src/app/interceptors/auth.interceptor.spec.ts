import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth-service';
import { Session } from '../models/utilisateur.model';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  // Faux AuthService : l'intercepteur ne lit que session()
  const session = signal<Session | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { session } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("ajoute l'en-tête Authorization quand une session existe", () => {
    session.set({ userId: 1, token: 'demo-1-123' });

    http.get('/contrats').subscribe();

    const req = httpMock.expectOne('/contrats');
    expect(req.request.headers.get('Authorization')).toBe('Bearer demo-1-123');
    req.flush([]);
  });

  it("n'ajoute rien sans session (ex. la requête de login)", () => {
    session.set(null);

    http.get('/users').subscribe();

    const req = httpMock.expectOne('/users');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
