import { computed, Service, signal } from '@angular/core';
import { Contrat } from '../models/contrat.model';
import { CONTRATS_MOCKS } from '../data/mock-data';
import { primeTotal } from '../models/contrat.utils';

@Service()
export class ContratService {
   

  private readonly _contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  readonly contrats = this._contrats.asReadonly();

  primeTotale = computed(() => primeTotal(this.contrats()));

  ajouterContrat() {
    this._contrats.update((listes) => {
      const copie = [...listes];
      copie.push({
        id: copie.length + 1,
        clientId: 1,
        type: 'auto',
        statut: 'actif',
        prime: 75,
        dateDebut: new Date(),
      });
      return copie;
    });
  }

  supprimerContrat(id: number): void {
    this._contrats.update((liste) => {
      const copie = [...liste];
      const index = copie.findIndex((contrat) => contrat.id === id);
      copie.splice(index, 1);
      return copie;
    });
  }





}
