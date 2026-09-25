import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Autofocus } from './autofocus';

// Petit composant hôte : une directive ne s'utilise que posée sur un élément
@Component({
  imports: [Autofocus],
  template: `
    <input id="autre" />
    <input id="cible" appAutofocus />
  `,
})
class Hote {}

describe('Autofocus', () => {
  it("donne le focus à l'élément qui porte la directive", async () => {
    const fixture = TestBed.createComponent(Hote);
    await fixture.whenStable();

    const cible = (fixture.nativeElement as HTMLElement).querySelector('#cible');
    expect(document.activeElement).toBe(cible);
  });
});
