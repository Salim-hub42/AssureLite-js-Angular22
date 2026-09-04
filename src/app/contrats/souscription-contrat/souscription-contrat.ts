import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ageMinimum } from '../../validators/age-minimum.validator';
import { TypeContrat } from '../../models/contrat.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Devis } from '../../models/devis.model';
import { calculerPrimeDevis } from '../../models/devis.utils';

@Component({
  selector: 'app-souscription-contrat',
  imports: [ReactiveFormsModule, Card, ButtonModule, Divider, InputText, Select],
  templateUrl: './souscription-contrat.html',
  styleUrl: './souscription-contrat.scss',
})
export class SouscriptionContrat {
  form = new FormGroup({
    clientId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    typeDeContrat: new FormControl<TypeContrat | null>(null, Validators.required),
    ageClient: new FormControl<number | null>(null, {
      validators: [Validators.required, ageMinimum(18)],
    }),
    optionsChoisies: new FormControl<string[]>([]),
  });

  readonly typesContrat = [
    { label: 'Auto', value: 'auto' },
    { label: 'Habitation', value: 'habitation' },
    { label: 'Santé', value: 'sante' },
  ];

  readonly optionsDisponibles = [
    { label: 'Protection juridique', value: 'protection-juridique' },
    { label: 'Assistance 24/7', value: 'assistance' },
    { label: 'Franchise réduite', value: 'franchise-reduite' },
    { label: 'Garantie étendue', value: 'garantie-etendue' },
  ];

  private readonly valeurs = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  readonly prime = computed(() => {
    const v = this.valeurs();

    if (v.typeDeContrat == null || v.ageClient == null) {
      return 0;
    }

    const devis: Devis = {
      id: 0,
      clientId: v.clientId ?? 0,
      typeDeContrat: v.typeDeContrat,
      ageClient: v.ageClient,
      optionsChoisies: v.optionsChoisies ?? [],
    };
    return calculerPrimeDevis(devis);
  });

  readonly primeAffichee = computed(() => this.prime().toFixed(2));

  // Stub visuel : la vraie logique de soumission (form.getRawValue(),
  // genererReference(), appel à ContratService) reste l'objet du « temps 4 ».
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Formulaire valide — soumission à implémenter (temps 4).');
  }
}
