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
      },
      {
        label: 'Division',
        // icon: 'pi pi-home',
        routerLink: '/manage/divisions',
      },
      {
        label: 'Role-menu',
        // icon: 'pi pi-home',
      },
      {
        label: 'Attitudes',
        // icon: 'pi pi-home',
        items: [
          {
            label: 'Group Attitude skill',
            // icon: 'pi pi-home',
            routerLink: '/manage/group-attitude-skills',
          },
          {
            label: 'Attitude skill',
            routerLink: '/manage/attitude-skills',
            // icon: 'pi pi-home',
          },
        ],
      },
      {
        label: 'Technical skills',
        // icon: 'pi pi-home',
        items: [
          {
            label: 'Group technical skill',
            // icon: 'pi pi-home',
          },
          {
            label: 'Technical skill',
            // icon: 'pi pi-home',
          },
        ],
      },
      {
        label: 'Dev-plan',
        // icon: 'pi pi-star',
      },
      {
        label: 'Achievements',
        // icon: 'pi pi-search',
        items: [
          {
            label: 'Group achievement',
            // icon: 'pi pi-bolt',
          },
          {
            label: 'Achievement',
            // icon: 'pi pi-server',
          },
          {
            label: 'Emp achievement',
            // icon: 'pi pi-pencil',
          },
        ],
      },
      {
        label: 'Summary',
        // icon: 'pi pi-envelope',
      },
    ];
  }
}
