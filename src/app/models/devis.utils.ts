import {  TypeContrat } from "./contrat.model";
import { Devis } from "./devis.model";

const PRIX_BASE_PAR_TYPE: Record<TypeContrat, number> = {
  auto: 400,
  habitation: 250,
  sante: 300
};

const MONTANT_PAR_OPTION = 15;

export function primeDeBase(type: TypeContrat): number {
 return PRIX_BASE_PAR_TYPE[type]
}

export function appliquerMajorationAge(prixBase: number, ageClient: number): number {
  let prime: number;
  if (ageClient < 25) {
     prime = prixBase * 1.2 ;
  }else if (ageClient > 65){
    prime = prixBase * 1.1;
  }else {
     prime = prixBase;
  }
  return Math.round(prime * 100) / 100;
}

export function appliquerMajorationOption(prime: number , options: string[]): number {
   prime = prime + options.length * MONTANT_PAR_OPTION;
   return prime
}

export function calculerPrimeDevis(devis: Devis): number {
   const primeBase = primeDeBase(devis.typeDeContrat);
   const primeAvecAge = appliquerMajorationAge(primeBase, devis.ageClient);
   const primeFinale = appliquerMajorationOption(primeAvecAge, devis.optionsChoisies)
   return primeFinale
}

