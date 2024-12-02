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
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Achievement } from '../../../achievement/model/achievement';
import { AchievementService } from '../../../achievement/services/achievement.service';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
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
    NavbarComponent,
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
  userDropdown: User[] = [];
  achievementDropdown: Achievement[] = [];

  resetForm(): void {
    // this.newEmpAchievement.user_id = '';
  }
  constructor(
    private empAchievementService: EmpAchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private achievementService: AchievementService
  ) {}
  ngOnInit(): void {
    this.getAllEmpAchievement();
    this.getAllUser();
    this.getAllAchievement();
  }

  getAllAchievement(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.achievementDropdown = data.content;
        console.log(this.achievementDropdown);
      },
      error: (err) => {
        console.error('Error fetching achievement:', err);
      },
    });
  }
  getAllUser(): void {
    this.userService.list().subscribe({
      next: (data) => {
        this.userDropdown = data.content;
        console.log(this.userDropdown);
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
    this.empAchievementService
      .createEmpAchievement(this.newEmpAchievement)
      .subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({
            title: 'emp achievement created!',
            icon: 'success',
          });
          this.getAllEmpAchievement();
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
  showDialog() {
    this.visible = true;
  }
  showEditDialog(data: any) {
    this.editVisible = true;
    this.editData = { ...data };
    this.editData.achievement_id = data.achievement_id.id;
    this.editData.user_id = data.user_id.id;
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
