import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Surbrillance } from './surbrillance';

// Composant hôte : la directive est posée sur un <p> piloté par un signal
@Component({
  imports: [Surbrillance],
  template: `<p [appSurbrillance]="resilie()">Contrat</p>`,
})
class Hote {
  readonly resilie = signal(false);
}

describe('Surbrillance', () => {
  it('ajoute la classe seulement quand la condition est vraie', async () => {
    const fixture = TestBed.createComponent(Hote);
    await fixture.whenStable();
    const p = (fixture.nativeElement as HTMLElement).querySelector('p')!;

    expect(p.classList.contains('assurlite-surbrillance')).toBe(false);

    fixture.componentInstance.resilie.set(true);
    await fixture.whenStable();

    expect(p.classList.contains('assurlite-surbrillance')).toBe(true);
  });
});
