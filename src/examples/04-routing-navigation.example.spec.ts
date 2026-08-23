import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  EXEMPLE_ROUTES,
  ExempleListeRecettes,
  ExempleRecetteDetail,
} from './04-routing-navigation.example';

describe('04 - Routing et navigation (exemple générique)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(EXEMPLE_ROUTES, withComponentInputBinding())],
    });
  });

  it('affiche la liste des recettes sur /exemple-recettes', async () => {
    const harness = await RouterTestingHarness.create();
    const liste = await harness.navigateByUrl('/exemple-recettes', ExempleListeRecettes);

    expect(liste.recettes.length).toBe(2);
  });

  it('transmet le paramètre :id au composant de détail via input()', async () => {
    const harness = await RouterTestingHarness.create();
    const detail = await harness.navigateByUrl('/exemple-recettes/1', ExempleRecetteDetail);

    expect(detail.id()).toBe('1');
  });

  it("redirige vers la liste si le guard ne trouve pas la recette", async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/exemple-recettes/999');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/exemple-recettes');
  });
});
