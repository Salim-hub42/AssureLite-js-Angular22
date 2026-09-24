import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AuthService } from '../../services/auth-service';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormRoot, FormField, Card, ButtonModule, InputText],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly model = signal<LoginModel>({
    email: '',
    password: '',
  });

  readonly formLogin = form(
    this.model,
    (path) => {
      required(path.email, { message: "L'email est requis." });
      email(path.email, { message: "Format d'email invalide." });
      required(path.password, { message: 'Le mot de passe est requis.' });
    },
    {
      submission: {
        action: async (f) => {
          try {
            await this.auth.login(this.model().email, this.model().password);
            this.router.navigate(['/contrats']);
            return;
          } catch {
            return [{ fieldTree: f.password, kind: 'auth', message: 'Identifiants invalides.' }];
          }
        },
      },
    },
  );
}
