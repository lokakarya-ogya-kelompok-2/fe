import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import { Response } from '../../../../shared/models/response';
import { DialogType, Direction } from '../../../../shared/types';
import { userToReq } from '../../../../shared/utils/mapper';
import { User, UserReq } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';
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
    UserDetailComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  @Input() withActionButtons: boolean = true;
  data: Response<User[]> = {} as Response<User[]>;
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {
    enabled: true,
    employee_status: 1,
  } as User;
  dialogType = DialogType;
  currentDialogType: DialogType = DialogType.ADD;
  currentUserId: string = '';
  first: number = 0;
  rows: number = 5;
  @ViewChild('userTable') table: Table | undefined;

  constructor(
    private readonly userSvc: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private readonly tokenSvc: TokenService
  ) {}

  loadUsers(event: TableLazyLoadEvent) {
    this.isLoading = true;
    this.userSvc
      .list({
        any_contains: event.globalFilter as string,
        with_roles: true,
        with_created_by: true,
        with_updated_by: true,
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
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user: ', err);
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Failed to fetch users',
          });
        },
      });
  }

  ngOnInit(): void {
    this.currentUserId = this.tokenSvc.decodeToken(
      this.tokenSvc.getToken()!
    ).sub!;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showDialog(dialogType: DialogType, userData: User = {} as User) {
    this.toggleDialog(true);
    this.currentDialogType = dialogType;
    switch (dialogType) {
      case DialogType.ADD:
        this.selectedUser = {} as User;
        this.dialogHeader = 'Add User';
        break;
      case DialogType.UPDATE:
        this.selectedUser = userData;
        this.dialogHeader = 'Update User';
        break;
      case DialogType.DETAIL:
        this.selectedUser = userData;
        this.dialogHeader = 'Detail User';
    }
  }

  userReqData(): UserReq {
    return userToReq(this.selectedUser);
  }

  onSubmit() {
    this.table?.reset();
  }

  toggleDialog(value: boolean) {
    this.visible = value;
  }

  onDelete(event: Event, key: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      key: key,
      accept: () => {
        this.userSvc.delete(key).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'User deleted!',
              icon: 'success',
              text: data.message,
            });
            this.loadUsers(this.table?.createLazyLoadMetadata());
          },
          error: (err) => {
            console.error('Error deleting user: ', err);
            Swal.fire({
              title: 'Failed to delete user!',
              icon: 'error',
              text: err.error.data.message,
            });
          },
        });
      },
    });
  }

  showToast(message: Message) {
    this.messageService.clear();
    this.messageService.add(message);
  }
}
