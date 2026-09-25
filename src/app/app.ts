import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { DevisService } from './services/devis-service';
import { MasquerEmailPipe } from './pipes/masquer-email-pipe';
import { ButtonModule } from 'primeng/button';
import { NotificationService } from './services/notification-service';

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
  private readonly notificationService = inject(NotificationService);

  readonly session = this.authService.session;
  readonly notification = this.notificationService.courante;
  // Nombre de notifications qui attendent derrière celle affichée
  readonly enAttente = computed(() => Math.max(this.notificationService.file().length - 1, 0));

  fermerNotification(): void {
    this.notificationService.fermer();
  }

  deconnecter(): void {
    this.authService.logout();
    this.devisService.reinitialiserCache();
    this.router.navigate(['/login']);
  }
}
