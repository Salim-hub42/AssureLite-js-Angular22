import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { Sinistre, SinistreDTO } from '../models/sinistre.model';
import { versSinistre } from '../models/sinistre.utils';
import { API } from '../core/api';
import { NotificationService } from './notification-service';
import { firstValueFrom } from 'rxjs';

@Service()
export class SinistreService {
  private readonly http = inject(HttpClient);
  private readonly notif = inject(NotificationService);

  private readonly _sinistres = httpResource<SinistreDTO[]>(() => `${API}/sinistres`, {
    defaultValue: [],
  });

  readonly sinistres = computed(() => this._sinistres.value().map(versSinistre));

  declarer(contratId: number, montant: string): Promise<Sinistre> {
    const corps = {
      contratId: contratId,
      montant: montant,
      statut: 'declare' as const,
      dateDeclaration: new Date().toISOString(),
    };

    return firstValueFrom(this.http.post<SinistreDTO>(`${API}/sinistres`, corps))
      .then((dto) => {
        this._sinistres.reload();
        this.notif.info(`Sinistre n°${dto.id} déclaré`);
        return versSinistre(dto);
      })
      .catch((erreur) => {
        console.log('Échec de la déclaration', erreur);
        this.notif.erreur('Échec de la déclaration du sinistre');
        throw erreur;
      })
      .finally(() => {
        console.log('Requête de déclaration terminée');
      });
  }
}
