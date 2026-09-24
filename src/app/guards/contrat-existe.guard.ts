import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API } from '../core/api';

export const contratExisteGuard: CanActivateFn = (route) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const id = parseInt(route.paramMap.get('id') ?? '', 10);
  if (Number.isNaN(id)) {
    return router.parseUrl('/contrats');
  }

  // Angular attend la fin de cette promesse avant d'afficher la page
  return firstValueFrom(http.get(`${API}/contrats/${id}`))
    .then(() => true) // 200 : le contrat existe
    .catch(() => router.parseUrl('/contrats')); // 404 : il n'existe pas
};
