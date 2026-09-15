
export type TypeContrat = 'auto' | 'habitation' | 'sante';
export type StatutContrat = 'actif' | 'resilie' |'suspendu';

export interface Contrat {
   id: number,
   clientId: number,
   type: TypeContrat,
   statut: StatutContrat,
   prime: number,
   dateDebut: Date,
   reference?: string
}

export interface ContratDTO extends Omit<Contrat, 'dateDebut'> {
   dateDebut: string;
}