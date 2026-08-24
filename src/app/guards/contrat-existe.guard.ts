import { CanActivateFn, Router } from '@angular/router';
import { ContratService } from '../services/contrat-service';
import { inject } from '@angular/core';

export const contratExisteGuard: CanActivateFn = (route) => {
  const contratService = inject(ContratService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  const control = contratService.contrats().some((contrat) => contrat.id === id);
  return control ? true : router.parseUrl('/contrats')

};
