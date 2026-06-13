import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLoggedIn = signal(false);

  public toggleLogin(): void {
    this.isLoggedIn.set(!this.isLoggedIn());
  }
}