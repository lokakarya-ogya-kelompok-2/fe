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
  loading: boolean = false;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  empAchievementRequests: { [key: string]: EmpAchievementRequest } = {};
  editData: EmpAchievement = {} as EmpAchievement;
  dataDetail: EmpAchievement = {} as EmpAchievement;
  users: User[] = [];
  userDropdown: User[] = [];
  achievementData: Achievement[] = [];
  selectedUser: User = {} as User;
  groupedAchievements: GroupedAchievement[] = [];
  currentYear = new Date().getFullYear();
  notSubmissible = false;
  constructor(
    private empAchievementService: EmpAchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private achievementService: AchievementService
  ) {}
  ngOnInit(): void {
    this.getAllUser();
  }

  getAllAchievement(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.achievementData = data.content;
        this.achievementData.forEach((empAc) => {
          this.empAchievementRequests[empAc.id] = {
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
        this.getAllEmpAchievement();
      },
    });
  }

  getAllUser(): void {
    this.loading = true;
    this.userService.list().subscribe({
      next: (data) => {
        this.users = data.content;
        console.log(this.users, 'ini user');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.loading = false;
      },
    });
  }
  getAllEmpAchievement() {
    this.empAchievementService
      .getByUserIdAndYear(this.selectedUser.id, this.currentYear)
      .subscribe({
        next: (data) => {
          this.loading = false;
          data.content.forEach((empAc) => {
            this.notSubmissible ||= empAc.id == undefined;
            this.empAchievementRequests[empAc.achievement_id.id] = {
              ...this.empAchievementRequests[empAc.achievement_id.id],
              id: empAc.id,
              notes: empAc.notes || '',
              score: empAc.score || 0,
            };
          });
        },
        error: (err) => {
          console.error('Error fetching emp achievement:', err);
          this.loading = false;
        },
      });
  }
  createEmpAchievement() {
    console.log(this.empAchievementRequests, ' INI REQ DATANYA');
    let reqData: EmpAchievementRequest[] = [];
    Object.entries(this.empAchievementRequests).forEach(([id, empAcReq]) => {
      if (!empAcReq.id) {
        empAcReq.achievement_id = id;
        empAcReq.user_id = this.selectedUser.id;
        reqData.push(empAcReq);
      }
    });
    this.empAchievementService.createEmpAchievement(reqData).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'emp achievement created!',
          icon: 'success',
        });
        this.visible = false;
      },
      error: (err) => {
        console.error('Error creating emp achievement:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }

  // modal
  showDialog(user: User) {
    this.selectedUser = user;
    this.visible = true;
    this.getAllAchievement();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
