import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// Domaine volontairement isolé (inscription à un événement, pas assurance) —
// sert à isoler la mécanique Reactive Forms + les méthodes JS du Module 5
// (parseFloat, Math.random, .concat(), Object.hasOwn).

export function ageMinimum(minimum: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age === null || age >= minimum) {
      return null;
    }
    return { ageMinimum: { minimum, actuel: age } };
  };
}

export function genererReference(prefixe: string): string {
  const numero = Math.floor(Math.random() * 100000);
  return prefixe.concat('-', String(numero));
  // équivalent plus courant : `${prefixe}-${numero}` — .concat() demandé par la traçabilité
}

export function montantSaisi(texte: string): number {
  return parseFloat(texte) || 0;
  // parseFloat('12,50 €') -> 12.5 : s'arrête au premier caractère invalide,
  // contrairement à Number('12,50 €') -> NaN qui rejette toute la chaîne
}

export function aUneErreurRequise(errors: Record<string, unknown> | null): boolean {
  return errors !== null && Object.hasOwn(errors, 'required');
}

@Component({
  selector: 'app-exemple-inscription-evenement',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="nom" placeholder="Nom" />
      @if (aUneErreurRequise(form.controls.nom.errors) && form.controls.nom.touched) {
        <p>Le nom est requis.</p>
      }

      <input type="number" formControlName="age" placeholder="Âge" />
      @if (form.controls.age.hasError('ageMinimum')) {
        <p>Âge minimum non atteint.</p>
      }

      <input formControlName="montant" placeholder="Montant (ex: 12,50 €)" />
      <p>Montant compris : {{ montant() }} €</p>

      <button type="submit" [disabled]="form.invalid">S'inscrire</button>
    </form>

    @if (reference(); as ref) {
      <p>Référence générée : {{ ref }}</p>
    }
  `,
})
export class ExempleInscriptionEvenement {
  form = new FormGroup({
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    age: new FormControl<number | null>(null, {
      validators: [Validators.required, ageMinimum(18)],
    }),
    montant: new FormControl('', { nonNullable: true }),
  });

  private readonly montantTexte = toSignal(this.form.controls.montant.valueChanges, {
    initialValue: this.form.controls.montant.value,
  });

  montant = computed(() => montantSaisi(this.montantTexte()));

  reference = signal<string | null>(null);

  aUneErreurRequise = aUneErreurRequise;

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.reference.set(genererReference('EVT'));
  }
}
