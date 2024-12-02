import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { Menu } from '../../../menus/models/menu';
import { MenuService } from '../../../menus/services/menu.service';
import { Role } from '../../../roles/models/role';
import { RoleService } from '../../../roles/services/role.service';
import { RoleMenuService } from '../../services/role-menu.service';

@Component({
  selector: 'app-role-menu',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    TableModule,
  ],
  templateUrl: './role-menu.component.html',
  styleUrl: './role-menu.component.scss',
})
export class RoleMenuComponent implements OnInit {
  roles: Role[] = [];

  menus: Menu[] = [];

  roleMenus: { [key: string]: Menu[] } = {};

  menuToReadable: { [key: string]: string } = {
    'user#all': 'Manage All Users',
    'user#read': 'View Users',
    'division#all': 'Manage Divisions',
    'role-menu#all': 'Manage Role Menu Access',
    'group-attitude-skill#all': 'Manage Group Attitude Skills',
    'attitude-skill#all': 'Manage Attitude Skills',
    'technical-skill#all': 'Manage Technical Skills',
    'dev-plan#all': 'Manage Development Plans',
    'group-achievement#all': 'Manage Group Achievements',
    'achievement#all': 'Manage Achievements',
    'summary#read': 'View All Summaries',
    'summary#read.self': 'View Own Summary',
    'emp-achievement#all': 'Manage Employee Achievements',
    'emp-attitude-skill#all': 'Manage Employee Attitude Skills',
    'emp-technical-skill#all': 'Manage Employee Technical Skills',
    'emp-dev-plan#all': 'Manage Employee Development Plans',
    'emp-suggestion#all': 'Manage Employee Suggestions',
  };

  constructor(
    private readonly roleService: RoleService,
    private readonly menuService: MenuService,
    private readonly roleMenuService: RoleMenuService
  ) {}

  ngOnInit(): void {
    this.roleService.list().subscribe({
      next: (data) => {
        this.roles = data.content;
        this.roles.forEach((role) => {
          this.roleMenus[role.id] = role.menus!;
        });
      },
    });

    this.menuService.list().subscribe({
      next: (data) => {
        this.menus = data.content;
      },
    });
  }

  onSubmit() {
    let selectedMenusForEachRoles: Map<string, string[]> = new Map();
    Object.entries(this.roleMenus).forEach(([roleId, menus]) => {
      selectedMenusForEachRoles.set(
        roleId,
        menus.map((menu) => menu.id)
      );
    });
    // console.log(selectedMenusForEachRoles);
    this.roleMenuService.update(selectedMenusForEachRoles).subscribe({
      next: (data) => {
        console.log(data.message);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
