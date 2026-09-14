/**
 * Module 7 — exemple générique : HttpClient, Resource API, promesses, JSON & RxJS
 *
 * Domaine isolé : une petite bibliothèque de livres (pas d'assurance).
 * À comparer avec le Module 7 appliqué à AssurLite (contrats via json-server).
 *
 * Les numéros de section (§N) renvoient à docs/07-http-resource-api.md.
 * Ce fichier ne compte PAS dans docs/traçabilité-js.md : il isole la syntaxe.
 * Seul le code de la partie "Pratique" (dans src/app/) valide une ligne de la table.
 */

import { HttpClient, HttpInterceptorFn, httpResource } from '@angular/common/http';
import { DestroyRef, inject, Injector, Service, Signal, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

// L'app réelle centraliserait ça dans src/app/core/api.ts
export const API_BIBLIO = 'https://exemple.test/api';

// ─── Modèles : la forme "serveur" (DTO) et la forme "client" ──────────────────
// Le serveur ne connaît que du texte → les dates arrivent en string.

export interface LivreDTO {
  id: number;
  titre: string;
  auteur: string;
  ajouteLe: string; // ISO 8601
}

export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  ajouteLe: Date; // converti côté client
}

// ─── §14 — valider la forme d'une réponse : Object.hasOwn ─────────────────────

/** `Object.hasOwn` ne regarde que les propriétés propres (pas le prototype). */
export function estLivreDTO(x: unknown): x is LivreDTO {
  return (
    typeof x === 'object' &&
    x !== null &&
    Object.hasOwn(x, 'id') &&
    Object.hasOwn(x, 'titre') &&
    Object.hasOwn(x, 'auteur') &&
    Object.hasOwn(x, 'ajouteLe')
  );
}

// ─── §12 — dates : toISOString à l'aller, new Date au retour ──────────────────

export function versLivre(dto: LivreDTO): Livre {
  return { ...dto, ajouteLe: new Date(dto.ajouteLe) }; // string → Date
}

/** Corps d'un POST : aucun `id` (le serveur le génère), date sérialisée en ISO. */
export function corpsNouveauLivre(
  titre: string,
  auteur: string,
  maintenant: Date, // injecté pour rester testable — pas de `new Date()` implicite
): Omit<LivreDTO, 'id'> {
  return { titre, auteur, ajouteLe: maintenant.toISOString() }; // Date → string
}

// ─── §13 — nombres : parseInt (radix) / parseFloat (tolérant) ─────────────────

/** "1998" → 1998 · "1998 (rééd.)" → 1998 · "n/a" → null */
export function parseAnnee(brut: string): number | null {
  const n = parseInt(brut.trim(), 10); // radix 10 obligatoire
  return Number.isNaN(n) ? null : n;
}

/** "12,50 €" → 12.5 · "3.99" → 3.99 · "gratuit" → null */
export function parsePrix(brut: string): number | null {
  const n = parseFloat(brut.trim().replace(',', '.'));
  return Number.isNaN(n) ? null : n;
}

// ─── §11 — JSON.parse / JSON.stringify : favoris dans localStorage ────────────

export const CLE_FAVORIS = 'exemple-biblio.favoris';

export function lireFavoris(): number[] {
  const brut = localStorage.getItem(CLE_FAVORIS); // string | null
  if (brut === null) {
    return [];
  }
  try {
    const valeur: unknown = JSON.parse(brut); // texte → objet ; peut jeter
    return Array.isArray(valeur) ? valeur.filter((v): v is number => typeof v === 'number') : [];
  } catch {
    localStorage.removeItem(CLE_FAVORIS); // donnée corrompue : on nettoie
    return [];
  }
}

export function ecrireFavoris(ids: number[]): void {
  localStorage.setItem(CLE_FAVORIS, JSON.stringify(ids)); // objet → texte
}

export function basculerFavori(id: number): number[] {
  const actuels = lireFavoris();
  const prochains = actuels.includes(id) ? actuels.filter((x) => x !== id) : [...actuels, id];
  ecrireFavoris(prochains);
  return prochains;
}

// ─── §15 — Map : un cache de résumés par livre ────────────────────────────────

export class CacheResumes {
  private readonly cache = new Map<number, string>();

  /** Résumé mémoïsé : `calcul` n'est appelé qu'une fois par id. */
  resume(livre: Livre, calcul: (l: Livre) => string): string {
    if (this.cache.has(livre.id)) {
      return this.cache.get(livre.id)!; // has() garantit la présence, TS l'ignore
    }
    const r = calcul(livre);
    this.cache.set(livre.id, r);
    return r;
  }

  invalider(id: number): void {
    this.cache.delete(id);
  }

  vider(): void {
    this.cache.clear();
  }

  get taille(): number {
    return this.cache.size;
  }
}

// ─── §10 — intercepteur fonctionnel ───────────────────────────────────────────

/** Ajoute un en-tête à chaque requête sortante (les requêtes sont immuables → clone). */
export const enTeteClientInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ setHeaders: { 'X-Client': 'exemple-biblio' } }));
};

// ─── §6 — combiner les opérateurs : une recherche en direct ───────────────────
// Fonctions autonomes (pas de service) : plus simples à tester indépendamment.

/**
 * Le cœur de la recherche : debounce + ignore les doublons + annule la requête
 * obsolète (switchMap). Prend un flux de TERMES en entrée, indépendant des
 * signals — c'est ce qui la rend testable sans TestBed ni horloge réelle.
 */
