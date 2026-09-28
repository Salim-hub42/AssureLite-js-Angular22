import { Component, inject } from '@angular/core';
import { SinistreService } from '../../services/sinistre-service';
import { Card } from 'primeng/card';
import { Table } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-liste-sinistres',
  imports: [Card, Table, DatePipe, CurrencyPipe, Tag],
  templateUrl: './liste-sinistres.html',
  styleUrl: './liste-sinistres.scss',
})
export class ListeSinistres {
  private readonly sinistreService = inject(SinistreService);

  readonly sinistres = this.sinistreService.sinistres;
}
