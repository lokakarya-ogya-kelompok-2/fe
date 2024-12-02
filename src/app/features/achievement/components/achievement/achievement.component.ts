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
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
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
  ],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss',
  providers: [
    AchievementService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
})
export class AchievementComponent implements OnInit {
  Datas: Achievement[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  editData: Achievement = {} as Achievement;
  newAchievement: AchievementRequest = {} as AchievementRequest;
  checked: boolean = false;
  groupAttitudeSkillDropdown: any = [];
  dataDetail: Achievement = {} as Achievement;
  groupAchievementDropdown: any = [];
  resetForm(): void {
    this.newAchievement.achievement = '';
    this.newAchievement.enabled = false;
    this.newAchievement.group_id = '';
  }
  constructor(
    private achievementService: AchievementService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAchievement();
  }

  getAchievement(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.Datas = data.content;
        data.content.map((item: any) => {
          this.groupAchievementDropdown.push({
            id: item.group_id?.id,
            name: item.group_id?.group_name,
          });
        });
        console.log(this.Datas);
        console.log(this.groupAchievementDropdown);

        this.loading = false;
      },
    });
  }
  createAchievement(): void {
    this.achievementService.createAchievement(this.newAchievement).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Achievement created!',
          icon: 'success',
        });
        this.resetForm();
        this.getAchievement();
      },
    });
  }
  updateAchievement(): void {
    this.achievementService.updateAchievement(this.editData).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Achievement updated!',
          icon: 'success',
        });
        this.getAchievement();
      },
      error: (err) => {
        console.error('Error updating achievement:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Achievement',
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
        this.achievementService.deleteAchievement(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Achievement deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getAchievement();
          },
          error: (err) => {
            console.error('Error deleting achievement:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete achievement',
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

  showDialog() {
    this.visible = true;
  }
  showEditDialog(data: any) {
    this.editVisible = true;
    this.editData = { ...data };
    this.editData.group_id = data.group_id.id;
    console.log(data, 'from dialog button');
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
