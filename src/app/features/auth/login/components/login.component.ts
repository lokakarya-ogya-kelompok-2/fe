import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
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
  ],
  providers: [PhotoService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {} as LoginRequest;
  images: any[] | undefined;
  private router = inject(Router);
  constructor(
    private readonly loginSvc: LoginService,
    private readonly authSvc: AuthService,
    private photoService: PhotoService
  ) {}

  ngOnInit() {
    this.photoService.getImages().then((images) => {
      this.images = images;
      console.log(this.images);
    });
  }
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
        console.error('Login error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login failed! Your email/username or password maybe wrong, Please try again.',
        });
      },
    });
  }
}
