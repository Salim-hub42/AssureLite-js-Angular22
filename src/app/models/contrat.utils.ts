import { Contrat } from "./contrat.model";

export function contratEstComplet(contrat: Contrat): boolean {
  return Object.values(contrat).every((valeur) => valeur !== null && valeur !== undefined && valeur !== "")
}

export function afficherContratEnConsole(contrat: Contrat): void {
   Object.entries(contrat).forEach(([cle , val]) => {
        console.log(`${cle} : ${val}`)
   })
}

export function champsDuContrat(contrat: Contrat): string[] {
   return Object.keys(contrat)
}