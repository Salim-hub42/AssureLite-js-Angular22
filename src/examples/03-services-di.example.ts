// Exemple générique — Module 3 (services, injection de dépendances, communication entre composants)
// Domaine volontairement générique (un compteur), pas d'assurance : on isole la syntaxe Angular pure.
// La version "assurance" (ContratsService + composant enfant) sera codée dans src/app/*.

import { Component, Service, computed, inject, input, output, signal } from '@angular/core';

// 1. Service : état centralisé, protégé (signal privé + exposition en lecture seule)
// @Service() : auto-fourni dans toute l'appli (singleton), sans préciser providedIn.
@Service()
export class ExempleCompteurService {
  private readonly _valeur = signal(0);
  readonly valeur = this._valeur.asReadonly();
  readonly estPositif = computed(() => this._valeur() > 0);

  incrementer(pas: number): void {
    this._valeur.update((v) => v + pas);
  }

  reinitialiser(): void {
    this._valeur.set(0);
  }
}

// 2. Composant enfant : reçoit une donnée (input) et signale un événement (output)
//    Il ne connaît pas le service : il se contente d'afficher et d'émettre.
@Component({
  selector: 'app-exemple-bouton-compteur',
  template: ` <button (click)="incrementer.emit(pas())">
    +{{ pas() }} (actuel : {{ valeur() }})
  </button>`
})
export class ExempleBoutonCompteur {
  valeur = input.required<number>();
  pas = input<number>(1);
  incrementer = output<number>();
}

// 3. Composant parent : injecte le service avec inject() (jamais le constructeur)
//    et relie l'enfant via [valeur]/(incrementer).
@Component({
  selector: 'app-exemple-compteur-parent',
  imports: [ExempleBoutonCompteur],
  template: `
    <app-exemple-bouton-compteur
      [valeur]="valeur()"
      [pas]="5"
      (incrementer)="onIncrementer($event)"
    />
    <p>{{ estPositif() ? 'Positif' : 'Zéro ou négatif' }}</p>
  `
})
export class ExempleCompteurParent {
  private readonly compteurService = inject(ExempleCompteurService);

  valeur = this.compteurService.valeur;
  estPositif = this.compteurService.estPositif;

  onIncrementer(pas: number): void {
    this.compteurService.incrementer(pas);
  }
}

// 4. Object.assign : fusionner un patch sur un élément d'une liste sans le muter
export interface ExempleItem {
  id: number;
  label: string;
  actif: boolean;
}

export function fusionnerPatch(item: ExempleItem, patch: Partial<ExempleItem>): ExempleItem {
  return Object.assign({}, item, patch);
  // équivalent avec le spread : { ...item, ...patch }
}

export function modifierItem(
  liste: ExempleItem[],
  id: number,
  patch: Partial<ExempleItem>
): ExempleItem[] {
  return liste.map((item) => (item.id === id ? fusionnerPatch(item, patch) : item));
}

// 5. Set : sélection sans doublon (add/delete/has/clear), copiée à chaque mise à jour
@Component({
  selector: 'app-exemple-filtre-tags',
  template: `
    @for (tag of tagsDisponibles(); track tag) {
      <button (click)="toggle(tag)">
        {{ tag }} {{ tagsSelectionnes().has(tag) ? '✓' : '' }}
      </button>
    }
    <button (click)="reinitialiser()">Réinitialiser</button>
  `
})
export class ExempleFiltreTags {
  tagsDisponibles = input<string[]>([]);

  private readonly _tagsSelectionnes = signal<Set<string>>(new Set());
  readonly tagsSelectionnes = this._tagsSelectionnes.asReadonly();

  toggle(tag: string): void {
    this._tagsSelectionnes.update((set) => {
      const copie = new Set(set);
      if (copie.has(tag)) {
        copie.delete(tag);
      } else {
        copie.add(tag);
      }
      return copie;
    });
  }

  reinitialiser(): void {
    this._tagsSelectionnes.update((set) => {
      const copie = new Set(set);
      copie.clear();
      return copie;
    });
  }
}
