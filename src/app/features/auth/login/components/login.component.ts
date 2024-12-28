import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../models/login';
import { PhotoService } from '../services/photoService';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    SplitterModule,
    GalleriaModule,
    ImageModule,
    PasswordModule,
  ],
  providers: [PhotoService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: LoginRequest = {} as LoginRequest;
  // hidePassword: boolean = true;
  private router = inject(Router);
  value!: string;
  constructor(
    private readonly loginSvc: LoginService,
    private readonly authSvc: AuthService
  ) {}

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  onSubmit() {
    this.loginSvc.login(this.loginData).subscribe({
      next: (res) => {
        this.authSvc.login(res.content.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error logging in: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login failed! Your email/username or password maybe wrong, Please try again.',
        });
      },
    });
  }

  // togglePassword() {
  //   this.hidePassword = !this.hidePassword;
  // }
}
