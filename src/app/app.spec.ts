import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth-service';
import { DevisService } from './services/devis-service';

// Page factice : la vraie page de login n'a pas d'intérêt ici
@Component({ template: '' })
class FauxLogin {}

describe('App', () => {
  // Faux AuthService : logout() repasse estConnecte à false, comme le vrai
  const estConnecte = signal(false);
  const authService = { estConnecte, logout: () => estConnecte.set(false) };

  let devisService: DevisService;

  const bouton = (element: HTMLElement) => element.querySelector('button');

  beforeEach(async () => {
    estConnecte.set(false);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([{ path: 'login', component: FauxLogin }]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
    devisService = TestBed.inject(DevisService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("n'affiche pas le bouton de déconnexion si l'utilisateur n'est pas connecté", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(bouton(fixture.nativeElement)).toBeNull();
  });

  it('déconnecte, vide le cache de devis et renvoie vers /login au clic', async () => {
    estConnecte.set(true);
    devisService.calculerAvecCache({
      id: 0,
      clientId: 1,
      typeDeContrat: 'auto',
      ageClient: 30,
      optionsChoisies: [],
    });
    expect(devisService.taille).toBe(1);
    const router = TestBed.inject(Router);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    bouton(fixture.nativeElement)!.click();
    await fixture.whenStable();

    expect(estConnecte()).toBe(false);
    expect(devisService.taille).toBe(0);
    expect(router.url).toBe('/login');
    expect(bouton(fixture.nativeElement)).toBeNull();
  });
});
