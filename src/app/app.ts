import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { DevisService } from './services/devis-service';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly devisService = inject(DevisService);
  private readonly router = inject(Router);
  
  readonly estConnecte = this.authService.estConnecte;
  


 deconnecter(): void{
  this.authService.logout();
  this.devisService.reinitialiserCache();
  this.router.navigate(['/login']);
 }




}
