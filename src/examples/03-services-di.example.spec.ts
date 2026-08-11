import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ExempleBoutonCompteur,
  ExempleCompteurParent,
  ExempleCompteurService
} from './03-services-di.example';

describe('Exemple générique — service et injection de dépendances', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('@Service() : deux injections renvoient la MÊME instance (singleton)', () => {
    const premiere = TestBed.inject(ExempleCompteurService);
    const seconde = TestBed.inject(ExempleCompteurService);

    expect(premiere).toBe(seconde);
  });

  it('incrementer/reinitialiser : le signal privé change, la version publique lit la même valeur', () => {
    const service = TestBed.inject(ExempleCompteurService);

    expect(service.valeur()).toBe(0);
    expect(service.estPositif()).toBe(false);

    service.incrementer(5);
    expect(service.valeur()).toBe(5);
    expect(service.estPositif()).toBe(true);

    service.reinitialiser();
    expect(service.valeur()).toBe(0);
  });
});

describe('Exemple générique — communication parent/enfant (input/output)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExempleCompteurParent]
    }).compileComponents();
  });

  it("input() : l'enfant affiche la valeur reçue du parent (via le service)", async () => {
    const fixture = TestBed.createComponent(ExempleCompteurParent);
    await fixture.whenStable();

    const bouton = fixture.nativeElement.querySelector('button');
    expect(bouton.textContent).toContain('+5 (actuel : 0)');
  });

  it("output() : un clic sur l'enfant remonte l'événement au parent, qui met à jour le service", async () => {
    const fixture = TestBed.createComponent(ExempleCompteurParent);
    await fixture.whenStable();

    const bouton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    bouton.click();
    await fixture.whenStable();

    expect(bouton.textContent).toContain('actuel : 5');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Positif');
  });

  it("input.required : le composant enfant seul exige la valeur pour compiler/instancier", () => {
    const fixture = TestBed.createComponent(ExempleBoutonCompteur);
    fixture.componentRef.setInput('valeur', 42);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').textContent).toContain(
      '+1 (actuel : 42)'
    );
  });
});
