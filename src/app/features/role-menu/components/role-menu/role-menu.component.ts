import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

interface Role {
  id: number;
  role_name: string;
}
interface Menu {
  id: number;
  menu_name: string;
}

@Component({
  selector: 'app-role-menu',
  standalone: true,
  imports: [CheckboxModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './role-menu.component.html',
  styleUrl: './role-menu.component.scss',
})
export class RoleMenuComponent {
  roles: Role[] = [
    {
      id: 1,
      role_name: 'HR',
    },
    {
      id: 2,
      role_name: 'MGR',
    },
    {
      id: 3,
      role_name: 'SVP',
    },
    {
      id: 4,
      role_name: 'USER',
    },
  ];

  menus: Menu[] = [
    {
      id: 1,
      menu_name: 'users',
    },
    {
      id: 2,
      menu_name: 'divisions',
    },
    {
      id: 3,
      menu_name: 'attitude_skills',
    },
    {
      id: 4,
      menu_name: 'achievements',
    },
    {
      id: 5,
      menu_name: 'users_read',
    },
    {
      id: 6,
      menu_name: 'role_menu',
    },
  ];

  roleMenus: { [key: string]: Menu[] } = {
    HR: [this.menus[0], this.menus[2]],
    MGR: [],
    SVP: [],
    USER: [],
  };

  onSubmit() {
    console.log('SELECTED MENU FOR EACH ROLE: ');
    console.log(this.roleMenus);
    console.log('SELECTED MENU FOR EACH ROLE: ');
  }
}
