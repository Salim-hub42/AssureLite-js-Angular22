import { Service } from '@angular/core';
import { Devis} from '../models/devis.model';
import { calculerPrimeDevis } from '../models/devis.utils';


 

@Service()
export class DevisService {

   private readonly cachePrime = new Map<string , number>();

   private cle(devis: Devis): string {
      return `${devis.ageClient}-${devis.typeDeContrat}-${devis.clientId}-${devis.optionsChoisies.join('-')}`;
   }

   calculerAvecCache(devis: Devis): number {
      const cle = this.cle(devis);
      if (this.cachePrime.has(cle)) {
         return this.cachePrime.get(cle)!;
      }
      const pasEnCache = calculerPrimeDevis(devis);
      this.cachePrime.set(cle,pasEnCache);
      return pasEnCache
   }

   recalculer(devis: Devis): number {
      this.cachePrime.delete(this.cle(devis));
      return this.calculerAvecCache(devis);
   }

   reinitialiserCache(): void {
      this.cachePrime.clear();
   }


    // getter pour le .spec
   get taille(): number {
      return this.cachePrime.size;
   }











}
