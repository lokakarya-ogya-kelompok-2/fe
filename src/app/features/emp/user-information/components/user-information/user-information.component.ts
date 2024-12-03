import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../core/services/auth.service';
import { TokenService } from '../../../../../core/services/token.service';
import { UserService } from '../../../../users/services/user.service';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CardModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss',
})
export class UserInformationComponent implements OnInit {
  jwtPayload: any = {};
  userLogin: any = {};
  currentYear: number = new Date().getFullYear();

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.getUser();
  }

  getUser() {
    this.userService.list().subscribe({
      next: (data) => {
        console.log(data.content);
        this.userLogin = data.content.filter(
          (user) => user.id == this.jwtPayload.sub
        )[0];
        console.log(this.userLogin);
      },
    });
  }
  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.jwtPayload = this.tokenService.decodeToken(token);
    }
    console.log(this.jwtPayload);
  }
}
