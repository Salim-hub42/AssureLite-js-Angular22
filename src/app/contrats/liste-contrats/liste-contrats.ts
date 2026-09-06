import { Component,inject } from '@angular/core';

import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { ContratService } from '../../services/contrat-service';
import { ContratLigne } from '../contrat-ligne/contrat-ligne';
import { StatutContrat } from '../../models/contrat.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-liste-contrats',
  imports: [Table, ButtonModule, Card, ContratLigne, RouterLink],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.scss',
})
export class ListeContrats {
     contratService = inject(ContratService);
     router = inject(Router);

     
     contrats = this.contratService.contrats;
     primeTotale = this.contratService.primeTotale;
     contratsFiltres = this.contratService.contratsFiltres;
     statutsFiltres = this.contratService.statutsFiltres;

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
