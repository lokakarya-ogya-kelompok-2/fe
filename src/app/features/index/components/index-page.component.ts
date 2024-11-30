import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { ChangePasswordReq } from '../../users/models/user';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    DialogModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule,
    MegaMenuModule,
    CommonModule,
    AvatarModule,
  ],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss',
})
export class IndexPageComponent implements OnInit {
  fullName: string | undefined = '';
  dialogVisible: boolean = false;
  formData: ChangePasswordReq = {} as ChangePasswordReq;
  isChangePasswordBtnLoading: boolean = false;
  items: MegaMenuItem[] | undefined;

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
        label: 'Main Menu',
        root: true,
        icon: 'pi pi-list',
        command: () => {
          this.router.navigate(['/manage']);
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
      const jwtPayload = this.tokenService.decodeToken(token);
      this.fullName = jwtPayload.full_name;
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
}
