import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ageMinimum } from '../../validators/age-minimum.validator';
import { TypeContrat } from '../../models/contrat.model';

@Component({
  selector: 'app-souscription-contrat',
  imports: [],
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
    optionsChoisies: new FormControl<string[]>([], Validators.required),
  });
}
