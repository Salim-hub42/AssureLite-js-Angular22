import { TypeContrat } from "./contrat.model"

export interface Devis {
   id:number,
   clientId: number,
   typeDeContrat: TypeContrat,
   ageClient: number,
   optionsChoisies: string[],
}