import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { UserService } from '../../../features/users/services/user.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  username: string | undefined = '';

  constructor(
    readonly authService: AuthService,
    private tokenService: TokenService,
    private readonly userSvc: UserService
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'User',
        routerLink: '/manage/',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Division',
        routerLink: 'divisions',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Role Menu',
        routerLink: '/manage/role-menu',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Attitudes',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group Attitude kill',
            routerLink: '/manage/group-attitude-skills',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Attitude skill',
            routerLink: '/manage/attitude-skills',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Technical skill',
        routerLink: '/manage/technical-skills',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Dev-plan',
        routerLink: '/manage/dev-plans',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Achievements',
        style: { 'z-index': 3 },
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group achievement',
            routerLink: '/manage/group-achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Achievement',
            routerLink: '/manage/achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Emp achievement',
            routerLink: ['/manage/emp-achievements'],
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Summary',
        routerLink: '/manage/summaries',
        routerLinkActiveOptions: { exact: true },
      },
    ];
    this.getToken();
  }

  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      const jwtPayload = this.tokenService.decodeToken(token);
      this.username = jwtPayload.username;
      console.log(this.username, 'ini username');
    }
  }
}
