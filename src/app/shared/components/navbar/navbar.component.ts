import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  constructor(readonly authService: AuthService) {}

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
        label: 'Technical skills',
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: 'Group technical skill',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Technical skill',
            routerLink: '/manage/technical-skills',
            routerLinkActiveOptions: { exact: true },
          },
        ],
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
  }
}
