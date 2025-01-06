import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { TokenService } from '../../../../../core/services/token.service';
import { User } from '../../../../users/models/user';
import { UserService } from '../../../../users/services/user.service';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CardModule, MenubarModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss',
})
export class UserInformationComponent implements OnInit {
  @Input() year: number = new Date().getFullYear();
  currentUser: User = {} as User;

  constructor(
    private tokenService: TokenService,
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
