import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, max, min, required, validate  } from '@angular/forms/signals';
import { ContratService } from '../../services/contrat-service';
import { Router } from '@angular/router';
import { TypeContrat } from '../../models/contrat.model';
import { form } from '@angular/forms/signals';
import { Devis } from '../../models/devis.model';
import { calculerPrimeDevis } from '../../models/devis.utils';

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
    typeDeContrat: null,
    ageClient: null,
    optionsChoisies: [], 
  });

  readonly formSouscription = form(this.model,(path) =>{
      required(path.clientId, { message: 'Le n° client est requis'});
      validate(path.clientId, ({value}) => 
      value() != null && !Number.isInteger(value())
      ? {kind: 'entier', message: 'Le n° client doit etre entier .'} : null);
      required(path.typeDeContrat, { message: 'Le type de contrat est requis'});
      required(path.ageClient, {message: " L'age est requis"});
      min(path.ageClient , 18 , { message: 'Age minimum : 18 ans'});
      max(path.ageClient , 99 , { message: 'Age maximum : 99 ans'});
  });

  readonly prime = computed(() => {
     const m = this.model(); // on récupère le form

     if (m.typeDeContrat == null || m.ageClient == null) { // on vérifie avant le calcule
      return 0;
     }

     const devis: Devis = {
    id: 0,
    clientId: m.clientId ?? 0,                 
    typeDeContrat: m.typeDeContrat,
    ageClient: m.ageClient,
    optionsChoisies: m.optionsChoisies,         
    };

      return calculerPrimeDevis(devis);
  });

  readonly primeAffichee = computed(() => this.prime().toFixed(2));







}
