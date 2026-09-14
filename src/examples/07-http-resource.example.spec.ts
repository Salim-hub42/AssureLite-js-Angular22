import { ApplicationRef, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject, firstValueFrom } from 'rxjs';

import {
  API_BIBLIO,
  BiblioService,
  CacheResumes,
  CLE_FAVORIS,
  Livre,
  LivreDTO,
  basculerFavori,
  corpsNouveauLivre,
  creerDetailLivreRes,
  creerRechercheLivres,
  ecrireFavoris,
  enTeteClientInterceptor,
  estLivreDTO,
  lireFavoris,
  parseAnnee,
  parsePrix,
  pipelineRecherche,
  versLivre,
} from './07-http-resource.example';

const DTO: LivreDTO = {
  id: 1,
  titre: 'Le Guide',
  auteur: 'Adams',
  ajouteLe: '2024-01-15T10:00:00.000Z',
};

describe('07 - HttpClient / Resource API (exemple générique)', () => {
  // ─── §14 — Object.hasOwn ───────────────────────────────────────────────────
  describe('estLivreDTO', () => {
    it('accepte un objet qui a toutes les clés propres', () => {
      expect(estLivreDTO(DTO)).toBe(true);
    });

    it('refuse un objet auquel il manque une clé', () => {
      expect(estLivreDTO({ id: 1, titre: 'x', auteur: 'y' })).toBe(false);
    });

    it('refuse null et les non-objets', () => {
      expect(estLivreDTO(null)).toBe(false);
      expect(estLivreDTO('livre')).toBe(false);
    });

    it('ne se laisse pas berner par une clé héritée du prototype', () => {
      // `toString` existe via le prototype mais n'est pas une clé propre
      expect(Object.hasOwn({}, 'toString')).toBe(false);
    });
  });

  // ─── §12 — toISOString / new Date ──────────────────────────────────────────
  describe('versLivre', () => {
    it('convertit la date texte en objet Date', () => {
      const livre = versLivre(DTO);
      expect(livre.ajouteLe).toBeInstanceOf(Date);
      expect(livre.ajouteLe.getTime()).toBe(Date.parse(DTO.ajouteLe));
    });
  });

  describe('corpsNouveauLivre', () => {
    it("n'inclut pas d'id et sérialise la date en ISO", () => {
      const maintenant = new Date('2024-01-15T10:00:00.000Z');
      const corps = corpsNouveauLivre('Le Guide', 'Adams', maintenant);

      expect(Object.hasOwn(corps, 'id')).toBe(false);
      expect(corps.ajouteLe).toBe('2024-01-15T10:00:00.000Z');
    });
  });

  // ─── §13 — parseInt / parseFloat ─────────────────────────────────────────
  describe('parseAnnee', () => {
    it('lit une année simple', () => {
      expect(parseAnnee('1998')).toBe(1998);
    });

    it("s'arrête au premier caractère non numérique", () => {
      expect(parseAnnee('1998 (rééd.)')).toBe(1998);
    });

    it('renvoie null si ça ne commence pas par un chiffre', () => {
      expect(parseAnnee('n/a')).toBeNull();
    });
  });

  describe('parsePrix', () => {
    it('accepte la virgule décimale', () => {
      expect(parsePrix('12,50 €')).toBe(12.5);
    });

    it('accepte le point décimal', () => {
      expect(parsePrix('3.99')).toBe(3.99);
    });

    it('renvoie null pour du texte', () => {
      expect(parsePrix('gratuit')).toBeNull();
    });
  });

  // ─── §11 — JSON.parse / JSON.stringify + localStorage ─────────────────────
  describe('favoris (localStorage + JSON)', () => {
    beforeEach(() => localStorage.clear());

    it('renvoie une liste vide au départ', () => {
      expect(lireFavoris()).toEqual([]);
    });

    it('relit ce qui a été écrit', () => {
      ecrireFavoris([1, 2, 3]);
      expect(lireFavoris()).toEqual([1, 2, 3]);
    });

    it('bascule un favori (ajout puis retrait)', () => {
      expect(basculerFavori(7)).toEqual([7]);
      expect(basculerFavori(7)).toEqual([]);
    });

    it('nettoie une valeur corrompue au lieu de jeter', () => {
      localStorage.setItem(CLE_FAVORIS, '{pas du json');
      expect(lireFavoris()).toEqual([]);
      expect(localStorage.getItem(CLE_FAVORIS)).toBeNull();
    });
  });

  // ─── §15 — Map ──────────────────────────────────────────────────────────
  describe('CacheResumes', () => {
    const livre = versLivre(DTO);

    it("ne calcule qu'une fois par id (has / get / set)", () => {
      const cache = new CacheResumes();
      let appels = 0;
      const calcul = () => {
        appels += 1;
        return 'résumé';
      };

      expect(cache.resume(livre, calcul)).toBe('résumé');
      expect(cache.resume(livre, calcul)).toBe('résumé');
      expect(appels).toBe(1);
      expect(cache.taille).toBe(1);
    });

    it('invalider force un recalcul (delete)', () => {
      const cache = new CacheResumes();
      let appels = 0;
      const calcul = () => {
        appels += 1;
        return String(appels);
      };

      cache.resume(livre, calcul);
      cache.invalider(livre.id);
      expect(cache.resume(livre, calcul)).toBe('2');
    });

    it('vider remet la taille à zéro (clear)', () => {
      const cache = new CacheResumes();
      cache.resume(livre, () => 'x');
      cache.vider();
      expect(cache.taille).toBe(0);
    });
  });

  // ─── §10 — intercepteur ─────────────────────────────────────────────────
  describe('enTeteClientInterceptor', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([enTeteClientInterceptor])),
          provideHttpClientTesting(),
        ],
      });
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("ajoute l'en-tête X-Client à la requête sortante", () => {
      const svc = TestBed.inject(BiblioService);
      svc.chargerAvecEtat();

      const req = httpMock.expectOne(`${API_BIBLIO}/livres`);
      expect(req.request.headers.get('X-Client')).toBe('exemple-biblio');
      req.flush([]);
    });
  });

  // ─── §7 — then / catch / finally ──────────────────────────────────────
  describe('BiblioService.chargerAvecEtat', () => {
    let httpMock: HttpTestingController;
    let svc: BiblioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpMock = TestBed.inject(HttpTestingController);
      svc = TestBed.inject(BiblioService);
    });

    afterEach(() => httpMock.verify());

    it('passe chargement à true le temps de la requête', () => {
      const p = svc.chargerAvecEtat();
      expect(svc.chargement()).toBe(true);
      httpMock.expectOne(`${API_BIBLIO}/livres`).flush([]);
      return p;
    });

    it('mappe la réponse et ignore les éléments mal formés (then)', async () => {
      const p = svc.chargerAvecEtat();
      httpMock.expectOne(`${API_BIBLIO}/livres`).flush([DTO, { id: 2 }, { ...DTO, id: 3 }]);
      await p;

      expect(svc.livres().map((l) => l.id)).toEqual([1, 3]);
      expect(svc.livres()[0].ajouteLe).toBeInstanceOf(Date);
      expect(svc.chargement()).toBe(false);
      expect(svc.erreur()).toBeNull();
    });

    it('capture une erreur serveur et baisse le drapeau (catch + finally)', async () => {
      const p = svc.chargerAvecEtat();
      httpMock
        .expectOne(`${API_BIBLIO}/livres`)
        .flush('boom', { status: 500, statusText: 'Server Error' });
      await p;

      expect(svc.erreur()).toBe('Chargement impossible');
      expect(svc.chargement()).toBe(false);
    });
  });

  // ─── §3 + §12 — POST ──────────────────────────────────────────────────
  describe('BiblioService.ajouterLivre', () => {
    let httpMock: HttpTestingController;
    let svc: BiblioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpMock = TestBed.inject(HttpTestingController);
      svc = TestBed.inject(BiblioService);
    });

    afterEach(() => httpMock.verify());

    it('envoie un POST sans id, avec une date ISO, et remappe la réponse', async () => {
      const maintenant = new Date('2024-01-15T10:00:00.000Z');
      const p = svc.ajouterLivre('Le Guide', 'Adams', maintenant);

      const req = httpMock.expectOne(`${API_BIBLIO}/livres`);
      expect(req.request.method).toBe('POST');
      expect(Object.hasOwn(req.request.body, 'id')).toBe(false);
      expect(req.request.body.ajouteLe).toBe('2024-01-15T10:00:00.000Z');
      req.flush({ ...DTO, id: 42 });

      const livre = await p;
      expect(livre.id).toBe(42);
      expect(livre.ajouteLe).toBeInstanceOf(Date);
    });
  });

  // ─── §9 — httpResource ───────────────────────────────────────────────
  describe('BiblioService.livresRes (httpResource)', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('charge la liste, filtre la forme et mappe les dates', async () => {
      const svc = TestBed.inject(BiblioService);

      // le httpResource programme sa requête ; tick() draine l'ordonnanceur (mode zoneless)
      TestBed.tick();
      httpMock.expectOne(`${API_BIBLIO}/livres`).flush([DTO, { id: 2 }, { ...DTO, id: 3 }]);

      // la requête est résolue → whenStable() peut se terminer ; laisse `parse` propager
      await TestBed.inject(ApplicationRef).whenStable();
      TestBed.tick();

      expect(svc.livresRes.value().map((l) => l.id)).toEqual([1, 3]);
      expect(svc.livresRes.value()[0].ajouteLe).toBeInstanceOf(Date);
    });
  });

  // ─── §4 — .subscribe() manuel + takeUntilDestroyed() ──────────────────
  describe('BiblioService.chargerViaSubscribe', () => {
    let httpMock: HttpTestingController;
    let svc: BiblioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpMock = TestBed.inject(HttpTestingController);
      svc = TestBed.inject(BiblioService);
    });

    afterEach(() => httpMock.verify());

    it('livre les résultats mappés au callback (next)', () => {
      let recus: Livre[] | undefined;
      svc.chargerViaSubscribe((livres) => (recus = livres));

      httpMock.expectOne(`${API_BIBLIO}/livres`).flush([DTO, { id: 2 }]);

      expect(recus?.map((l) => l.id)).toEqual([1]);
      expect(recus?.[0].ajouteLe).toBeInstanceOf(Date);
    });

    it('appelle le callback avec [] sur une erreur (error)', () => {
      let recus: Livre[] | undefined;
      svc.chargerViaSubscribe((livres) => (recus = livres));

      httpMock
        .expectOne(`${API_BIBLIO}/livres`)
        .flush('boom', { status: 500, statusText: 'Server Error' });

      expect(recus).toEqual([]);
    });
  });

  // ─── §5 — .pipe() avec tap / map / catchError / finalize ──────────────
  describe('BiblioService.chargerAvecOperateurs', () => {
    let httpMock: HttpTestingController;
    let svc: BiblioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpMock = TestBed.inject(HttpTestingController);
      svc = TestBed.inject(BiblioService);
    });

    afterEach(() => httpMock.verify());

    it('bascule chargement à true puis false, et mappe la réponse (tap + map + finalize)', async () => {
      const p = firstValueFrom(svc.chargerAvecOperateurs());
      expect(svc.chargement()).toBe(true);

      httpMock.expectOne(`${API_BIBLIO}/livres`).flush([DTO]);
      const livres = await p;

      expect(livres.map((l) => l.id)).toEqual([1]);
      expect(svc.chargement()).toBe(false);
    });

    it('remplace une erreur par une liste vide sans planter (catchError)', async () => {
      const p = firstValueFrom(svc.chargerAvecOperateurs());
      httpMock
        .expectOne(`${API_BIBLIO}/livres`)
        .flush('boom', { status: 500, statusText: 'Server Error' });

      expect(await p).toEqual([]);
      expect(svc.chargement()).toBe(false);
    });
  });

  // ─── §6 — debounceTime + distinctUntilChanged + switchMap ─────────────
  describe('pipelineRecherche', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    // Débounce court + vraie attente (plutôt que des horloges truquées, qui
    // perturbent la remise à zéro interne du TestBed entre les tests).
    const laisserPasser = (ms: number) => new Promise((r) => setTimeout(r, ms));

    it("n'appelle pas le serveur pour un terme vide", async () => {
      const termes$ = new Subject<string>();
      const resultats: Livre[][] = [];
      pipelineRecherche(http, termes$, 10).subscribe((r) => resultats.push(r));

      termes$.next('');
      await laisserPasser(30);

      expect(resultats).toEqual([[]]);
    });

    it('attend un silence avant de chercher (debounceTime)', async () => {
      const termes$ = new Subject<string>();
      const resultats: Livre[][] = [];
      pipelineRecherche(http, termes$, 20).subscribe((r) => resultats.push(r));

      termes$.next('s');
      await laisserPasser(5); // pas encore 20 ms de silence
      termes$.next('sal');
      await laisserPasser(40); // silence complet cette fois

      httpMock
        .expectOne((r) => r.url === `${API_BIBLIO}/livres` && r.params.get('titre_like') === 'sal')
        .flush([DTO]);

      expect(resultats.length).toBe(1); // le "s" isolé n'a jamais déclenché de recherche
      expect(resultats[0].map((l) => l.id)).toEqual([1]);
    });

    it('annule une recherche obsolète (switchMap)', async () => {
      const termes$ = new Subject<string>();
      const resultats: Livre[][] = [];
      pipelineRecherche(http, termes$, 0).subscribe((r) => resultats.push(r));

      termes$.next('sal');
      await laisserPasser(10);
      const premiere = httpMock.expectOne(
        (r) => r.url === `${API_BIBLIO}/livres` && r.params.get('titre_like') === 'sal',
      );

      termes$.next('sali');
      await laisserPasser(10);
      const seconde = httpMock.expectOne(
        (r) => r.url === `${API_BIBLIO}/livres` && r.params.get('titre_like') === 'sali',
      );

      seconde.flush([{ ...DTO, id: 2, titre: 'Salinger' }]);

      // switchMap a déjà désabonné la première requête : la « flusher » maintenant jette.
      // C'est la preuve directe de l'annulation — pas une supposition sur le résultat final.
      expect(() => premiere.flush([DTO])).toThrow();

      expect(resultats.at(-1)?.map((l) => l.id)).toEqual([2]);
    });

    it('remplace une erreur réseau par une liste vide (catchError)', async () => {
      const termes$ = new Subject<string>();
      const resultats: Livre[][] = [];
      pipelineRecherche(http, termes$, 0).subscribe((r) => resultats.push(r));

      termes$.next('sal');
      await laisserPasser(10);
      httpMock
        .expectOne((r) => r.url === `${API_BIBLIO}/livres`)
        .flush('boom', { status: 500, statusText: 'Server Error' });

      expect(resultats.at(-1)).toEqual([]);
    });
  });

  // ─── §6 — la même recherche, branchée sur un signal ────────────────────
  describe('creerRechercheLivres (toObservable → … → toSignal)', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('relie le signal terme au signal resultats', async () => {
      const injector = TestBed.inject(Injector);
      const terme = signal('');
      const { resultats } = TestBed.runInInjectionContext(() =>
        creerRechercheLivres(http, terme, { debounceMs: 0, injector }),
      );

      terme.set('sal');
      TestBed.tick();
      await new Promise((r) => setTimeout(r, 0)); // laisse debounceTime(0) s'écouler
      TestBed.tick();

      httpMock
        .expectOne((r) => r.url === `${API_BIBLIO}/livres` && r.params.get('titre_like') === 'sal')
        .flush([DTO]);

      await TestBed.inject(ApplicationRef).whenStable();
      TestBed.tick();

      expect(resultats().map((l) => l.id)).toEqual([1]);
    });
  });

  // ─── §9 (rxResource) — requêtes chaînées ───────────────────────────────
  describe('creerDetailLivreRes (rxResource)', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('charge le livre puis une recommandation du même auteur', async () => {
      const injector = TestBed.inject(Injector);
      const livreId = signal(1);
      const detailRes = TestBed.runInInjectionContext(() =>
        creerDetailLivreRes(http, livreId, { injector }),
      );

      // whenStable() ne doit être attendu qu'une fois TOUTES les requêtes en
      // vol satisfaites — l'attendre entre les deux flush bloquerait : la 2e
      // requête (déclenchée par switchMap à la réception de la 1re) tiendrait
      // l'app "instable" indéfiniment tant qu'elle n'est pas, elle aussi, flush.
      TestBed.tick();
      httpMock.expectOne(`${API_BIBLIO}/livres/1`).flush(DTO);
      TestBed.tick(); // laisse switchMap s'abonner à la 2e requête (déclenchée par la 1re)

      httpMock
        .expectOne((r) => r.url === `${API_BIBLIO}/livres` && r.params.get('auteur') === 'Adams')
        .flush([DTO, { ...DTO, id: 2, titre: 'Autre livre' }]);

      await TestBed.inject(ApplicationRef).whenStable();
      TestBed.tick();

      expect(detailRes.value()?.livre.id).toBe(1);
      expect(detailRes.value()?.recommandation?.id).toBe(2);
    });
  });
});
