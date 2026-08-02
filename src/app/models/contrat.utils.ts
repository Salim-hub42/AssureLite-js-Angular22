import { Contrat, TypeContrat } from "./contrat.model";

export function contratEstComplet(contrat: Contrat): boolean {
  return Object.values(contrat).every((valeur) => valeur !== null && valeur !== undefined && valeur !== "")
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