import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // Estado de la sesión del usuario
  public isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  /**
   * Alterna el estado de inicio de sesión de la plataforma.
   * Si inicia sesión, te puede redirigir automáticamente a la trazabilidad.
   */
  public toggleLogin(): void {
    this.isLoggedIn = !this.isLoggedIn;
    
    if (this.isLoggedIn) {
      // Redirección automática al entrar
      this.router.navigate(['/trazabilidad']);
    } else {
      // Regresa al inicio al salir
      this.router.navigate(['/']);
    }
  }
}
