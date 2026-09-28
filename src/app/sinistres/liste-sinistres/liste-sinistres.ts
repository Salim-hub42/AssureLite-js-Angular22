import { Component, computed, inject } from '@angular/core';
import { SinistreService } from '../../services/sinistre-service';
import { Card } from 'primeng/card';
import { Table } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ContratService } from '../../services/contrat-service';
import { primeTotal } from '../../models/contrat.utils';
import { StatsSinistres } from '../stats-sinistres/stats-sinistres';

@Component({
  selector: 'app-liste-sinistres',
  imports: [Card, Table, DatePipe, CurrencyPipe, Tag, RouterLink, ButtonModule, StatsSinistres],
  templateUrl: './liste-sinistres.html',
  styleUrl: './liste-sinistres.scss',
})
export class ListeSinistres {
  private readonly sinistreService = inject(SinistreService);
  private readonly contratService = inject(ContratService);

  readonly sinistres = this.sinistreService.sinistres;

  readonly primeTotales = computed(() => primeTotal(this.contratService.contrats()));
}
