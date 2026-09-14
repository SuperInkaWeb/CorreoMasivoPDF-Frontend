import { Component,inject,effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Automatizador } from '../../services/automatizador';

@Component({
  selector: 'app-panelcontrol',
  imports: [CommonModule],
  templateUrl: './panelcontrol.html',
  styleUrl: './panelcontrol.css',
})
export class Panelcontrol{
  public automatizador=inject(Automatizador);
  private router=inject(Router);

  constructor() {
    // Escucha en tiempo real si el usuario se autentica correctamente
    effect(() => {
      if (this.automatizador.isAuthenticated()) {
        this.router.navigate(['/linkcorreos']);
      }
    });
  }

  

  





}
