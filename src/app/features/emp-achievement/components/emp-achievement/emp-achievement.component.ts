import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Achievement } from '../../../achievement/model/achievement';
import { AchievementService } from '../../../achievement/services/achievement.service';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import {
  EmpAchievement,
  EmpAchievementRequest,
} from '../../models/emp-achievement';
import { EmpAchievementService } from '../../services/emp-achievement.service';
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
    UserInformationComponent,
    AccordionModule,
    DividerModule,
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
export class EmpAchievementComponent implements OnInit {
  datas: EmpAchievement[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  // newEmpAchievement: EmpAchievementRequest = {} as EmpAchievementRequest;
  empAchievementRequests: { [key: string]: EmpAchievementRequest } = {};
  editData: EmpAchievement = {} as EmpAchievement;
  dataDetail: EmpAchievement = {} as EmpAchievement;
  users: User[] = [];
  userDropdown: User[] = [];
  achievementData: Achievement[] = [];
  selectedUser: User = {
    enabled: true,
    employee_status: 1,
  } as User;
  groupedAchievements: GroupedAchievement[] = [];
  userId: string = '';
  currentYear = new Date().getFullYear();

  resetForm(): void {
    // this.newEmpAchievement.user_id = '';
  }

  constructor(
    private empAchievementService: EmpAchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private achievementService: AchievementService,
    private readonly tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.userId = this.tokenService.decodeToken(
      this.tokenService.getToken()!
    ).sub!;
    this.getAllEmpAchievement();
    this.getAllUser();
    this.getAllAchievement();
    // this.newEmpAchievement.assessment_year = this.currentYear;
  }

  getAllAchievement(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.achievementData = data.content;
        this.achievementData.forEach((empAc) => {
          this.empAchievementRequests[empAc.id] = {
            user_id: this.userId,
            assessment_year: this.currentYear,
          } as EmpAchievementRequest;
        });
        console.log(this.achievementData);
      },
      error: (err) => {
        console.error('Error fetching achievement:', err);
      },
      complete: () => {
        this.groupedAchievements = Array.from(
          new Set(this.achievementData.map((a) => a.group_id.group_name))
        ).map((groupName) => ({
          group_name: groupName,
          achievements: this.achievementData.filter(
            (a) => a.group_id.group_name === groupName
          ),
        }));
        console.log(this.achievementData);
      },
    });
  }
  getAllUser(): void {
    this.userService.list().subscribe({
      next: (data) => {
        this.users = data.content;
        console.log(this.users, 'ini user');
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }
  getAllEmpAchievement() {
    this.empAchievementService.getAllEmpAchievements().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        console.log('Data fetched:', this.datas);
      },
      error: (err) => {
        console.error('Error fetching emp achievement:', err);
        this.loading = false;
      },
    });
  }
  createEmpAchievement() {
    // console.log(this.newEmpAchievement);
    console.log(this.empAchievementRequests, ' INI REQ DATANYA');
    let reqData: EmpAchievementRequest[] = [];
    Object.entries(this.empAchievementRequests).forEach(([id, empAcReq]) => {
      empAcReq.achievement_id = id;
      reqData.push(empAcReq);
    });
    console.log(reqData);
    // this.empAchievementService
    //   .createEmpAchievement(this.newEmpAchievement)
    //   .subscribe({
    //     next: (data) => {
    //       console.log(data);
    //       Swal.fire({
    //         title: 'emp achievement created!',
    //         icon: 'success',
    //       });
    //       this.getAllEmpAchievement();
    //       this.visible = false;
    //     },
    //     error: (err) => {
    //       console.error('Error creating emp achievement:', err);
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: err.error.message,
    //       });
    //     },
    //   });
  }
  updateEmpAchievement() {
    this.empAchievementService.updateEmpAchievement(this.editData).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'emp achievement updated!',
          icon: 'success',
        });
        this.getAllEmpAchievement();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error updating emp achievement:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
  confirmDelete(event: Event, key: string) {
    console.log('masuk');
    console.log(event.target);
    console.log(key);
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
        console.log('delete data');
        this.empAchievementService.deleteEmpAchievement(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Emp Achievement deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getAllEmpAchievement();
          },
          error: (err) => {
            console.error('Error deleting emp achievement:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete emp achievement',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
  // modal
  showDialog(user: User) {
    this.selectedUser = user;
    this.visible = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
