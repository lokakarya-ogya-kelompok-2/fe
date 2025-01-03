import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MegaMenuModule } from 'primeng/megamenu';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { DialogType, TokenPayload } from '../../../shared/types';
import { UserDetailComponent } from '../../users/components/user-detail/user-detail.component';
import { ChangePasswordReq, User } from '../../users/models/user';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule,
    MegaMenuModule,
    CommonModule,
    AvatarModule,
    NavbarComponent,
    ChipModule,
    UserDetailComponent,
  ],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  dialogType = DialogType;
  currentDialogType: DialogType = this.dialogType.CHANGE_PASSWORD;
  dialogVisible: boolean = false;
  formData: ChangePasswordReq = {} as ChangePasswordReq;
  isChangePasswordBtnLoading: boolean = false;
  items: MegaMenuItem[] | undefined;
  tokenPayload: TokenPayload = {} as TokenPayload;
  currentUser: User = {} as User;
  userInitial: string = '';

  constructor(
    private tokenService: TokenService,
    readonly authService: AuthService,
    private readonly userSvc: UserService,
    private readonly router: Router
  ) {}

  showDialog(dialogType: DialogType) {
    this.currentDialogType = dialogType;
    this.dialogVisible = true;
  }

  ngOnInit(): void {
    this.getToken();
    this.userSvc.getById(this.tokenPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
        this.userInitial = this.getInitial(this.currentUser.full_name, 2);
      },
      error: (err) => {
        console.error('Error fetching current user: ', err);
      },
    });
    this.items = [
      {
        label: 'Profile',
        root: true,
        icon: 'pi pi-user',
        command: () => {
          this.showDialog(DialogType.DETAIL);
        },
      },
      {
        label: 'Change Password',
        root: true,
        icon: 'pi pi-key',
        command: () => {
          this.showDialog(DialogType.CHANGE_PASSWORD);
        },
      },
      {
        label: 'Logout',
        root: true,
        style: { color: 'red !important' },
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
        },
      },
    ];
  }
  getToken(): void {
    const token = this.tokenService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.tokenPayload = this.tokenService.decodeToken(token);
    }
  }

  onChangePasswordSubmit() {
    this.isChangePasswordBtnLoading = true;
    this.userSvc.changePassword(this.formData).subscribe({
      next: (_) => {
        this.dialogVisible = false;
        this.isChangePasswordBtnLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password changed successfully!',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigate([this.router.url]);
          }
        });
      },
      error: (err) => {
        this.isChangePasswordBtnLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          customClass: {
            container: 'z-9999',
          },
          text: err.error.message || 'Unknown error occured!',
        });
      },
    });
  }

  newPasswordAndConfirmMissmatch(): boolean {
    return this.formData.new_password !== this.formData.confirm_new_password;
  }

  newPasswordAndCurrentPasswordIsTheSame(): boolean {
    return (
      (this.formData.new_password?.length > 0 ||
        this.formData.new_password?.length > 0) &&
      this.formData.new_password === this.formData.current_password
    );
  }

  resetFormData() {
    this.formData = {} as ChangePasswordReq;
  }
  getInitial = (fullName: string, n: number): string =>
    fullName
      .split(' ')
      .map((w) => w.slice(0, 1))
      .slice(0, n)
      .join('');
}
