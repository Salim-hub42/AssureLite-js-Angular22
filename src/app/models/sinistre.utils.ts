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

export function afficherSinistreEnConsole(sinistre: Sinistre): void {
    Object.entries(sinistre).forEach(([key , val]) => console.log(`Sinistre - ${key} : ${val}`));
}

export function contratsAvecSinistres(sinistres: Sinistre[]):Set<number> {
   const idsContrat = new Set<number>();
   sinistres.forEach((sinistre) => idsContrat.add(sinistre.contratId));
   return idsContrat
}

export function contratADejaUnSinistre(idsContrat: Set<number>, contratId: number): boolean {
 const verifier = idsContrat.has(contratId);
  return verifier
}

export function nombreDeContratsAvecSinistre(idsContrat : Set<number>): number {
  const nbContrats = idsContrat.size;
  return nbContrats

}