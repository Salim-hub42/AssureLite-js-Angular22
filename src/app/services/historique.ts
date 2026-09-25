import { Service, signal } from '@angular/core';

const MAX_HISTORIQUE = 5;

@Service()
export class Historique {
 
   private readonly _consultes = signal<number[]>([]);
   readonly consultes = this._consultes.asReadonly();

   enregistrer(id: number): void{
      this._consultes.update((liste) => {
         const copie =  liste.filter((idVu) => idVu !== id );
         copie.unshift(id);
         if (copie.length > MAX_HISTORIQUE){
             copie.pop();
         }
         return copie;
      })
   }









}
