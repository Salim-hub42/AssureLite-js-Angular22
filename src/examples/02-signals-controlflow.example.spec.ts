import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ExempleTaches } from './02-signals-controlflow.example';

describe('Exemple générique — signals et control flow', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExempleTaches]
    }).compileComponents();
  });

  it('computed : compte les tâches terminées et se met à jour avec le signal', () => {
    const fixture = TestBed.createComponent(ExempleTaches);
    const composant = fixture.componentInstance;

    expect(composant.tachesTerminees()).toBe(1);

    composant.ajouterTache('Nouvelle tâche');
    expect(composant.taches().length).toBe(4);
    expect(composant.tachesTerminees()).toBe(1); // la nouvelle tâche n'est pas terminée

    composant.retirerPremiereTache();
    expect(composant.taches().length).toBe(3);
    expect(composant.taches()[0].titre).toBe('Faire l’exemple');
  });

  it('findIndex + splice : retire la tâche correspondant à un id précis', () => {
    const fixture = TestBed.createComponent(ExempleTaches);
    const composant = fixture.componentInstance;

    composant.retirerTacheParId(2);

    expect(composant.taches().length).toBe(2);
    expect(composant.taches().map((tache) => tache.id)).toEqual([1, 3]);
  });

  it('@for / @empty : affiche la liste, ou le message vide si aucune tâche', async () => {
    const fixture = TestBed.createComponent(ExempleTaches);
    await fixture.whenStable();

    let items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(3);

    fixture.componentInstance.taches.set([]);
    await fixture.whenStable();

    items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Rien à afficher');
  });
});
