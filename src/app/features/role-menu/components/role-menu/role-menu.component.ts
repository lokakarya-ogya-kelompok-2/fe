import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
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
    NavbarComponent,
    ToastModule,
    MessageModule,
  ],
  templateUrl: './role-menu.component.html',
  styleUrl: './role-menu.component.scss',
  providers: [MessageService],
})
export class RoleMenuComponent implements OnInit {
  roles: Role[] = [];

  menus: Menu[] = [];

  isLoading: boolean = false;

  isFetching: boolean = true;

  roleMenus: { [key: string]: string[] } = {};

  private roleMenuAccessId: string = '';
  private suggestionMenuId: string = '';
  private selfSummaryMenuId: string = '';

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
    this.roleService
      .list({
        with_menus: true,
      })
      .subscribe({
        next: (data) => {
          this.roles = data.content;
          this.roles.forEach((role) => {
            this.roleMenus[role.id] = role.menus!.map((menu) => menu.id);
          });
          this.isFetching = false;
        },
      });

    this.menuService.list().subscribe({
      next: (data) => {
        this.menus = data.content;
        this.menus.forEach((menu) => {
          if (menu.menu_name === 'role-menu#all') {
            this.roleMenuAccessId = menu.id;
          } else if (menu.menu_name === 'summary#read.self') {
            this.selfSummaryMenuId = menu.id;
          } else if (menu.menu_name === 'emp-suggestion#all') {
            this.suggestionMenuId = menu.id;
          }
        });
      },
    });
  }

  menuPageMustBeOwnedByAtLeastOneRole(): boolean {
    return Object.values(this.roleMenus).some((menu) => {
      return menu.includes(this.roleMenuAccessId);
    });
  }

  summaryMustBeSelectedIfSuggestionIsSelected(): boolean {
    return !Object.values(this.roleMenus).some((menu) => {
      return (
        menu.includes(this.suggestionMenuId) &&
        !menu.includes(this.selfSummaryMenuId)
      );
    });
  }

  onSubmit() {
    this.isLoading = true;

    this.roleMenuService.update(this.roleMenus).subscribe({
      next: (_) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Role Menu updated sucessfuly!',
          icon: 'success',
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.reload();
          }
        });
      },
      error: (err) => {
        console.error('Error updating role-menu: ', err);
        Swal.fire({
          title: 'Failed to update role menu!',
          icon: 'error',
        });
        this.isLoading = false;
      },
    });
  }
}
