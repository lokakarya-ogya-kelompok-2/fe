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
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
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
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() userData = {} as User;
  @Output() submit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  divisions: Division[] = [];
  isDivisionLoading: boolean = true;
  roles: Role[] = [];
  maxDate: Date = new Date();
  submitBtnLoading: boolean = false;
  formData: UserReq = {} as UserReq;

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
    private readonly userSvc: UserService
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
        console.log('ERROR ON DIVISION FETCH ' + err);
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
        console.log('ERROR ON ROLE FETCH ' + err);
      },
    });
  }

  onSubmit() {
    this.submitBtnLoading = true;
    if (this.userData.id) {
      this.userSvc.update(this.formData).subscribe({
        next: (_) => {
          this.submit.emit();
          Swal.fire({
            title: 'User Updated!',
            icon: 'success',
          });
          this.submitBtnLoading = false;
        },
        error: (err) => {
          console.log('ERROR ON UPDATE USER');
          this.submitBtnLoading = false;
        },
        complete: () => {},
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
        },
        error: (err) => {
          console.log('ERROR ON ADD USER: ' + err);
          this.submitBtnLoading = false;
        },
        complete: () => {},
      });
    }
  }
}
