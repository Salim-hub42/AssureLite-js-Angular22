import { Component, inject } from '@angular/core';
import { SinistreService } from '../../services/sinistre-service';
import { Card } from 'primeng/card';
import { Table } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-liste-sinistres',
  imports: [Card, Table, DatePipe, CurrencyPipe, Tag, RouterLink, ButtonModule],
  templateUrl: './liste-sinistres.html',
  styleUrl: './liste-sinistres.scss',
})
export class ListeSinistres {
  private readonly sinistreService = inject(SinistreService);

  readonly sinistres = this.sinistreService.sinistres;
}
