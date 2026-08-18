import { Component, input, output } from '@angular/core';
import { Contrat } from '../../models/contrat.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tr[app-contrat-ligne]',
  imports: [ButtonModule],
  templateUrl: './contrat-ligne.html',
  styleUrl: './contrat-ligne.scss',
})
export class ContratLigne {
  contrat = input.required<Contrat>();
  supprimer = output<number>();

  supLigne(): void{
     this.supprimer.emit(this.contrat().id);
  }
}
