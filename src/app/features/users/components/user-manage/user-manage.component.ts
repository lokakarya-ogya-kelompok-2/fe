import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [NavbarComponent, UserListComponent],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent {}
