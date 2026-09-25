import { Service, computed, signal } from '@angular/core';

export type TypeNotification = 'info' | 'erreur';

// Pas « Notification » : ce nom est déjà pris par la classe globale du navigateur
export interface MessageNotification {
  type: TypeNotification;
  texte: string;
}

// File d'attente (FIFO) : seule la première notification est affichée,
// les suivantes attendent leur tour.
@Service()
export class NotificationService {
  private readonly _file = signal<MessageNotification[]>([]);
  readonly file = this._file.asReadonly();

  // La notification affichée = la première de la file (undefined si la file est vide)
  readonly courante = computed<MessageNotification | undefined>(() => this._file()[0]);

  // Message normal : il se place à la FIN de la file et attend son tour
  info(texte: string): void {
    this._file.update((file) => {
      const copie = file.slice();
      copie.push({ type: 'info', texte });
      return copie;
    });
  }

  // Erreur : urgente, elle passe DEVANT toutes les autres
  erreur(texte: string): void {
    this._file.update((file) => {
      const copie = file.slice();
      copie.unshift({ type: 'erreur', texte });
      return copie;
    });
  }

  // Fermer la notification affichée : on retire la PREMIÈRE, la suivante apparaît
  fermer(): void {
    this._file.update((file) => {
      const copie = file.slice();
      copie.shift(); // shift() renvoie l'élément retiré : on l'ignore, on renvoie la copie
      return copie;
    });
  }
}
