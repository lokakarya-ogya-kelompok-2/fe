import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../core/services/auth.service';
import { TokenService } from '../../../../../core/services/token.service';
import { User } from '../../../../users/models/user';
import { UserService } from '../../../../users/services/user.service';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CardModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss',
})
export class UserInformationComponent implements OnInit {
  currentUser: User = {} as User;
  currentYear: number = new Date().getFullYear();

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const jwtPayload = this.tokenService.decodeToken(
      this.tokenService.getToken()!
    );
    this.userService.getById(jwtPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
      },
    });
  }
}
