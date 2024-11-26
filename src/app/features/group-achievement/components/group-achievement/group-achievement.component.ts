import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
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
  datas: any[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  checked: boolean = false;
  newGroupAchievement: GroupAchievementRequest = {} as GroupAchievementRequest;
  editGroupAchievement: GroupAchievement = {} as GroupAchievement;
  editData: GroupAchievement = {} as GroupAchievement;
  dataDetail: GroupAchievement = {} as GroupAchievement;

  resetForm(): void {
    this.newGroupAchievement.group_name = '';
    this.newGroupAchievement.percentage = 0;
    this.newGroupAchievement.enabled = false;
  }
  resetEditForm(): void {
    this.editData.group_name = '';
  }

  constructor(
    private groupAchievementService: GroupAchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getGroupAchievements();
  }

  getGroupAchievements(): void {
    this.groupAchievementService.getGroupAchievements().subscribe({
      next: (data) => {
        this.datas = data.content;
        console.log(this.datas);
        this.loading = false;
      },
    });
  }
  createGroupAchievements(): void {
    this.groupAchievementService
      .createGroupAchievement(this.newGroupAchievement)
      .subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({
            title: 'Group Achievement created!',
            icon: 'success',
          });
          this.resetForm();
          this.getGroupAchievements();
        },
      });
  }
  updateGroupAchievements(): void {
    this.groupAchievementService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (data) => {
          console.log('Data updated:', data);
          Swal.fire({
            title: 'Group Achievement updated!',
            icon: 'success',
          });
          this.getGroupAchievements();
        },
        error: (err) => {
          console.error('Error updating data:', err);
        },
      });
  }
  confirm2(event: Event, key: string) {
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
        this.groupAchievementService.deleteGroupAttitudeSkills(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Division deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getGroupAchievements();
          },
          error: (err) => {
            console.error('Error deleting division:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete division',
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

  //
  showDialog() {
    this.visible = true;
  }
  showEditDialog(data: any) {
    this.editVisible = true;
    this.editData = { ...data };
    console.log(this.editData, 'from dialog button');
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
    console.log(this.dataDetail);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}