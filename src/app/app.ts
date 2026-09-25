import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { DevisService } from './services/devis-service';
import { MasquerEmailPipe } from './pipes/masquer-email-pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MasquerEmailPipe, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly devisService = inject(DevisService);
  private readonly router = inject(Router);

  readonly session = this.authService.session;

  deconnecter(): void {
    this.authService.logout();
    this.devisService.reinitialiserCache();
    this.router.navigate(['/login']);
  }
}
