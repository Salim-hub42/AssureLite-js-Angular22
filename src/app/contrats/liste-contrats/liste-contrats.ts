import { Component,computed,inject } from '@angular/core';

import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { ContratService } from '../../services/contrat-service';
import { ContratLigne } from '../contrat-ligne/contrat-ligne';
import { StatutContrat } from '../../models/contrat.model';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Surbrillance } from '../../directives/surbrillance';
import { Historique } from '../../services/historique';

@Component({
  selector: 'app-liste-contrats',
  imports: [Table, ButtonModule, Card, ContratLigne, RouterLink, CurrencyPipe, Surbrillance],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.scss',
})
export class ListeContrats {
     contratService = inject(ContratService);
     router = inject(Router);
      private readonly historiqueService = inject(Historique);

     
     contrats = this.contratService.contrats;
     primeTotale = this.contratService.primeTotale;
     contratsFiltres = this.contratService.contratsFiltres;
     statutsFiltres = this.contratService.statutsFiltres;

     consultesRecents = computed(() => this.historiqueService.consultes().slice(0,3));

     statuts: StatutContrat[] = ['actif', 'resilie', 'suspendu'];

     toggle(status: StatutContrat): void {
      this.contratService.toggle(status)
      console.log(status)
     }

     reinisialise(){
      this.contratService.reinitialiserFiltres()
     }


     supprimerContrat(id: number): void{
      this.contratService.supprimerContrat(id);
     }
     
}
