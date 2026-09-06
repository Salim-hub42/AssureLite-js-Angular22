import { computed, Service, signal } from '@angular/core';
import { Contrat, TypeContrat } from '../models/contrat.model';
import { StatutContrat } from '../models/contrat.model';
import { CONTRATS_MOCKS } from '../data/mock-data';
import { genererReference, primeTotal } from '../models/contrat.utils';
import { Devis } from '../models/devis.model';
import { calculerPrimeDevis } from '../models/devis.utils';

@Service()
export class ContratService {
   

  private readonly _contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  readonly contrats = this._contrats.asReadonly();

  private readonly _statutsFiltres = signal<Set<StatutContrat>>(new Set());
  readonly statutsFiltres = this._statutsFiltres.asReadonly();

  primeTotale = computed(() => primeTotal(this.contratsFiltres()));

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



  souscrireContrat(donnees:{clientId: number; type: TypeContrat; ageClient: number; optionsChoisies: string[];}): Contrat{
     const devis : Devis = {
      id : 0,
      clientId : donnees.clientId,
      typeDeContrat: donnees.type,
      ageClient: donnees.ageClient,
      optionsChoisies: donnees.optionsChoisies
     };

     const prime = calculerPrimeDevis(devis);
     const reference = genererReference(donnees.type.toUpperCase());

     const nouveauContrat: Contrat = {
      id: this._contrats().length +1,
      clientId: donnees.clientId,
      type: donnees.type,
      statut: 'actif',
      prime,
      dateDebut: new Date(),
      reference,
     }

     this._contrats.update((liste) => {
      const copie = [...liste];
      copie.push(nouveauContrat);
      return copie; 
     });
     
     return nouveauContrat;


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
