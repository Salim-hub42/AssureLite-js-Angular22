import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormRoot, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);

  readonly model = signal<LoginModel>({
    email: '',
    password: '',
  });

  readonly formLogin = form(
    this.model,
    (path) => {
      required(path.email, { message: "L'email est requis." });
      email(path.email, { message: "Format d'email invalide." });
      required(path.password, { message: "Le mot de passe est requis." });
    },
    {
      submission: {
        action: async () => {
          console.log('login déclenché', this.model().email); // sera async quand on appellera AuthService 
        },
      },
    },
  );

}
