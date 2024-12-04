import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MegaMenuModule } from 'primeng/megamenu';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { TokenPayload } from '../../../shared/types';
import { ChangePasswordReq } from '../../users/models/user';
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

  constructor(
    private tokenService: TokenService,
    readonly authService: AuthService,
    private readonly userSvc: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getToken();
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
      },
      error: (err) => {
        console.log('CHANGE PASSWORD ERROR: ' + err);
        this.isChangePasswordBtnLoading = false;
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
