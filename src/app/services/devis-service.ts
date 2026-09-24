import { Service } from '@angular/core';
import { Devis} from '../models/devis.model';
import { calculerPrimeDevis } from '../models/devis.utils';


 

@Service()
export class DevisService {

   private readonly cachePrime = new Map<string , number>();
   private readonly  TAILLE_MAX_CACHE = 20;

   private cle(devis: Devis): string {
      return `${devis.ageClient}-${devis.typeDeContrat}-${devis.clientId}-${devis.optionsChoisies.join('-')}`;
   }

   calculerAvecCache(devis: Devis): number {
      const cle = this.cle(devis);
      if (this.cachePrime.has(cle)) {
         return this.cachePrime.get(cle)!;
      }
      const pasEnCache = calculerPrimeDevis(devis);
      if(this.cachePrime.size >= this.TAILLE_MAX_CACHE){
         const plusAncienne = this.cachePrime.keys().next().value;
         this.cachePrime.delete(plusAncienne!)
      }
      this.cachePrime.set(cle,pasEnCache);
      return pasEnCache
   }



   reinitialiserCache(): void {
      this.cachePrime.clear();
   }


    // getter pour le .spec
   get taille(): number {
      return this.cachePrime.size;
   }











}
