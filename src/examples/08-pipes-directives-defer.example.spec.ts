import { LOCALE_ID } from '@angular/core';
import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ajouterAHistorique,
  ExempleBoutique,
  FileCommandes,
  MasquerTelephonePipe,
  MAX_HISTORIQUE,
  noteMoyenne,
  parserPrix,
  TronquerPipe,
} from './08-pipes-directives-defer.example';

describe('08 - pipes, directives, @defer (exemple générique)', () => {
  describe('TronquerPipe (indexOf + substring)', () => {
    const pipe = new TronquerPipe();

    it('laisse un texte court tel quel', () => {
      expect(pipe.transform('Pour les chemins', 30)).toBe('Pour les chemins');
    });

    it('coupe au premier espace après max, sans couper un mot', () => {
      expect(pipe.transform('Un vélo robuste et confortable pour tous', 12)).toBe(
        'Un vélo robuste…',
      );
    });

    it("ne coupe pas s'il n'y a plus d'espace après max", () => {
      expect(pipe.transform('Anticonstitutionnellement', 5)).toBe('Anticonstitutionnellement');
    });
  });

  describe('MasquerTelephonePipe (replace + slice)', () => {
    const pipe = new MasquerTelephonePipe();

    it('garde les 2 premiers et les 2 derniers chiffres', () => {
      expect(pipe.transform('06 12 34 56 78')).toBe('06••••••78');
    });

    it('laisse un numéro trop court tel quel', () => {
      expect(pipe.transform('12')).toBe('12');
    });
  });

  describe('ajouterAHistorique (slice + unshift + pop)', () => {
    it('met la plus récente en tête sans modifier le tableau reçu', () => {
      const avant = ['vtt'];
      const apres = ajouterAHistorique(avant, 'vélo de ville');

      expect(apres).toEqual(['vélo de ville', 'vtt']);
      expect(avant).toEqual(['vtt']);
    });

    it(`ne garde que les ${MAX_HISTORIQUE} plus récentes`, () => {
      let historique: string[] = [];
      for (const r of ['a', 'b', 'c', 'd', 'e', 'f']) {
        historique = ajouterAHistorique(historique, r);
      }
      expect(historique).toEqual(['f', 'e', 'd', 'c', 'b']); // 'a' est sortie
    });
  });

  describe('FileCommandes (push / unshift / shift)', () => {
    it('traite dans l’ordre d’arrivée, sauf les prioritaires', () => {
      const file = new FileCommandes();
      file.ajouter('commande 1');
      file.ajouter('commande 2');
      file.ajouterPrioritaire('urgente');

      expect(file.prochaine()).toBe('urgente');
      expect(file.traiterSuivante()).toBe('urgente');
      expect(file.traiterSuivante()).toBe('commande 1');
      expect(file.file()).toEqual(['commande 2']);
    });

    it('renvoie undefined quand la file est vide', () => {
      expect(new FileCommandes().traiterSuivante()).toBeUndefined();
    });
  });

  describe('parserPrix (replace + parseFloat)', () => {
    it('comprend un montant écrit à la française', () => {
      expect(parserPrix('1 299,90 €')).toBe(1299.9);
    });

    it('accepte aussi le point', () => {
      expect(parserPrix('12.5')).toBe(12.5);
    });

    it('renvoie null si rien n’est lisible', () => {
      expect(parserPrix('abc')).toBeNull();
    });
  });

  describe('noteMoyenne (toPrecision)', () => {
    it('arrondit à 2 chiffres significatifs', () => {
      expect(noteMoyenne([4, 5, 4])).toBe('4.3');
      expect(noteMoyenne([5])).toBe('5.0');
    });

    it('affiche un tiret sans note', () => {
      expect(noteMoyenne([])).toBe('–');
    });
  });

  describe('ExempleBoutique (pipes intégrés, directives, @defer)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ExempleBoutique],
        providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
        // On pilote @defer à la main (pas de défilement réel dans les tests)
        deferBlockBehavior: DeferBlockBehavior.Manual,
      }).compileComponents();
    });

    it('formate à la française et applique les pipes', async () => {
      const fixture = TestBed.createComponent(ExempleBoutique);
      await fixture.whenStable();
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';

      expect(texte).toMatch(/1\s299,90\s€/); // espaces insécables → \s
      expect(texte).toContain('25 septembre 2026');
      expect(texte).toContain('Vélo De Ville'); // titlecase
      expect(texte).toContain('PROMO'); // uppercase
      expect(texte).toContain('06••••••78');
      expect(texte).toContain('Un vélo robuste et confortable…');
    });

    it('met en surbrillance seulement les vélos en promo', async () => {
      const fixture = TestBed.createComponent(ExempleBoutique);
      await fixture.whenStable();
      const lignes = (fixture.nativeElement as HTMLElement).querySelectorAll('li');

      expect(lignes[0].classList.contains('surbrillance')).toBe(true);
      expect(lignes[1].classList.contains('surbrillance')).toBe(false);
    });

    it('donne le focus au champ de recherche', async () => {
      const fixture = TestBed.createComponent(ExempleBoutique);
      await fixture.whenStable();
      const champ = (fixture.nativeElement as HTMLElement).querySelector('#recherche');

      expect(document.activeElement).toBe(champ);
    });

    it('affiche le placeholder, puis les avis une fois le bloc chargé', async () => {
      const fixture = TestBed.createComponent(ExempleBoutique);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      expect(element.textContent).toContain("Les avis s'afficheront");
      expect(element.querySelector('.avis')).toBeNull();

      const [bloc] = await fixture.getDeferBlocks();
      await bloc.render(DeferBlockState.Complete);

      expect(element.querySelector('.avis')?.textContent).toContain('4.5 / 5');
    });
  });
});
