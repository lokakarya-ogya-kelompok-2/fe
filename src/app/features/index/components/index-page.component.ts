import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  username: any = '';
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getToken();
  }
  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      const jwtPayload = this.tokenService.decodeToken(token);
      this.username = jwtPayload.sub;
      console.log(this.username, 'ini username');
    }
  }
}
