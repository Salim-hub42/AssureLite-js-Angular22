import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, max, min, required, validate , submit  } from '@angular/forms/signals';
import { ContratService } from '../../services/contrat-service';
import { Router } from '@angular/router';
import { TypeContrat } from '../../models/contrat.model';
import { form } from '@angular/forms/signals';
import { Devis } from '../../models/devis.model';
import { calculerPrimeDevis } from '../../models/devis.utils';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';

interface SouscriptionModel {
  clientId: number | null;
  typeDeContrat: TypeContrat | '';
  ageClient: number | null;
  optionsChoisies: string[];
}

@Component({
  selector: 'app-souscription-contrat-signal',
  imports: [FormRoot, FormField ,Card, ButtonModule, Divider, InputText,],
  templateUrl: './souscription-contrat-signal.html',
  styleUrl: './souscription-contrat-signal.scss',
})

export class SouscriptionContratSignal {
  
  private readonly contratService = inject(ContratService);
  private readonly router = inject(Router);


  readonly model = signal<SouscriptionModel>({
    clientId: null,
    typeDeContrat: '',
    ageClient: null,
    optionsChoisies: [], 
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


  readonly formSouscription = form(this.model,(path) =>{
      required(path.clientId, { message: 'Le n° client est requis'});
      validate(path.clientId, ({value}) => 
      value() != null && !Number.isInteger(value())
      ? {kind: 'entier', message: 'Le n° client doit etre entier .'} : null);
      required(path.typeDeContrat, { message: 'Le type de contrat est requis'});
      required(path.ageClient, {message: " L'age est requis"});
      min(path.ageClient , 18 , { message: 'Age minimum : 18 ans'});
      max(path.ageClient , 99 , { message: 'Age maximum : 99 ans'});
      validate(path.optionsChoisies, ({value}) => value().length === 0
       ? {kind: 'aucuneOption', message: 'Choisir une options.'} : null)
  });

  estOptionCochee(valeur: string): boolean {
   return this.formSouscription.optionsChoisies().value().includes(valeur);
  }
  
  basculerOption(valeur: string, event: Event): void{
    const estCocher = (event.target as HTMLInputElement).checked;

    this.formSouscription.optionsChoisies().value.update((liste) => {
      if (estCocher){
        return [...liste,valeur];
      }else {
        return liste.filter((v) => v !== valeur);
      }
    });
    this.formSouscription.optionsChoisies().markAsTouched();
  }

  




  readonly prime = computed(() => {
     const m = this.model(); // on récupère le form

     if (!m.typeDeContrat  || m.ageClient == null) { // on vérifie avant le calcule
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


async onSubmit(event: Event): Promise<void> {
  event.preventDefault();              

  await submit(this.formSouscription, async (f) => {
    const v = f().value();   // { clientId, typeDeContrat, ageClient, optionsChoisies }

    // submit() ne lance ceci que si tout est valide, mais TS ne le sait pas
    // → on rétrécit les types (null / '') avant d'appeler le service
    if (v.clientId == null || v.ageClient == null || !v.typeDeContrat) {
      return undefined;
    }

    this.contratService.souscrireContrat({
      clientId: v.clientId,
      type: v.typeDeContrat,            
      ageClient: v.ageClient,
      optionsChoisies: v.optionsChoisies,
    });

    this.router.navigate(['/contrats']);
   
  });
}



}
