import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // ✅

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public authService = inject(AuthService); // ✅
  public isPlatformMenuOpen = false;

  constructor(private router: Router) {}

  public togglePlatformMenu(event: Event): void {
    event.preventDefault();
    this.isPlatformMenuOpen = !this.isPlatformMenuOpen;
  }

  public toggleLogin(): void {
    this.authService.toggleLogin();

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/trazabilidad']);
    } else {
      this.isPlatformMenuOpen = false;
      this.router.navigate(['/']);
    }
  }
}