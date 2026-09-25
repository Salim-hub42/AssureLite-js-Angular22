import { Component, computed, effect, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { ContratService } from '../../services/contrat-service';
import { httpResource } from '@angular/common/http';
import { ContratDTO } from '../../models/contrat.model';
import { API } from '../../core/api';
import { versContrat } from '../../models/contrat.utils';
import { Historique } from '../../services/historique';

@Component({
  selector: 'app-contrat-detail',
  imports: [ RouterLink, ButtonModule, Card, Tag, Breadcrumb, Divider, Message, CurrencyPipe, TitleCasePipe, DatePipe],
  templateUrl: './contrat-detail.html',
  styleUrl: './contrat-detail.scss',
})
export class ContratDetail {
  contratService = inject(ContratService);
  private readonly historiqueService = inject(Historique);
  
 


  id = input.required<string>();

  constructor() {
  effect(() => {
    this.historiqueService.enregistrer(parseInt(this.id(), 10));
  });
}

  private readonly _contratRes =  httpResource<ContratDTO>(() => `${API}/contrats/${this.id()}`);

  contrat = computed(() => {
    return this._contratRes.hasValue() ? versContrat(this._contratRes.value()) : undefined;
  });

  enChargement = computed(() => this._contratRes.isLoading());

  breadcrumbItems: MenuItem[] = [
    { label: 'Contrats', routerLink: '/contrats' },
    { label: 'Détail du contrat' },
  ];






}
