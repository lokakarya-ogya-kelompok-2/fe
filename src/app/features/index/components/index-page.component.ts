import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TokenPayload } from '../../../shared/types';
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
  ],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  dialogVisible: boolean = false;
  formData: ChangePasswordReq = {} as ChangePasswordReq;
  isChangePasswordBtnLoading: boolean = false;
  items: MegaMenuItem[] | undefined;
  tokenPayload: TokenPayload = {} as TokenPayload;
  currentUser: User = {} as User;

  constructor(
    private tokenService: TokenService,
    readonly authService: AuthService,
    private readonly userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.userSvc.getById(this.tokenPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
      },
      error: (err) => {
        console.error('Error fetching user: ', err);
      },
    });
    this.items = [
      {
        label: 'Change Password',
        root: true,
        icon: 'pi pi-key',
        command: () => {
          this.dialogVisible = true;
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
        });
      },
      error: (err) => {
        this.isChangePasswordBtnLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
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
