import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction } from '../../../../shared/types';
import { Achievement } from '../../../achievement/model/achievement';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { EmpAchievementRequest } from '../../models/emp-achievement';
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
    AccordionModule,
    DividerModule,
    CardModule,
    MessageModule,
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
  empAchievementRequests: { [key: string]: EmpAchievementRequest } = {};
  data: Response<User[]> = {} as Response<User[]>;
  selectedUser: User = {} as User;
  currentYear = new Date().getFullYear();
  submissible = false;
  groupAchievements: GroupAchievement[] = [];
  first = 0;
  rows = 5;

  constructor(
    private empAchievementService: EmpAchievementService,
    private userService: UserService,
    private groupAchievementSvc: GroupAchievementService,
    private readonly router: Router
  ) {}

  reload() {
    this.router.navigate([this.router.url]);
  }

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
  createEmpAchievement() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'After submitting this form, you will not be able to modify the data. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        container: ['z-9999'],
      },
    }).then((res) => {
      if (res.isConfirmed) {
        let reqData: EmpAchievementRequest[] = [];
        Object.entries(this.empAchievementRequests).forEach(
          ([id, empAcReq]) => {
            if (!empAcReq.id) {
              empAcReq.achievement_id = id;
              empAcReq.user_id = this.selectedUser.id;
              reqData.push(empAcReq);
            }
          }
        );
        this.empAchievementService.createEmpAchievement(reqData).subscribe({
          next: () => {
            Swal.fire({
              title: 'Emp achievement created!',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                this.reload();
              }
            });
            this.visible = false;
          },
          error: (err) => {
            console.error('Error creating emp achievement:', err);
            Swal.fire({
              title: 'Failed to create emp achievement!',
              icon: 'error',
              text: err.error.message,
            });
          },
        });
      }
    });
  }

  showDialog(user: User) {
    this.selectedUser = user;
    this.visible = true;
    forkJoin({
      groupAchievements: this.groupAchievementSvc.getGroupAchievements({
        with_achievements: true,
        enabled_only: true,
        with_enabled_child_only: true,
      }),
      empAchievements: this.empAchievementService.getAllEmpAchievements({
        user_ids: [this.selectedUser.id],
        years: [this.currentYear],
      }),
    }).subscribe({
      next: (data) => {
        this.groupAchievements = data.groupAchievements.content;
        this.groupAchievements.forEach((groupAc) => {
          groupAc.achievements.forEach((ac) => {
            this.empAchievementRequests[ac.id] = {
              achievement_id: ac.id,
              assessment_year: this.currentYear,
            } as EmpAchievementRequest;
          });
        });
        data.empAchievements.content.forEach((empAc) => {
          this.empAchievementRequests[empAc.achievement_id.id] = {
            id: empAc.id,
            user_id: empAc.user_id.id,
            notes: empAc.notes,
            achievement_id: empAc.achievement_id.id,
            score: empAc.score,
            assessment_year: empAc.assessment_year,
          };
        });
        this.submissible = Object.values(this.empAchievementRequests)
          .flat()
          .some((empAcReq) => !empAcReq.id);
      },
      error: (err) => {
        console.error(
          'Error fetching group achievements/emp achievements: ',
          err
        );
      },
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
