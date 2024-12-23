import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { MenuService } from '../../../features/menus/services/menu.service';
import { User } from '../../../features/users/models/user';
import { UserService } from '../../../features/users/services/user.service';
import { TokenPayload } from '../../types';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, AvatarModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() includeUserAction: boolean = true;
  items: MenuItem[] = [
    {
      id: 'user',
      label: 'Users',
      style: { 'z-index': 3, appendTo: 'body' },
      items: [
        {
          id: 'user#all',
          label: 'Manage User',
          routerLink: '/manage-users',
        },
        {
          id: 'user#read',
          label: 'List User',
          routerLink: '/users',
        },
      ],
    },
    {
      id: 'division#all',
      label: 'Division',
      routerLink: '/manage-divisions',
    },
    {
      id: 'role-menu#all',
      label: 'Menu Access',
      routerLink: '/manage-role-menu',
    },
    {
      id: 'attitude-skill',
      label: 'Attitude Skills',
      style: { 'z-index': 3 },
      items: [
        {
          id: 'group-attitude-skill#all',
          label: 'Group Attitude Skill',
          routerLink: '/manage-group-attitude-skills',
        },
        {
          id: 'attitude-skill#all',
          label: 'Attitude Skill',
          routerLink: '/manage-attitude-skills',
        },
      ],
    },
    {
      id: 'technical-skill',
      label: 'Technical Skills',
      style: { 'z-index': 3 },
      routerLinkActive: 'active-route',
      items: [
        {
          id: 'technical-skill#all',
          label: 'Manage Technical Skills',
          routerLink: '/manage-technical-skills',
        },
      ],
    },
    {
      id: 'dev-plan',
      label: 'Development Plans',
      items: [
        {
          id: 'dev-plan#all',
          label: 'Manage Dev Plan',
          routerLink: '/manage-dev-plans',
        },
      ],
    },
    {
      id: 'achievement',
      label: 'Achievements',
      style: { 'z-index': 3 },
      items: [
        {
          id: 'group-achievement#all',
          label: 'Group achievement',
          routerLink: '/manage-group-achievements',
        },
        {
          id: 'achievement#all',
          label: 'Achievement',
          routerLink: '/manage-achievements',
        },
        {
          id: 'emp-achievement#all',
          label: 'Employee Achievement',
          routerLink: ['/manage-emp-achievements'],
        },
      ],
    },
    { id: 'summary#read', label: 'Summaries', routerLink: '/summaries' },

    {
      id: 'employee-assessment',
      label: 'Assessment',
      style: { 'z-index': 3 },
      routerLinkActive: 'active-route',
      routerLink: '/employee-assessments',
    },
  ];
  tokenPayload: TokenPayload = {} as TokenPayload;
  menu: Set<string> = new Set();
  currentUser: User = {} as User;
  userInitial: string = '';

  constructor(
    readonly authService: AuthService,
    private tokenService: TokenService,
    private menuService: MenuService,
    private readonly userSvc: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getToken();
    this.getMenuById();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveStates();
      });
    this.updateActiveStates();
    this.userSvc.getById(this.tokenPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
        this.userInitial = this.getInitial(this.currentUser.full_name, 2);
      },
      error: (err) => {
        console.error('Failed to fetch current user: ', err);
      },
    });
  }

  updateActiveStates(): void {
    const currentUrl = this.router.url;
    this.items.forEach((item) => {
      if (item.items) {
        const isActive = item.items.some((subItem) =>
          currentUrl.includes(subItem.routerLink)
        );
        item['styleClass'] = isActive ? 'navbar-link-active' : '';
      } else {
        item['styleClass'] = currentUrl.includes(item.routerLink)
          ? 'navbar-link-active'
          : '';
      }
    });
  }

  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.tokenPayload = this.tokenService.decodeToken(token);
    }
  }
  getMenuById(): void {
    this.menuService.getMenuByUserId(this.tokenPayload?.sub!).subscribe({
      next: (data) => {
        const assessmentMenus = new Set([
          'emp-attitude-skill#all',
          'emp-technical-skill#all',
          'emp-dev-plan#all',
          'summary#read.self',
        ]);
        data.content.map((menu) => {
          if (assessmentMenus.has(menu.menu_name)) {
            this.menu.add('employee-assessment');
          }
          if (
            menu.menu_name.startsWith('emp-') &&
            !assessmentMenus.has(menu.menu_name)
          ) {
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
      },
      error: (err) => {
        console.error('Error fetching user menu: ', err);
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
