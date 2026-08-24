import { Component, computed, inject, input } from '@angular/core';
import { ContratService } from '../../services/contrat-service';

@Component({
  selector: 'app-contrat-detail',
  imports: [],
  templateUrl: './contrat-detail.html',
  styleUrl: './contrat-detail.scss',
})
export class ContratDetail {
  contratService = inject(ContratService);
  
  id = input.required<string>();

  contrats = this.contratService.contrats;

  recherche = computed(() => {
    const idNumber = Number(this.id());
    return this.contrats().find((contrat) => contrat.id === idNumber)
  });






}
