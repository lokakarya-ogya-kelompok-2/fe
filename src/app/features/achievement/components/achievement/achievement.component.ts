import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Status } from '../../../../shared/types';
import { GroupAchievementService } from '../../../group-achievement/services/group-achievement.service';
import { Achievement, AchievementRequest } from '../../model/achievement';
import { AchievementService } from '../../services/achievement.service';

@Component({
  selector: 'app-achievement',
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
    CheckboxModule,
    DropdownModule,
    NavbarComponent,
    ToggleButtonModule,
  ],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss',
  providers: [AchievementService, ConfirmationService, FormsModule],
})
export class AchievementComponent implements OnInit {
  data: Response<Achievement[]> = {} as Response<Achievement[]>;
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  editData: Achievement = {} as Achievement;
  newAchievement: AchievementRequest = {
    enabled: true,
  } as AchievementRequest;
  checked: boolean = false;
  dataDetail: Achievement = {} as Achievement;
  groupAchievementDropdown: SelectItem[] = [
    {
      label: 'Select an achievement group',
      value: '',
      disabled: true,
    },
  ];
  statuses: Status[] = [
    {
      label: 'Enabled',
      value: true,
      severity: 'success',
    },
    {
      label: 'Disabled',
      value: false,
      severity: 'danger',
    },
  ];
  searchQuery = '';
  first = 0;
  rows = 5;

  expandedRows: { [key: string]: boolean } = {};
  resetForm(): void {
    this.newAchievement.achievement = '';
    this.newAchievement.enabled = true;
    this.newAchievement.group_id = '';
  }

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.getAchievements();
  }
  constructor(
    private groupAchievementService: GroupAchievementService,
    private achievementService: AchievementService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAchievements();
    this.getGroupAchievement();
  }

  getGroupAchievement(): void {
    this.groupAchievementService.getGroupAchievements().subscribe({
      next: (data) => {
        data.content.forEach((group) => {
          this.groupAchievementDropdown.push({
            label: group.group_name,
            value: group.id,
            disabled: !group.enabled,
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group achievements: ', err);
      },
    });
  }
  getAchievements(): void {
    this.achievementService
      .getAchievements({
        any_contains: this.searchQuery,
        with_group: true,
        with_created_by: true,
        with_updated_by: true,
        page_number: this.first / this.rows + 1,
        page_size: this.rows,
      })
      .subscribe({
        next: (data) => {
          this.data = data;
          this.data.content.forEach((data) => {
            this.expandedRows[data.group_id.group_name] = true;
          });
          this.loading = false;
        },
      });
  }
  createAchievement(): void {
    this.achievementService.createAchievement(this.newAchievement).subscribe({
      next: (_) => {
        Swal.fire({
          title: 'Achievement created!',
          icon: 'success',
        });
        this.resetForm();
        this.first = 0;
        this.searchQuery = '';
        this.getAchievements();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error creating achievement:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to create achievement',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }
  updateAchievement(): void {
    this.achievementService.updateAchievement(this.editData).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Achievement updated!',
          icon: 'success',
        });
        this.getAchievements();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error updating achievement:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Achievement',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }

  confirmDelete(event: Event, key: string) {
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
        this.achievementService.deleteAchievement(key).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Achievement deleted!',
              icon: 'success',
              text: data.message,
            });
            this.getAchievements();
          },
          error: (err) => {
            console.error('Error deleting achievement:', err);
            Swal.fire({
              title: 'Failed to delete achievement!',
              icon: 'error',
              text: err.error.message,
            });
          },
        });
      },
    });
  }

  showDialog() {
    this.visible = true;
  }
  showEditDialog(data: any) {
    this.editVisible = true;
    this.editData = { ...data };
    this.editData.group_id = data.group_id.id;
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
