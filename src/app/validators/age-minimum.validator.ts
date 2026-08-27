import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageMinimum(minimum: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age === null || age >= minimum) {
      return null;
    }
    return { ageMinimum: { minimum, actuel: age } };
  };
}
