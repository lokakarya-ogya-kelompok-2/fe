import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      const jwtPayload = jwtDecode(token);
      if (jwtPayload.exp! > Date.now() / 1000) {
        return true;
      }
      this.tokenService.removeToken();
      this.isAuthenticatedSubject.next(false);
    }
    return false;
  }

  login(token: string) {
    this.tokenService.setToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    this.tokenService.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
    // then(() => window.location.reload());
  }
}
