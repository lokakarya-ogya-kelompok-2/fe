import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Status } from '../../../../shared/types';
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
export class GroupAchievementComponent implements OnInit {
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
  searchQuery = '';

  resetForm(): void {
    this.newGroupAchievement.group_name = '';
    this.newGroupAchievement.percentage = 0;
    this.newGroupAchievement.enabled = true;
  }

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.getGroupAchievements();
  }

  constructor(
    private groupAchievementService: GroupAchievementService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getGroupAchievements();
  }

  getGroupAchievements(): void {
    this.groupAchievementService
      .getGroupAchievements({
        with_created_by: true,
        with_updated_by: true,
        name_contains: this.searchQuery,
        page_number: this.first / this.rows + 1,
        page_size: this.rows,
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
    this.groupAchievementService
      .createGroupAchievement(this.newGroupAchievement)
      .subscribe({
        next: (_) => {
          Swal.fire({
            title: 'Group Achievement created!',
            icon: 'success',
          });
          this.first = 0;
          this.searchQuery = '';
          this.resetForm();
          this.getGroupAchievements();
          this.visible = false;
        },
        error: (err) => {
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
    this.groupAchievementService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (_) => {
          Swal.fire({
            title: 'Group Achievement updated!',
            icon: 'success',
            customClass: {
              container: 'custom-swal-container',
            },
          });
          this.getGroupAchievements();
          this.editVisible = false;
        },
        error: (err) => {
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
            Swal.fire({
              title: 'Group deleted!',
              icon: 'success',
              text: data.message,
            });
            this.getGroupAchievements();
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
