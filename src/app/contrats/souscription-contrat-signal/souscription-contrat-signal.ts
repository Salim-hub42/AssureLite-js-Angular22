import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ContratService } from '../../services/contrat-service';
import { Router } from '@angular/router';
import { TypeContrat } from '../../models/contrat.model';

interface SouscriptionModel {
  clientId: number | null;
  typeDeContrat: TypeContrat | null;
  ageClient: number | null;
  optionsChoisies: string[];
}

@Component({
  selector: 'app-souscription-contrat-signal',
  imports: [FormRoot, FormField],
  templateUrl: './souscription-contrat-signal.html',
  styleUrl: './souscription-contrat-signal.scss',
})

export class SouscriptionContratSignal {
  
  private readonly contratService = inject(ContratService);
  private readonly router = inject(Router);


  readonly model = signal<SouscriptionModel>({
    clientId: null,
    optionsChoisies: [],
    typeDeContrat: null,
    ageClient: null 
  })







}
