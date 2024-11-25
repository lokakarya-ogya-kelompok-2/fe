import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DividerModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: LoginRequest = {} as LoginRequest;

  constructor(
    private readonly loginSvc: LoginService,
    private readonly authSvc: AuthService,
    private readonly router: Router
  ) {}

  onSubmit() {
    this.loginSvc.login(this.loginData).subscribe({
      next: (res) => {
        this.authSvc.setToken(res.content.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('ADA ERROR', err);
      },
    });
  }
}
