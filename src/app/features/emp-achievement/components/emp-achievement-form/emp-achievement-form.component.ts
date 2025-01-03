import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { GroupAchievement } from '../../../group-achievement/model/group-achievement';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { SummaryService } from '../../../sum/services/summary.service';
import {
  EmpAchievement,
  EmpAchievementRequest,
} from '../../models/emp-achievement';
import { EmpAchievementService } from '../../services/emp-achievement.service';

@Component({
  selector: 'app-emp-achievement-form',
  standalone: true,
  imports: [
    AccordionModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TableModule,
    MessageModule,
    DialogModule,
  ],
  templateUrl: './emp-achievement-form.component.html',
  styleUrl: './emp-achievement-form.component.scss',
})
export class EmpAchievementFormComponent implements OnInit, OnChanges {
  @Input() userId: string = '';
  groupAchievements: GroupAchievement[] = [];
  year: number = new Date().getFullYear();
  empAchievementRequests: { [key: string]: EmpAchievementRequest } = {};
  empAchievements: { [key: string]: EmpAchievement[] } = {};
  achievementList: { [key: string]: SelectItem[] } = {};
  isEditingGroup: { [key: string]: boolean } = {};
  isEditingChild: { [key: string]: boolean } = {};
  isApproved: boolean = false;
  noAchievements: boolean = true;

  constructor(
    private readonly groupAchievementSvc: GroupAchievementService,
    private readonly empAchievementSvc: EmpAchievementService,
    private readonly summarySvc: SummaryService
  ) {}

  ngOnInit(): void {
    this.groupAchievementSvc
      .getGroupAchievements({
        enabled_only: true,
        with_achievements: true,
        with_enabled_child_only: true,
      })
      .subscribe({
        next: (data) => {
          this.groupAchievements = data.content;
          this.groupAchievements.forEach((groupAc) => {
            if (!this.empAchievementRequests[groupAc.id]) {
              this.empAchievementRequests[groupAc.id] =
                {} as EmpAchievementRequest;
            }
            this.achievementList[groupAc.id] = [
              {
                label: 'Select an achievement',
                value: '',
                disabled: true,
              },
            ];
            groupAc.achievements.forEach((ach) => {
              this.achievementList[groupAc.id].push({
                label: ach.achievement,
                value: ach.id,
                disabled: false,
              });
            });
          });
        },
        error: (err) => {
          console.error('Erorr fetching group achievements: ', err);
        },
      });
  }

  adjustOptions() {
    const achievementIds = new Set(
      Object.values(this.empAchievements)
        .flat()
        .map((empAc) => empAc.achievement_id.id)
    );
    Object.values(this.achievementList).forEach((items) => {
      items.forEach((item) => {
        if (item.value != '') {
          item.disabled = achievementIds.has(item.value);
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.noAchievements = true;
      this.isApproved = false;
      this.summarySvc
        .getAllSummary({
          user_ids: [this.userId],
          years: [this.year],
          page_number: 1,
          page_size: 1,
        })
        .subscribe({
          next: (data) => {
            if (data.content.length > 0) {
              const firstResult = data.content[0];
              this.isApproved = firstResult.approval_status == 1;
            }
          },
          error: (err) => {
            console.error('Failed fo fetch assessment summary: ', err);
          },
        });
      this.fetchEmpAchievements();
    }
  }

  onSubmit(groupId: string) {
    if (this.isEditingGroup[groupId]) {
      this.updateEmpAchievement(this.empAchievementRequests[groupId]);
    } else {
      this.createEmpAchievement(this.empAchievementRequests[groupId]);
    }
  }

  createEmpAchievement(data: EmpAchievementRequest) {
    this.empAchievementSvc.createEmpAchievement(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Emp achievement created!',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            container: 'z-9999',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchEmpAchievements();
          }
        });
      },
      error: (err) => {
        console.error('Error creating emp achievement:', err);
        Swal.fire({
          title: 'Failed to create emp achievement!',
          icon: 'error',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }

  fetchEmpAchievements() {
    this.resetEditState();
    this.empAchievements = {};
    this.empAchievementSvc
      .getAllEmpAchievements({
        user_ids: [this.userId],
        years: [this.year],
      })
      .subscribe({
        next: (data) => {
          this.groupAchievements.forEach((groupAc) => {
            this.empAchievementRequests[groupAc.id] = {
              assessment_year: this.year,
              user_id: this.userId,
            } as EmpAchievementRequest;
          });
          data.content.forEach((empAc) => {
            if (!this.empAchievements[empAc.achievement_id.group_id.id]) {
              this.empAchievements[empAc.achievement_id.group_id.id] = [];
            }
            this.empAchievements[empAc.achievement_id.group_id.id].push(empAc);
          });
          this.adjustOptions();
          this.noAchievements = this.groupAchievements.length == 0;
        },
        error: (err) => {
          console.error('Error fetching employee achievements: ', err);
        },
      });
  }

  onEdit(groupId: string, empAc: EmpAchievement) {
    this.isEditingGroup[groupId] = true;
    this.isEditingChild[empAc.id] = true;
    this.empAchievementRequests[groupId] = {
      id: empAc.id,
      achievement_id: empAc.achievement_id.id,
      assessment_year: empAc.assessment_year,
      user_id: empAc.user_id.id,
      notes: empAc.notes,
      score: empAc.score,
    };
  }

  onCancelEdit(groupId: string, empAcId: string) {
    this.isEditingGroup[groupId] = false;
    this.isEditingChild[empAcId] = false;
    this.empAchievementRequests[groupId] = {} as EmpAchievementRequest;
  }

  onDelete(id: string) {
    Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      customClass: {
        container: 'z-9999',
      },
    }).then((res) => {
      if (res.isConfirmed) {
        this.empAchievementSvc.deleteEmpAchievement(id).subscribe({
          next: (data) => {
            Swal.fire({
              icon: 'success',
              title: 'Delete successful!',
              text: data.message,
              customClass: {
                container: 'z-9999',
              },
            }).then((res) => {
              if (res.isConfirmed) {
                this.fetchEmpAchievements();
              }
            });
          },
          error: (err) => {
            console.error('Error deleting employee achievement: ', err);
            Swal.fire({
              icon: 'error',
              title: 'Delete failed!',
              text: err.error.message,
              customClass: {
                container: 'z-9999',
              },
            });
          },
        });
      }
    });
  }

  updateEmpAchievement(data: EmpAchievementRequest) {
    this.empAchievementSvc.updateEmpAchievement(data).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Update successful!',
          text: data.message,
          customClass: {
            container: 'z-9999',
          },
        }).then((res) => {
          if (res.isConfirmed) {
            this.fetchEmpAchievements();
          }
        });
      },

      error: (err) => {
        console.error('Error updating employee achievement: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Update failed!',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }

  resetEditState() {
    Object.keys(this.isEditingGroup).forEach((groupId) => {
      this.isEditingGroup[groupId] = false;
    });
    Object.keys(this.isEditingChild).forEach((groupId) => {
      this.isEditingChild[groupId] = false;
    });
  }
}
