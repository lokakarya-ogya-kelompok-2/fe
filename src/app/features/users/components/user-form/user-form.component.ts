import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Confirmation,
  ConfirmationService,
  Message,
  MessageService,
} from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { userToReq } from '../../../../shared/utils/mapper';
import { Division } from '../../../divisions/models/division';
import { ManageDivisionService } from '../../../divisions/services/manage-division.service';
import { Role } from '../../../roles/models/role';
import { RoleService } from '../../../roles/services/role.service';
import { User, UserReq } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    SelectButtonModule,
    MultiSelectModule,
    ToggleButtonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [ConfirmationService],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() userData = {} as User;
  @Output() submit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() showToast = new EventEmitter<Message>();
  @Output() toggleDialog = new EventEmitter<boolean>();

  divisions: Division[] = [];
  isDivisionLoading: boolean = true;
  roles: Role[] = [];
  maxDate: Date = new Date();
  submitBtnLoading: boolean = false;
  formData: UserReq = {} as UserReq;
  resetPasswordLoading: boolean = false;

  statusOptions = [
    {
      label: 'Permanent',
      value: 1,
    },
    {
      label: 'Contract',
      value: 0,
    },
  ];

  constructor(
    private readonly divisionSvc: ManageDivisionService,
    private readonly roleSvc: RoleService,
    private readonly userSvc: UserService,
    private readonly confirmationSvc: ConfirmationService,
    private readonly messageSvc: MessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData']) {
      this.formData = userToReq(this.userData);
    } else {
      this.formData = {} as UserReq;
    }
  }

  ngOnInit(): void {
    this.isDivisionLoading = true;
    this.divisionSvc.getAllDivisions().subscribe({
      next: (data) => {
        this.divisions = data.content;
      },
      error: (err) => {
        console.error('Error fetching divisions: ', err);
      },
      complete: () => {
        this.isDivisionLoading = false;
      },
    });

    this.roleSvc.list().subscribe({
      next: (data) => {
        this.roles = data.content;
      },
      error: (err) => {
        console.error('Error fetching roles: ', err);
      },
    });
  }

  onSubmit() {
    this.submitBtnLoading = true;
    if (this.userData.id) {
      this.userSvc.update(this.formData).subscribe({
        next: (_) => {
          this.submit.emit();
          this.submitBtnLoading = false;
          this.toggleDialog.emit(false);
          Swal.fire({
            title: 'User Updated!',
            icon: 'success',
          }).then((res) => {
            if (res.isConfirmed) {
              window.location.reload();
            }
          });
        },
        error: (err) => {
          this.submitBtnLoading = false;
          console.error('Error updating user: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to update user',
            text: err.error.message,
          });
        },
      });
    } else {
      this.userSvc.add(this.formData).subscribe({
        next: (_) => {
          this.submit.emit();
          Swal.fire({
            title: 'User Created!',
            icon: 'success',
          });
          this.submitBtnLoading = false;
          this.toggleDialog.emit(false);
        },
        error: (err) => {
          console.error('Error adding user: ', err);
          this.submitBtnLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Failed to create user',
            text: err.error.message,
          });
        },
      });
    }
  }

  onResetPassword(event: Event, userId: string) {
    this.showConfirmDialog(event, {
      target: event.target as EventTarget,
      message: "Are you sure you want to reset this user's password?",
      header: 'Reset Password',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userSvc.resetPassword(userId).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Password changed successfully!',
              html: `
                <div class="flex align-items-center justify-content-center gap-2">
                  <span>New Password: ${data.content}</span>
                  <button class="p-button p-button-text" onclick="navigator.clipboard.writeText('${data.content}')">
                    <i class="pi pi-copy"></i>
                  </button>
                </div>
              `,
              icon: 'success',
              customClass: {},
              didOpen: () => {
                const copyBtn =
                  Swal.getHtmlContainer()?.querySelector('button');
                if (copyBtn) {
                  copyBtn.addEventListener('click', () => {
                    this.showToast.emit({
                      severity: 'success',
                      summary: 'Text Copied',
                      detail: 'New password copied to clipboard!',
                    });
                  });
                }
              },
            });
          },
          error: (err) => {
            console.error('Error reset user password: ', err);
          },
        });
      },
    });
  }

  showConfirmDialog(event: Event, confirmation: Confirmation) {
    this.confirmationSvc.close();
    this.confirmationSvc.confirm(confirmation);
  }
}
