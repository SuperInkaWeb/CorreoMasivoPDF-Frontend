import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';

@Component({
  selector: 'app-linkcorreos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './linkcorreos.html',
  styleUrl: './linkcorreos.css',
})
export class Linkcorreos {
  public auth = inject(AuthService);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:8000/api';

  vincularProveedor(proveedor: 'gmail' | 'outlook'): void {
    // 1. Nos suscribimos al usuario de Auth0 para obtener su ID (sub)
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      if (user?.sub) {
        // Codificamos el ID por si tiene caracteres especiales como '|'
        const userId = encodeURIComponent(user.sub);

        // 2. Redirigimos al backend CON el parámetro ?user_id=
        if (proveedor === 'gmail') {
          window.location.href = `${this.API_URL}/auth/gmail/login?user_id=${userId}`;
        } else if (proveedor === 'outlook') {
          window.location.href = `${this.API_URL}/auth/outlook/login?user_id=${userId}`;
        }
      } else {
        console.error('No se pudo obtener el ID del usuario en Auth0');
      }
    });
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}