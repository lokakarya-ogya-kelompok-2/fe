import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { DialogType } from '../../../../shared/types';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-summaries',
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
    NavbarComponent,
    ChipModule,
    SummaryComponent,
  ],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
})
export class SummariesComponent {
  users: User[] = [];
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {
    enabled: true,
    employee_status: 1,
  } as User;
  dialogType = DialogType;
  currentDialogType: DialogType = DialogType.ADD;
  constructor(private readonly userSvc: UserService) {}

  loadUsers() {
    this.isLoading = true;
    this.userSvc.list().subscribe({
      next: (data) => {
        this.users = data.content;
        this.isLoading = false;
        console.log(this.users);
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }

  showDialog(userData: User = {} as User) {
    this.visible = true;
    this.selectedUser = userData;
    console.log(userData);
    console.log('DIALOG VISIBLE: ', this.visible);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
