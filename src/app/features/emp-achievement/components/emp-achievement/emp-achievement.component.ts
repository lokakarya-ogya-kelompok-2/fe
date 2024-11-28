import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import {
  EmpAchievement,
  EmpAchievementRequest,
} from '../../models/emp-achievement';
import { EmpAchievementService } from '../../services/emp-achievement.service';

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
  datas: any[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newEmpAchievement: EmpAchievementRequest = {} as EmpAchievementRequest;
  editData: EmpAchievement = {} as EmpAchievement;
  dataDetail: EmpAchievement = {} as EmpAchievement;
  userIdDropdown: any = [];
  achievementIdDropdown: any = [];
  resetForm(): void {
    // this.newEmpAchievement.user_id = '';
  }
  constructor(
    private empAchievementService: EmpAchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getAllEmpAchievement();
  }
  getAllEmpAchievement() {
    this.empAchievementService.getAllEmpAchievements().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        data.content.map((item: any) =>
          this.userIdDropdown.push({
            id: item.user_id?.id,
            name: item.user_id?.username,
          })
        );
        data.content.map((item: any) =>
          this.achievementIdDropdown.push({
            id: item.achievement_id.id,
            name: item.achievement_id.achievement,
          })
        );
        console.log(this.userIdDropdown);
        console.log(this.achievementIdDropdown);
        console.log('Data fetched:', this.datas);
      },
      error: (err) => {},
    });
  }
  createEmpAchievement() {}
  updateEmpAchievement() {}
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

        // this.manageDivisionService.deleteDivision(key).subscribe({
        //   next: (data) => {
        //     console.log(data);
        //     Swal.fire({
        //       title: 'Division deleted!',
        //       icon: 'success',
        //       text: data.message,
        //     });
        //     console.log('Data deleted successfully');
        //     this.getAllDivisions();
        //   },
        //   error: (err) => {
        //     console.error('Error deleting division:', err);
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'error',
        //       detail: 'Failed to delete division',
        //     });
        //   },
        // });
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
