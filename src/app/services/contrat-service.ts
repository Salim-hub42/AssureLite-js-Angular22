import { computed, inject, Service, signal } from '@angular/core';
import { Contrat, TypeContrat, ContratDTO } from '../models/contrat.model';
import { StatutContrat } from '../models/contrat.model';
import { estContrat, genererReference, primeTotal, versContrat } from '../models/contrat.utils';
import { Devis } from '../models/devis.model';
import { calculerPrimeDevis } from '../models/devis.utils';
import { HttpClient, httpResource } from '@angular/common/http';
import { API } from '../core/api';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification-service';

@Service()
export class ContratService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  private readonly _contrats = httpResource<ContratDTO[]>(() => `${API}/contrats`, {
    defaultValue: [],
    parse: (brut) => (Array.isArray(brut) ? brut.filter(estContrat) : []),
  });
  readonly contrats = computed(() => this._contrats.value().map(versContrat));

  private readonly _statutsFiltres = signal<Set<StatutContrat>>(new Set());
  readonly statutsFiltres = this._statutsFiltres.asReadonly();

  primeTotale = computed(() => primeTotal(this.contratsFiltres()));

  contratsFiltres = computed(() => {
    return this.statutsFiltres().size === 0
      ? this.contrats()
      : this.contrats().filter((contrat) => this.statutsFiltres().has(contrat.statut));
  });

  toggle(status: StatutContrat): void {
    this._statutsFiltres.update((set) => {
      const copie = new Set(set);
      if (copie.has(status)) {
        copie.delete(status);
      } else {
        copie.add(status);
      }
      return copie;
    });
  }

  reinitialiserFiltres(): void {
    this._statutsFiltres.update((set) => {
      const copie = new Set(set);
      copie.clear();
      return copie;
    });
  }

  souscrireContrat(donnees: {
    clientId: number;
    type: TypeContrat;
    ageClient: number;
    optionsChoisies: string[];
  }): Promise<Contrat> {
    const devis: Devis = {
      id: 0,
      clientId: donnees.clientId,
      typeDeContrat: donnees.type,
      ageClient: donnees.ageClient,
      optionsChoisies: donnees.optionsChoisies,
    };

    const prime = calculerPrimeDevis(devis);
    const reference = genererReference(donnees.type.toUpperCase());

    const corps = {
      clientId: donnees.clientId,
      type: donnees.type,
      statut: 'actif' as const,
      prime,
      reference,
      dateDebut: new Date().toISOString(),
    };

    return firstValueFrom(this.http.post<ContratDTO>(`${API}/contrats`, corps))
      .then((dto) => {
        this._contrats.reload();
        this.notificationService.info(`Contrat ${reference} souscrit`);
        return versContrat(dto);
      })
      .catch((erreur) => {
        console.log('Echec de la souscription', erreur);
        this.notificationService.erreur('Échec de la souscription du contrat');
        throw erreur;
      })
      .finally(() => {
        console.log('Requete de souscription terminée');
      });
  }

  supprimerContrat(id: number): void {
    firstValueFrom(this.http.delete(`${API}/contrats/${id}`))
      .then(() => {
        this._contrats.reload();
        this.notificationService.info(`Contrat n°${id} supprimé`);
      })
      .catch((erreur) => {
        console.error('Échec de la suppression', erreur);
        this.notificationService.erreur(`Échec de la suppression du contrat n°${id}`);
      });
  }

  modifierContrat(id: number, patch: Partial<Contrat>): void {
    this._contrats.update((liste) => {
      return liste.map((contrat) =>
        contrat.id === id ? Object.assign({}, contrat, patch) : contrat,
      );
    });
  }
}
