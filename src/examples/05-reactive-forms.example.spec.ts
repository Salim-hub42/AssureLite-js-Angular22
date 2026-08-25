import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import {
  ExempleInscriptionEvenement,
  ageMinimum,
  aUneErreurRequise,
  genererReference,
  montantSaisi,
} from './05-reactive-forms.example';

describe('05 - Reactive Forms (exemple générique)', () => {
  describe('ageMinimum', () => {
    it('valide un âge suffisant', () => {
      const validator = ageMinimum(18);
      expect(validator({ value: 20 } as unknown as AbstractControl)).toBeNull();
    });

    it('rejette un âge insuffisant', () => {
      const validator = ageMinimum(18);
      expect(validator({ value: 15 } as unknown as AbstractControl)).toEqual({
        ageMinimum: { minimum: 18, actuel: 15 },
      });
    });

    it('laisse Validators.required gérer le champ vide', () => {
      const validator = ageMinimum(18);
      expect(validator({ value: null } as unknown as AbstractControl)).toBeNull();
    });
  });

  describe('genererReference', () => {
    it('génère une référence au format PREFIXE-nombre', () => {
      expect(genererReference('EVT')).toMatch(/^EVT-\d+$/);
    });
  });

  describe('montantSaisi', () => {
    it('parse un nombre simple', () => {
      expect(montantSaisi('12.5')).toBe(12.5);
    });

    it('ignore les caractères après le nombre', () => {
      expect(montantSaisi('12,50 €')).toBe(12);
    });

    it('renvoie 0 sur une saisie invalide', () => {
      expect(montantSaisi('abc')).toBe(0);
    });
  });

  describe('aUneErreurRequise', () => {
    it('détecte la clé required', () => {
      expect(aUneErreurRequise({ required: true })).toBe(true);
    });

    it("renvoie false si errors est null", () => {
      expect(aUneErreurRequise(null)).toBe(false);
    });

    it('renvoie false si la clé required est absente', () => {
      expect(aUneErreurRequise({ ageMinimum: {} })).toBe(false);
    });
  });

  describe('ExempleInscriptionEvenement', () => {
    let component: ExempleInscriptionEvenement;
    let fixture: ComponentFixture<ExempleInscriptionEvenement>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ExempleInscriptionEvenement],
      }).compileComponents();

      fixture = TestBed.createComponent(ExempleInscriptionEvenement);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('est invalide au départ (nom et âge requis)', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('calcule le montant en direct depuis le champ texte', () => {
      component.form.controls.montant.setValue('12,50 €');
      expect(component.montant()).toBe(12);
    });

    it('ne génère pas de référence si le formulaire est invalide', () => {
      component.onSubmit();
      expect(component.reference()).toBeNull();
    });

    it('génère une référence à la soumission si le formulaire est valide', () => {
      component.form.setValue({ nom: 'Alice', age: 25, montant: '' });
      component.onSubmit();
      expect(component.reference()).toMatch(/^EVT-\d+$/);
    });
  });
});
