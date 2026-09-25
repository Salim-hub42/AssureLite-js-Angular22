import { computed, inject, Service, signal } from '@angular/core';
import { Session, Utilisateur } from '../models/utilisateur.model';
import { lireSession, effacerSession, ecrireSession } from '../models/session.utils';
import { HttpClient } from '@angular/common/http';
import { API } from '../core/api';
import { firstValueFrom } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _session = signal<Session | null>(lireSession());
  readonly session = this._session.asReadonly();

  readonly estConnecte = computed(() => this.session() !== null);

  logout(): void {
    effacerSession();
    this._session.set(null);
  }

  login(email: string, motDePasse: string ): Promise<void> {
    return firstValueFrom(this.http.get<Utilisateur[]>(`${API}/users`, { params: { email } })).then(
      (users) => {
        const u = users[0];
        if (!u || u.password !== motDePasse) {
          throw new Error('Identifiants invalides');
        }
        const session: Session = {email: u.email, userId: u.id, token: `demo-${u.id}-${Date.now()}` };
        this._session.set(session);
        ecrireSession(session);
      },
    );
  }
}
