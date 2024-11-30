import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    SplitterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: LoginRequest = {} as LoginRequest;
  private router = inject(Router);
  constructor(
    private readonly loginSvc: LoginService,
    private readonly authSvc: AuthService
  ) {}

  onSubmit() {
    this.loginSvc.login(this.loginData).subscribe({
      next: (res) => {
        this.authSvc.login(res.content.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });
  }
}
