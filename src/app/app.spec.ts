import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth-service';
import { DevisService } from './services/devis-service';
import { NotificationService } from './services/notification-service';
import { Session } from './models/utilisateur.model';

// Page factice : la vraie page de login n'a pas d'intérêt ici
@Component({ template: '' })
class FauxLogin {}

describe('App', () => {
  // Faux AuthService : logout() efface la session, comme le vrai
  const session = signal<Session | null>(null);
  const authService = { session, logout: () => session.set(null) };

  let devisService: DevisService;

  const bouton = (element: HTMLElement) => element.querySelector('button');

  beforeEach(async () => {
    session.set(null);
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

  it("affiche l'e-mail masqué de l'utilisateur connecté", async () => {
    session.set({ email: 'salim@gmail.com', userId: 1, token: 'demo' });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('sa***@gmail.com');
  });

  it("n'affiche pas le bouton de déconnexion si l'utilisateur n'est pas connecté", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(bouton(fixture.nativeElement)).toBeNull();
  });

  it('déconnecte, vide le cache de devis et renvoie vers /login au clic', async () => {
    session.set({ email: 'salim@gmail.com', userId: 1, token: 'demo' });
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

    expect(session()).toBeNull();
    expect(devisService.taille).toBe(0);
    expect(router.url).toBe('/login');
    expect(bouton(fixture.nativeElement)).toBeNull();
  });

  it('affiche la notification en tête de file et le nombre en attente', async () => {
    const notifications = TestBed.inject(NotificationService);
    notifications.info('Contrat souscrit');
    notifications.erreur('Échec de la suppression');

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const zone = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')!;

    expect(zone.textContent).toContain('Échec de la suppression');
    expect(zone.textContent).not.toContain('Contrat souscrit');
    expect(zone.textContent).toContain('+1 en attente');
  });

  it('affiche la notification suivante quand on ferme la première', async () => {
    const notifications = TestBed.inject(NotificationService);
    notifications.info('Premier');
    notifications.info('Second');

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('[aria-label="Fermer la notification"]')!.click();
    await fixture.whenStable();

    expect(element.querySelector('[role="status"]')!.textContent).toContain('Second');
    expect(notifications.file()).toHaveLength(1);
  });
});
