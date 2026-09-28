import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { montantValide } from '../../validators/montant-valide.validator';
import { Router, RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SinistreService } from '../../services/sinistre-service';

@Component({
  selector: 'app-declaration-sinistre',
  imports: [ReactiveFormsModule, RouterLink, Card, InputText, ButtonModule],
  templateUrl: './declaration-sinistre.html',
  styleUrl: './declaration-sinistre.scss',
})
export class DeclarationSinistre {
  private readonly sinistreService = inject(SinistreService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    contratId: new FormControl<number | null>(null, [Validators.required]),
    montant: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, montantValide()],
    }),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { contratId, montant } = this.form.getRawValue();
    if (contratId === null) {
      return;
    }
    this.sinistreService
      .declarer(contratId, montant)
      .then((sinistre) => {
        console.log('Sinistre déclaré', sinistre);
        this.router.navigate(['/sinistres']);
      })
      .catch((erreur) => {
        console.error('Erreur lors de la déclaration du sinistre', erreur);
      });
  }
}
