import { Component, signal } from '@angular/core';
import { CONTRATS_MOCKS } from '../../data/mock-data';
import { Contrat } from '../../models/contrat.model';

@Component({
  selector: 'app-liste-contrats',
  imports: [],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.scss',
})
export class ListeContrats {

  contrats = signal<Contrat[]>(CONTRATS_MOCKS);
}
