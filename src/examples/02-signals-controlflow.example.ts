// Exemple générique — Module 2 (composants, signals, control flow)
// Domaine volontairement générique (tâches), pas d'assurance : on isole la syntaxe Angular pure.
// La version "assurance" (liste des contrats) sera codée dans src/app/*.

import { Component, computed, signal } from '@angular/core';

export type StatutTache = 'a_faire' | 'en_cours' | 'terminee';

export interface Tache {
  id: number;
  titre: string;
  statut: StatutTache;
}

@Component({
  selector: 'app-exemple-taches',
  template: `
    @if (taches().length > 0) {
      <p>{{ taches().length }} tâche(s) — {{ tachesTerminees() }} terminée(s)</p>
    } @else {
      <p>Aucune tâche</p>
    }

    <ul>
      @for (tache of taches(); track tache.id) {
        <li>
          {{ tache.titre }} —
          @switch (tache.statut) {
            @case ('a_faire') {
              <span>À faire</span>
            }
            @case ('en_cours') {
              <span>En cours</span>
            }
            @default {
              <span>Terminée ✅</span>
            }
          }
        </li>
      } @empty {
        <li>Rien à afficher</li>
      }
    </ul>
  `
})
export class ExempleTaches {
  // signal : l'état, une liste qu'on va faire évoluer
  taches = signal<Tache[]>([
    { id: 1, titre: 'Écrire la leçon', statut: 'terminee' },
    { id: 2, titre: 'Faire l’exemple', statut: 'en_cours' },
    { id: 3, titre: 'Coder la pratique', statut: 'a_faire' }
  ]);

  // computed : se recalcule automatiquement à chaque changement de `taches`
  tachesTerminees = computed(
    () => this.taches().filter((tache) => tache.statut === 'terminee').length
  );

  // update() + copie + push : on mute la COPIE, jamais le signal directement
  ajouterTache(titre: string): void {
    this.taches.update((liste) => {
      const copie = [...liste];
      copie.push({ id: copie.length + 1, titre, statut: 'a_faire' });
      return copie;
    });
  }

  // update() + copie + shift : même principe pour retirer un élément
  retirerPremiereTache(): void {
    this.taches.update((liste) => {
      const copie = [...liste];
      copie.shift();
      return copie;
    });
  }
}
