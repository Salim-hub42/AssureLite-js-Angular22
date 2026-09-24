import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthService).session(); // récupération de la session
  if(!session){ // si pas de session on s'arrete la .
      return next(req);
  }else{ 
    const intercept = req.clone({ setHeaders: {Authorization: `Bearer ${session.token}`}})
    return next(intercept);
  }
};
