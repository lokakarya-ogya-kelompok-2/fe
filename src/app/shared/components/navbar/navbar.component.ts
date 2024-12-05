import { Component, Input, OnInit } from '@angular/core';
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
  @Input() includeUserAction: boolean = true;
  items: MenuItem[] | undefined;
  tokenPayload: TokenPayload = {} as TokenPayload;
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
        label: 'Menu Access',
        routerLink: '/manage-role-menu',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'attitude-skill',
        label: 'Attitude Skills',
        style: { 'z-index': 3 },
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
          {
            id: 'emp-attitude-skill#all',
            label: 'Employee Attitude Skill',
            routerLink: '/emp-attitude-skills',
          },
        ],
      },
      {
        id: 'technical-skill',
        label: 'Technical Skills',
        style: { 'z-index': 3 },
        items: [
          {
            id: 'technical-skill#all',
            label: 'Manage Technical Skills',
            routerLink: '/manage-technical-skills',
            routerLinkActiveOptions: { exact: true },
          },
          {
            id: 'emp-technical-skill#all',
            label: 'Employee Technical Skills',
            routerLink: '/emp-technical-skill',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        id: 'dev-plan',
        label: 'Development Plans',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            id: 'dev-plan#all',
            label: 'Manage Dev Plan',
            routerLink: '/manage-dev-plans',
          },
          {
            id: 'emp-dev-plan#all',
            label: 'Employee Dev Plan',
            routerLink: '/emp-dev-plans',
          },
        ],
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
        id: 'summary',
        label: 'Summary',
        style: { 'z-index': 3 },
        items: [
          {
            id: 'summary#read',
            label: 'Read Summaries',
            routerLink: '/manage-summaries',
            routerLinkActiveOptions: { exact: true },
          },
          {
            id: 'summary#read.self',
            label: 'My Summary',
            routerLink: '/my-summaries',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        id: 'emp-suggestion#all',
        label: 'Suggestion',
        routerLink: '/emp-suggestions',
      },
      // {
      //   label: 'Logout',
      //   icon: 'pi pi-sign-out',
      //   routerLink: '/login',
      //   style: { 'margin-left': '40px', color: 'red' },
      // },
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
          if (menu.menu_name.startsWith('emp-')) {
            const empRemoved = menu.menu_name.slice(4);
            this.menu.add(empRemoved.split('#')[0]);
          }
          this.menu.add(menu.menu_name);
          this.menu.add(menu.menu_name.split('#')[0]);
        });
        this.items = this.items?.filter((item) => {
          if (item.items) {
            item.items = item.items.filter((subItem) => {
              return this.menu.has(subItem.id!);
            });
          }
          return this.menu.has(item.id!);
        });
        console.log(this.menu, 'USER MENUS');
        console.log(this.items, 'NAVBAR MENUS');
      },
    });
  }

  getInitial = (fullName: string, n: number): string =>
    fullName
      .split(' ')
      .map((w) => w.slice(0, 1))
      .slice(0, n)
      .join('');
}