export function pipelineRecherche(
  http: HttpClient,
  termes$: Observable<string>,
  debounceMs = 300,
): Observable<Livre[]> {
  return termes$.pipe(
    debounceTime(debounceMs), // attend un silence dans la frappe
    distinctUntilChanged(), // ignore si le terme "debouncé" n'a pas changé
    switchMap((terme) =>
      terme.trim() === ''
        ? of([] as Livre[]) // rien à chercher → flux de remplacement immédiat
        : http.get<unknown[]>(`${API_BIBLIO}/livres`, { params: { titre_like: terme } }).pipe(
            map((bruts) => bruts.filter(estLivreDTO).map(versLivre)),
            catchError(() => of([] as Livre[])), // erreur réseau → liste vide, pas de crash
          ),
    ),
  );
}

/** La même recherche, branchée sur un signal via toObservable/toSignal. */
export function creerRechercheLivres(
  http: HttpClient,
  terme: Signal<string>,
  options: { debounceMs?: number; injector?: Injector } = {},
): { resultats: Signal<Livre[]> } {
  const resultats$ = pipelineRecherche(
    http,
    toObservable(terme, { injector: options.injector }),
    options.debounceMs,
  );
  return {
    resultats: toSignal(resultats$, { initialValue: [] as Livre[], injector: options.injector }),
  };
}

// ─── §9 (rxResource) — deux requêtes DÉPENDANTES dans un seul resource ────────

export interface DetailLivre {
  livre: Livre;
  recommandation: Livre | undefined;
}

/** Charge un livre, PUIS une recommandation du même auteur — httpResource seul ne sait pas enchaîner. */
export function creerDetailLivreRes(
  http: HttpClient,
  livreId: Signal<number>,
  options: { injector?: Injector } = {},
) {
  return rxResource<DetailLivre, number>({
    params: () => livreId(),
    stream: ({ params }) =>
      http.get<LivreDTO>(`${API_BIBLIO}/livres/${params}`).pipe(
        switchMap((dto) =>
          http.get<LivreDTO[]>(`${API_BIBLIO}/livres`, { params: { auteur: dto.auteur } }).pipe(
            map((memeAuteur) => ({
              livre: versLivre(dto),
              recommandation: memeAuteur.filter((l) => l.id !== dto.id).map(versLivre)[0],
            })),
          ),
        ),
      ),
    injector: options.injector,
  });
}

// ─── Le service : httpResource, then/catch/finally, .subscribe(), .pipe() ─────

@Service()
export class BiblioService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  /** §9 — lecture réactive et déclarative ; `parse` filtre la forme (§14) et mappe les dates (§12). */
  readonly livresRes = httpResource<Livre[]>(() => `${API_BIBLIO}/livres`, {
    defaultValue: [],
    parse: (brut) =>
      Array.isArray(brut) ? (brut as unknown[]).filter(estLivreDTO).map(versLivre) : [],
  });

  // §7 — état géré à la main avec then / catch / finally (pour une action ponctuelle).
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);
  private readonly _livres = signal<Livre[]>([]);
  readonly livres = this._livres.asReadonly();

  chargerAvecEtat(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);
    return firstValueFrom(this.http.get<unknown[]>(`${API_BIBLIO}/livres`))
      .then((bruts) => {
        this._livres.set(bruts.filter(estLivreDTO).map(versLivre)); // succès
      })
      .catch(() => {
        this.erreur.set('Chargement impossible'); // réseau, 4xx, 5xx…
      })
      .finally(() => {
        this.chargement.set(false); // dans tous les cas
      });
  }

  /** §4 — `.subscribe()` manuel + `takeUntilDestroyed()` : rare, réservé à un effet de bord ponctuel. */
  chargerViaSubscribe(surResultat: (livres: Livre[]) => void): void {
    this.http
      .get<unknown[]>(`${API_BIBLIO}/livres`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (bruts) => surResultat(bruts.filter(estLivreDTO).map(versLivre)),
        error: () => surResultat([]),
      });
  }

  /** §5 — `.pipe()` avec les opérateurs de base : tap / map / catchError / finalize. */
  chargerAvecOperateurs(): Observable<Livre[]> {
    return this.http.get<unknown[]>(`${API_BIBLIO}/livres`).pipe(
      // ⚠️ tap(fn) avec une fonction NUE = handler `next` : ne s'exécute qu'à
      // la réception d'une valeur, pas à l'abonnement. Pour un drapeau
      // "chargement" posé AVANT le départ de la requête, il faut la forme
      // objet de tap() et son callback `subscribe`.
      tap({ subscribe: () => this.chargement.set(true) }),
      map((bruts) => bruts.filter(estLivreDTO).map(versLivre)), // DTO[] → Livre[]
      catchError(() => of([] as Livre[])), // erreur → flux de remplacement
      finalize(() => this.chargement.set(false)), // quoi qu'il arrive
    );
  }

  /** §3 + §12 — création : POST sans `id`, date en ISO ; on remappe la réponse. */
  ajouterLivre(titre: string, auteur: string, maintenant: Date): Promise<Livre> {
    const corps = corpsNouveauLivre(titre, auteur, maintenant);
    return firstValueFrom(this.http.post<LivreDTO>(`${API_BIBLIO}/livres`, corps)).then(versLivre);
  }
}
