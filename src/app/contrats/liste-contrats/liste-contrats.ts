import { Component,inject } from '@angular/core';

import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ContratService } from '../../services/contrat-service';

@Component({
  selector: 'app-liste-contrats',
  imports: [Table, ButtonModule],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.scss',
})
export class ListeContrats {
     contratService = inject(ContratService);
     
     contrats = this.contratService.contrats;
     primeTotale = this.contratService.primeTotale;



     ajoutContrat(): void{
      this.contratService.ajouterContrat();
     }
     
     supprimerContrat(id: number): void{
      this.contratService.supprimerContrat(id);
     }
     
}
