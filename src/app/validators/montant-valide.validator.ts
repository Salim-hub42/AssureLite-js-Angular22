import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parserMontant } from '../models/sinistre.utils';

// Vérifie qu'un montant saisi en texte ( 1 500,00 € ) est lisible et strictement positif
export function montantValide(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const texte = control.value;
    // Champ vide : c'est le rôle de Validators.required, pas le nôtre
    if (texte === null || texte === '') {
      return null;
    }
    const montant = parserMontant(texte);
    if (Number.isNaN(montant) || montant <= 0) {
      return { montantInvalide: true };
    }
    return null;
  };
}
