import { Component, computed, signal } from '@angular/core';
import { CONTRATS_MOCKS } from '../../data/mock-data';
import { Contrat } from '../../models/contrat.model';
import { Table } from 'primeng/table';
import { primeTotal } from '../../models/contrat.utils';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-liste-contrats',
  imports: [Table, ButtonModule],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.scss',
})
export class ListeContrats {
  contrats = signal<Contrat[]>(CONTRATS_MOCKS);
  primeTotale = computed(() => primeTotal(this.contrats()));

 ajouterContrat(){
   this.contrats.update((listes) => {
    const copie = [...listes];
    copie.push({id: copie.length + 1, clientId: 1, type: 'auto', statut: 'actif', prime: 75, dateDebut: new Date()});
    return copie
   })
 }











}

