import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { userToReq } from '../../../../shared/utils/mapper';
import { User, UserReq } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    UserFormComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  visible: boolean = false;
  selectedUser: UserReq = {} as UserReq;
  constructor(private readonly userSvc: UserService) {}

  loadUsers() {
    this.isLoading = true;
    this.userSvc.list().subscribe({
      next: (data) => {
        this.users = data.content;
      },
      error: (err) => {},
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showDialog(userData: User = {} as User) {
    this.selectedUser = userToReq(userData);
    this.visible = true;
  }

  onSubmit() {
    this.loadUsers();
    this.visible = false;
  }

  onDelete(id: string) {
    if (window.confirm('U sure?')) {
      this.userSvc.delete(id).subscribe({
        next: (data) => {
          console.log(`User with id ${id} deleted!`);
          this.loadUsers();
        },
        error: (err) => {
          console.log('Error occurs: ' + err);
        },
      });
    }
  }
}
