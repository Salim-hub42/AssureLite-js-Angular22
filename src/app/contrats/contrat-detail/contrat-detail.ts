import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { ContratService } from '../../services/contrat-service';

@Component({
  selector: 'app-contrat-detail',
  imports: [DatePipe, RouterLink, ButtonModule, Card, Tag, Breadcrumb, Divider, Message],
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

  breadcrumbItems: MenuItem[] = [
    { label: 'Contrats', routerLink: '/contrats' },
    { label: 'Détail du contrat' },
  ];






}
