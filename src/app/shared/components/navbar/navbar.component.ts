import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'User',
        // icon: 'pi pi-home',
        // style: { padding: '0.5rem 0,5rem' },
        routerLink: '/manage/',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Division',
        // icon: 'pi pi-home',
        routerLink: 'divisions',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Role-menu',
        // icon: 'pi pi-home',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Attitudes',
        // icon: 'pi pi-home',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group Attitude skill',
            // icon: 'pi pi-home',
            routerLink: '/manage/group-attitude-skills',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Attitude skill',
            routerLink: '/manage/attitude-skills',
            // icon: 'pi pi-home',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Technical skills',
        // icon: 'pi pi-home',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group technical skill',
            // icon: 'pi pi-home',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Technical skill',
            // icon: 'pi pi-home',
            routerLink: '/manage/technical-skills',
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Dev-plan',
        // icon: 'pi pi-star',
        routerLink: '/manage/dev-plans',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Achievements',
        // icon: 'pi pi-search',
        style: { 'z-index': 3 },
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group achievement',
            // icon: 'pi pi-bolt',
            routerLink: '/manage/group-achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Achievement',
            // icon: 'pi pi-server',
            routerLink: '/manage/achievements',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Emp achievement',
            // icon: 'pi pi-pencil',
            routerLink: ['/manage/emp-achievements'],
            routerLinkActiveOptions: { exact: true },
          },
        ],
      },
      {
        label: 'Summary',
        // icon: 'pi pi-envelope',
        routerLink: '/manage/summaries',
        routerLinkActiveOptions: { exact: true },
      },
    ];
  }
}
