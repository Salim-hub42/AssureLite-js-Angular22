import { StatutSinistre } from "./sinistre.model";
import { Sinistre } from "./sinistre.model";


export function sinistresParStatut (sinistres: Sinistre[], statut: StatutSinistre): Sinistre[]{
   return sinistres.filter((sinistre) => {
      return sinistre.statut === statut
   })
}

export function montantTotalSinistres(sinistres: Sinistre[]): number {
   return sinistres.reduce((acc , sinistre) => acc + sinistre.montant , 0)
}

export function sinistrePlusRecent(sinistres: Sinistre[]): Sinistre | undefined {
   return sinistres.reduce((plusRecent, sinistreActuel) => {
      if (plusRecent.dateDeclaration.getTime() > sinistreActuel.dateDeclaration.getTime()){
         return plusRecent
      }else {
         return sinistreActuel
      }
   })
}