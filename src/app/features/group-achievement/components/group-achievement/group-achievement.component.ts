import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction, Status } from '../../../../shared/types';
import {
  GroupAchievement,
  GroupAchievementRequest,
} from '../../model/group-achievement';
import { GroupAchievementService } from '../../services/group-achievement.service';

@Component({
  selector: 'app-group-achievement',
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
    NavbarComponent,
    ToggleButtonModule,
    DropdownModule,
  ],
  providers: [
    GroupAchievementService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
  templateUrl: './group-achievement.component.html',
  styleUrl: './group-achievement.component.scss',
})
export class GroupAchievementComponent {
  data: Response<GroupAchievement[]> = {} as Response<GroupAchievement[]>;
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  checked: boolean = false;
  newGroupAchievement: GroupAchievementRequest = {
    enabled: true,
  } as GroupAchievementRequest;
  editGroupAchievement: GroupAchievement = {} as GroupAchievement;
  editData: GroupAchievement = {} as GroupAchievement;
  dataDetail: GroupAchievement = {} as GroupAchievement;
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
  first = 0;
  rows = 5;
  @ViewChild('groupAchievementTable') table: Table | undefined;
  isButtonLoading = false;

  resetForm(): void {
    this.newGroupAchievement.group_name = '';
    this.newGroupAchievement.percentage = 0;
    this.newGroupAchievement.enabled = true;
  }

  constructor(
    private groupAchievementService: GroupAchievementService,
    private confirmationService: ConfirmationService
  ) {}

  getGroupAchievements(event: TableLazyLoadEvent): void {
    this.groupAchievementService
      .getGroupAchievements({
        name_contains: event.globalFilter as string,
        with_created_by: true,
        with_updated_by: true,
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
          console.error('Error fetching group achievements: ', err);
        },
      });
  }
  createGroupAchievements(): void {
    this.isButtonLoading = true;
    this.groupAchievementService
      .createGroupAchievement(this.newGroupAchievement)
      .subscribe({
        next: (_) => {
          this.isButtonLoading = false;
          this.table?.reset();
          Swal.fire({
            title: 'Group Achievement created!',
            icon: 'success',
          });
          this.resetForm();
          this.visible = false;
        },
        error: (err) => {
          this.isButtonLoading = false;
          console.error('Error creating group achievement:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to create group achievement',
            text: err.error.message,
          });
        },
      });
  }
  updateGroupAchievements(): void {
    this.isButtonLoading = true;
    this.groupAchievementService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (_) => {
          this.isButtonLoading = false;
          this.table?.reset();
          Swal.fire({
            title: 'Group Achievement updated!',
            icon: 'success',
            customClass: {
              container: 'custom-swal-container',
            },
          });
          this.editVisible = false;
        },
        error: (err) => {
          this.isButtonLoading = false;
          console.error('Error updating group achievement:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to update group achievement',
            text: err.error.message,
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
        this.groupAchievementService.deleteGroupAttitudeSkills(key).subscribe({
          next: (data) => {
            this.getGroupAchievements(this.table?.createLazyLoadMetadata());
            Swal.fire({
              title: 'Group deleted!',
              icon: 'success',
              text: data.message,
            });
            this.table?.reset();
          },
          error: (err) => {
            console.error('Error deleting group achievement:', err);
            Swal.fire({
              title: 'Failed to delete group achievement!',
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
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
