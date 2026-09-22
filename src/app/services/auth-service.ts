import { computed, Service, signal } from '@angular/core';
import { Session } from '../models/utilisateur.model';
import { lireSession, effacerSession } from '../models/session.utils';

@Service()
export class AuthService {
  private readonly _session = signal<Session | null>(lireSession());
  readonly session = this._session.asReadonly();

  readonly estConnecte = computed(() => this.session() !== null);

  logout(): void {
    effacerSession();
    this._session.set(null);
  }
}
