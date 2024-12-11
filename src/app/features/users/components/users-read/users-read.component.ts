import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-users-read',
  standalone: true,
  imports: [NavbarComponent, UserListComponent],
  templateUrl: './users-read.component.html',
  styleUrl: './users-read.component.scss',
})
export class UsersReadComponent {}
