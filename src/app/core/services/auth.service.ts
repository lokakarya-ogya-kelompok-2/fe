import { Injectable } from '@angular/core';
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

  constructor(private readonly tokenService: TokenService) {
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      const jwtPayload = jwtDecode(token);
      return jwtPayload.exp! > Date.now() / 1000;
    }
    return false;
  }

  login(token: string) {
    this.tokenService.setToken(token);
  }

  logout() {
    this.tokenService.removeToken();
    this.isAuthenticatedSubject.next(false);
  }
}
