import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction } from '../../../../shared/types';
import { Achievement } from '../../../achievement/model/achievement';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { EmpAchievementService } from '../../services/emp-achievement.service';
import { EmpAchievementFormComponent } from '../emp-achievement-form/emp-achievement-form.component';
interface GroupedAchievement {
  group_name: string;
  achievements: Achievement[];
}
@Component({
  selector: 'app-emp-achievement',
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
    ReactiveFormsModule,
    DropdownModule,
    NavbarComponent,
    AccordionModule,
    DividerModule,
    CardModule,
    MessageModule,
    EmpAchievementFormComponent,
  ],
  providers: [
    EmpAchievementService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
  templateUrl: './emp-achievement.component.html',
  styleUrl: './emp-achievement.component.scss',
})
export class EmpAchievementComponent {
  loading: boolean = false;
  visible: boolean = false;
  data: Response<User[]> = {} as Response<User[]>;
  selectedUser: User = {} as User;
  first = 0;
  rows = 5;

  constructor(private userService: UserService) {}

  getAllUser(event: TableLazyLoadEvent): void {
    this.loading = true;
    this.userService
      .list({
        any_contains: event.globalFilter as string,
        search_by: ['fullName', 'username', 'position', 'division.name'],
        page_number: (event?.first || 0) / (event?.rows || 5) + 1,
        page_size: event?.rows || 5,
        sort_field: (event.sortField as string) || 'createdAt',
        sort_direction:
          event.sortField == undefined
            ? Direction.DESC
            : event.sortOrder == 1
            ? Direction.ASC
            : Direction.DESC,
      })
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching user:', err);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: 'Failed to fetch users!',
          });
        },
      });
  }

  showDialog(user: User) {
    this.selectedUser = user;
    this.visible = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
