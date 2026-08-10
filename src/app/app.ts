import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListeContrats } from './contrats/liste-contrats/liste-contrats';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListeContrats],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 
}
