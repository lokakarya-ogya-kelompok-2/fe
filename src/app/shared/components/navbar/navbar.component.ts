import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { MenuService } from '../../../features/menus/services/menu.service';
import { UserService } from '../../../features/users/services/user.service';
import { TokenPayload } from '../../types';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  tokenPayload: TokenPayload | undefined = {} as TokenPayload;
  menu: Set<string> = new Set();

  constructor(
    readonly authService: AuthService,
    private tokenService: TokenService,
    private readonly userSvc: UserService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.getToken();
    this.getMenuById();

    this.items = [
      {
        id: 'user#all',
        label: 'User',
        routerLink: '/manage-users',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'division#all',
        label: 'Division',
        routerLink: '/manage-divisions',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'role-menu#all',
        label: 'Role Menu',
        routerLink: '/manage-role-menu',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'attitude-skill',
        label: 'Attitudes',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            id: 'group-attitude-skill#all',
            label: 'Group Attitude kill',
            routerLink: '/manage-group-attitude-skills',
            routerLinkActiveOptions: { exact: true },
          },
          {
            id: 'attitude-skill#all',
            label: 'Attitude skill',
            routerLink: '/manage-attitude-skills',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        id: 'technical-skill#all',
        label: 'Technical skill',
        routerLink: '/manage-technical-skills',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'dev-plan#all',
        label: 'Dev-plan',
        routerLink: '/manage-dev-plans',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'achievement',
        label: 'Achievements',
        style: { 'z-index': 3 },
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            id: 'group-achievement#all',
            label: 'Group achievement',
            routerLink: '/manage-group-achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            id: 'achievement#all',
            label: 'Achievement',
            routerLink: '/manage-achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            id: 'emp-achievement#all',
            label: 'Emp achievement',
            routerLink: ['/manage-emp-achievements'],
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        id: 'summary#read',
        label: 'Summary',
        routerLink: '/manage-summaries',
        routerLinkActiveOptions: { exact: true },
      },
    ];
  }

  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.tokenPayload = this.tokenService.decodeToken(token);
      console.log(this.tokenPayload, 'ini token payload');
    }
  }
  getMenuById(): void {
    this.menuService.getMenuByUserId(this.tokenPayload?.sub!).subscribe({
      next: (data) => {
        data.content.map((menu) => {
          this.menu.add(menu.menu_name);
          this.menu.add(menu.menu_name.split('#')[0]);
        });
        this.items = this.items?.filter((item) => {
          if (item.items) {
            item.items = item.items.filter((subItem) => {
              return this.menu.has(subItem.id!);
            });
          }
          // for (const menu of this.menu) {
          //   if (menu.includes(item.id!)) {
          //     return true;
          //   }
          // }
          // return false;
          return this.menu.has(item.id!);
        });
        console.log(this.menu);
        console.log(this.items);
      },
    });
  }
}
