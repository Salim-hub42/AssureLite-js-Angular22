import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ExempleInscriptionSignal,
  contientEspace,
  genererReference,
} from './06-signal-forms.example';

describe('06 - Signal Forms (exemple générique)', () => {
  describe('contientEspace', () => {
    it('détecte un espace', () => {
      expect(contientEspace('jean dupont')).toBe(true);
    });

    it('renvoie false sans espace', () => {
      expect(contientEspace('jdupont')).toBe(false);
    });
  });

  describe('genererReference', () => {
    it('génère une référence au format PREFIXE-nombre', () => {
      expect(genererReference('EVT')).toMatch(/^EVT-\d+$/);
    });
  });

  describe('ExempleInscriptionSignal', () => {
    let component: ExempleInscriptionSignal;
    let fixture: ComponentFixture<ExempleInscriptionSignal>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ExempleInscriptionSignal],
      }).compileComponents();

      fixture = TestBed.createComponent(ExempleInscriptionSignal);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('est invalide au départ (nom, âge, pseudo requis)', () => {
      expect(component.f().invalid()).toBe(true);
    });

    it('le champ lit et écrit directement dans le modèle', () => {
      component.f.nom().value.set('Alice');
      expect(component.model().nom).toBe('Alice');
      expect(component.f.nom().value()).toBe('Alice');
    });

    it('devient valide une fois les champs requis remplis correctement', () => {
      component.model.set({
        nom: 'Alice',
        age: 30,
        pseudo: 'alice30',
        avecInvites: false,
        nombreInvites: 1,
      });
      expect(component.f().valid()).toBe(true);
    });

    it('validate() personnalisé : rejette un pseudo avec espace', () => {
      component.f.pseudo().value.set('alice 30');
      const kinds = component.f
        .pseudo()
        .errors()
        .map((e) => e.kind);
      expect(kinds).toContain('sansEspace');
    });

    it('min intégré : rejette un âge < 18 avec le message fourni', () => {
      component.f.age().value.set(15);
      const erreurMin = component.f
        .age()
        .errors()
        .find((e) => e.kind === 'min');
      expect(erreurMin?.message).toBe('Âge minimum : 18 ans.');
    });

    it('logique inter-champs : nombreInvites est désactivé tant que la case est décochée', () => {
      expect(component.f.nombreInvites().disabled()).toBe(true);
      component.f.avecInvites().value.set(true);
      expect(component.f.nombreInvites().disabled()).toBe(false);
    });

    it('prixTotal se recalcule sans valueChanges', () => {
      expect(component.prixTotal()).toBe(20);
      component.model.set({
        nom: 'Alice',
        age: 30,
        pseudo: 'alice30',
        avecInvites: true,
        nombreInvites: 3,
      });
      expect(component.prixTotal()).toBe(50);
    });

    it('ne génère pas de référence si le formulaire est invalide', async () => {
      await component.onSubmit(new Event('submit'));
      expect(component.reference()).toBeNull();
    });

    it('génère une référence à la soumission si le formulaire est valide', async () => {
      component.model.set({
        nom: 'Alice',
        age: 30,
        pseudo: 'alice30',
        avecInvites: false,
        nombreInvites: 1,
      });
      await component.onSubmit(new Event('submit'));
      expect(component.reference()).toMatch(/^EVT-\d+$/);
    });
  });
});
