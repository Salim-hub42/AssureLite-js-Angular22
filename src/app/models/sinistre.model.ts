export type StatutSinistre = 'declare' | 'en_cours' | 'accepte' | 'refuse';

export interface Sinistre {
   id: number,
   contratId: number,
   dateDeclaration: Date,
   montant: number,
   statut: StatutSinistre
}

export interface SinistreDTO extends Omit<Sinistre, 'dateDeclaration' | 'montant'> {
   dateDeclaration: string;
   montant: string;
}