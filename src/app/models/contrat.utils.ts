import { Contrat, TypeContrat } from "./contrat.model";

export function contratEstComplet(contrat: Contrat): boolean {
  return Object.values(contrat).every((valeur) => valeur !== null && valeur !== undefined && valeur !== "");
}

export function champsDuContrat(contrat: Contrat): string[] {
   return Object.keys(contrat)
}

export function afficherContratEnConsole(contrat: Contrat): void {
   Object.entries(contrat).forEach(([cle , val]) => {
        console.log(`${cle} : ${val}`)
   })
}

export function typesDesContratUniques(contrats: Contrat[]):TypeContrat[] {
   const extractionTypes = new Set<TypeContrat>();
   contrats.forEach((contrat) => extractionTypes.add(contrat.type))
   return [...extractionTypes]
}

export function primeDesContrats(contrats: Contrat[]): number[] {
    return contrats.map((contrat) => contrat.prime);
}

export function auMoinsUnContratActif(contrats: Contrat[]): boolean {
   return contrats.some((contrat) => contrat.statut === 'actif');
}

export function primeTotal(contrats: Contrat[]): number {
   return contrats.reduce((acc , contrat) => acc + contrat.prime, 0);
}

export function primeTotalFormatee(contrats: Contrat[]): string {
   return primeTotal(contrats).toFixed(2)
}

export function contratDeTypeExiste(contrats: Contrat[], type: TypeContrat): boolean {
   return contrats.map((contrat) => contrat.type).includes(type);
}

export function joursDepuisDebut(contrat: Contrat , aujourdhui: Date): number {
   const millisecondesParJour = 1000 * 60 * 60 * 24 ;
   const dureeEnJours = (aujourdhui.getTime() - contrat.dateDebut.getTime()) / millisecondesParJour ; 
   return dureeEnJours ; 
}