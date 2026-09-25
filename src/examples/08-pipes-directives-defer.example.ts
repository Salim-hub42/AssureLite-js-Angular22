/**
 * Module 8 — exemple générique : pipes, directives, @defer, piles/files, chaînes et nombres
 *
 * Domaine isolé : une petite boutique de vélos (pas d'assurance).
 *
 * Les numéros de section (§N) renvoient à docs/08-pipes-directives-defer.md.
 * Ce fichier ne compte PAS dans docs/traçabilité-js.md : il isole la syntaxe.
 * Seul le code de la partie "Pratique" (dans src/app/) valide une ligne de la table.
 */

import {
  CurrencyPipe,
  DatePipe,
  registerLocaleData,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {
  afterNextRender,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';

// §3 — dans l'app réelle, c'est app.config.ts qui s'en charge (avec LOCALE_ID)
registerLocaleData(localeFr);

// ─── §4 — pipes personnalisés ─────────────────────────────────────────────────

/** Coupe un texte trop long au premier espace après `max` caractères (indexOf + substring). */
@Pipe({ name: 'tronquer' })
export class TronquerPipe implements PipeTransform {
  transform(texte: string, max = 20): string {
    if (texte.length <= max) {
      return texte;
    }
    const espace = texte.indexOf(' ', max); // -1 si aucun espace après max
    return espace === -1 ? texte : texte.substring(0, espace) + '…';
  }
}

/** "06 12 34 56 78" → "06••••••78" (replace + slice). */
@Pipe({ name: 'masquerTelephone' })
export class MasquerTelephonePipe implements PipeTransform {
  transform(tel: string): string {
    const chiffres = tel.replace(/\s/g, ''); // /g : TOUS les espaces
    if (chiffres.length < 4) {
      return tel;
    }
    return chiffres.slice(0, 2) + '•'.repeat(chiffres.length - 4) + chiffres.slice(-2);
  }
}

// ─── §7 — directive d'attribut : host + input ─────────────────────────────────

@Directive({
  selector: '[appSurbrillance]',
  host: { '[class.surbrillance]': 'actif()' },
})
export class SurbrillanceDirective {
  // alias : on écrit [appSurbrillance]="condition" dans le template
  readonly actif = input(false, { alias: 'appSurbrillance' });
}

// ─── §8 — directive qui agit sur le DOM : autofocus ───────────────────────────

@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // L'élément n'est dans la page qu'APRÈS l'affichage
    afterNextRender(() => this.element.nativeElement.focus());
  }
}

// ─── §10 — tableaux : historique borné (unshift + pop) et file (push / shift) ─

export const MAX_HISTORIQUE = 5;

/** Fonction pure : renvoie un NOUVEAU tableau, ne touche pas à l'original. */
export function ajouterAHistorique(historique: string[], recherche: string): string[] {
  const copie = historique.slice(); // slice() sans argument = copie complète
  copie.unshift(recherche); // la plus récente en tête
  if (copie.length > MAX_HISTORIQUE) {
    copie.pop(); // la plus ancienne, en queue, sort
  }
  return copie;
}

/** File "premier arrivé, premier servi" de commandes à préparer. */
export class FileCommandes {
  private readonly _file = signal<string[]>([]);
  readonly file = this._file.asReadonly();
  readonly prochaine = computed(() => this._file()[0]);

  ajouter(commande: string): void {
    this._file.update((f) => {
      const copie = f.slice();
      copie.push(commande); // en fin de file
      return copie;
    });
  }

  ajouterPrioritaire(commande: string): void {
    this._file.update((f) => {
      const copie = f.slice();
      copie.unshift(commande); // passe devant tout le monde
      return copie;
    });
  }

  traiterSuivante(): string | undefined {
    const copie = this._file().slice();
    const premiere = copie.shift(); // récupère ET retire la première
    this._file.set(copie);
    return premiere;
  }
}

// ─── §11 — nombres : saisie texte → nombre, moyenne arrondie ──────────────────

/** "1 299,90 €" → 1299.9 ; "abc" → null (replace + parseFloat). */
export function parserPrix(saisie: string): number | null {
  const normalise = saisie.replace(/\s/g, '').replace(',', '.');
  const prix = parseFloat(normalise); // s'arrête au premier caractère invalide ("€")
  return Number.isNaN(prix) ? null : prix;
}

/** Moyenne des notes avec 2 chiffres significatifs : [4, 5, 4] → "4.3" (toPrecision). */
export function noteMoyenne(notes: number[]): string {
  if (notes.length === 0) {
    return '–';
  }
  const moyenne = notes.reduce((somme, n) => somme + n, 0) / notes.length;
  return moyenne.toPrecision(2);
}

// ─── §9 — composant différé par @defer ────────────────────────────────────────
// Dans une vraie app il serait dans son propre fichier : c'est ce qui permet
// au code d'être téléchargé à part. Ici, on illustre seulement les blocs.

@Component({
  selector: 'app-avis-velo',
  template: `<p class="avis">Note moyenne des clients : {{ moyenne() }} / 5</p>`,
})
export class AvisVelo {
  readonly notes = input<number[]>([]);
  readonly moyenne = computed(() => noteMoyenne(this.notes()));
}

// ─── Assemblage : pipes intégrés + personnalisés, directives, @defer ──────────

export interface Velo {
  nom: string;
  prix: number;
  ajouteLe: Date;
  description: string;
  enPromo: boolean;
  notes: number[];
}

@Component({
  selector: 'app-exemple-boutique',
  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    UpperCasePipe,
    TronquerPipe,
    MasquerTelephonePipe,
    SurbrillanceDirective,
    AutofocusDirective,
    AvisVelo,
  ],
  template: `
    <label for="recherche">Rechercher un vélo</label>
    <input id="recherche" type="search" appAutofocus />

    <p>Service client : {{ telephone | masquerTelephone }}</p>

    <ul>
      @for (velo of velos(); track velo.nom) {
        <li [appSurbrillance]="velo.enPromo">
          <strong>{{ velo.nom | titlecase }}</strong>
          @if (velo.enPromo) {
            <span class="badge">{{ 'promo' | uppercase }}</span>
          }
          — {{ velo.prix | currency: 'EUR' }}
          <small>ajouté le {{ velo.ajouteLe | date: 'longDate' }}</small>
          <p>{{ velo.description | tronquer: 30 }}</p>
        </li>
      }
    </ul>

    @defer (on viewport) {
      <app-avis-velo [notes]="toutesLesNotes()" />
    } @placeholder {
      <p>Les avis s'afficheront en arrivant ici…</p>
    } @loading (minimum 300ms) {
      <p>Chargement des avis…</p>
    }
  `,
  styles: `
    .surbrillance {
      outline: 2px solid #92400e;
    }
  `,
})
export class ExempleBoutique {
  readonly telephone = '06 12 34 56 78';

  readonly velos = signal<Velo[]>([
    {
      nom: 'vélo de ville',
      prix: 1299.9,
      ajouteLe: new Date(2026, 8, 25),
      description: 'Un vélo robuste et confortable pour tous les trajets du quotidien',
      enPromo: true,
      notes: [4, 5, 4],
    },
    {
      nom: 'vtt',
      prix: 849,
      ajouteLe: new Date(2026, 0, 3),
      description: 'Pour les chemins',
      enPromo: false,
      notes: [5],
    },
  ]);

  readonly toutesLesNotes = computed(() => this.velos().flatMap((v) => v.notes));
}
