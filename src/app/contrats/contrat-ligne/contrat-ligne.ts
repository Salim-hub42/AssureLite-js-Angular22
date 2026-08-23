import { Component, input, output } from '@angular/core';
import { Contrat } from '../../models/contrat.model';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'tr[app-contrat-ligne]',
  imports: [ButtonModule, Tag],
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
