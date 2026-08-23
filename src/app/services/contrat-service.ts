import { computed, Service, signal } from '@angular/core';
import { Contrat } from '../models/contrat.model';
import { StatutContrat } from '../models/contrat.model';
import { CONTRATS_MOCKS } from '../data/mock-data';
import { primeTotal } from '../models/contrat.utils';

@Service()
export class ContratService {
   

  private readonly _contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  readonly contrats = this._contrats.asReadonly();

  private readonly _statutsFiltres = signal<Set<StatutContrat>>(new Set());
  readonly statutsFiltres = this._statutsFiltres.asReadonly();

  primeTotale = computed(() => primeTotal(this.contrats()));

  contratsFiltres = computed(() => {
  return this.statutsFiltres().size === 0 ? this.contrats() : this.contrats().filter((contrat) => this.statutsFiltres().has(contrat.statut) )
  })


  toggle(status: StatutContrat): void {
      this._statutsFiltres.update((set) => {
        const copie = new Set(set);
       if (copie.has(status)) {
        copie.delete(status)
       }
       else {
        copie.add(status)
       }
       return copie
     }
    )
   }
      
    reinitialiserFiltres() : void {
      this._statutsFiltres.update((set) => {
        const copie = new Set(set);
        copie.clear()
        return copie
      })
    }



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

  modifierContrat(id : number, patch: Partial<Contrat>): void{
    this._contrats.update((liste) => {
    return  liste.map((contrat) => (contrat.id === id ? Object.assign({} , contrat , patch) : contrat))
      })
  }

 



}
