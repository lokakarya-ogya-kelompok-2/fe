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
import { AttitudeSkill, AttitudeSkillRequest } from '../models/attitude-skill';
import { AttitudeSkillService } from '../services/attitude-skill.service';
@Component({
  selector: 'app-attitude-skill',
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
  ],
  templateUrl: './attitude-skill.component.html',
  styleUrl: './attitude-skill.component.scss',
  providers: [
    AttitudeSkillService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
})
export class AttitudeSkillComponent implements OnInit {
  Datas: AttitudeSkill[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  editData: AttitudeSkill = {} as AttitudeSkill;
  newAttitudeSkill: AttitudeSkillRequest = {} as AttitudeSkillRequest;
  checked: boolean = false;
  groupAttitudeSkillDropdown: any = [];
  dataDetail: AttitudeSkill = {} as AttitudeSkill;
  resetForm(): void {
    this.newAttitudeSkill.attitude_skill = '';
    this.newAttitudeSkill.enabled = false;
    this.newAttitudeSkill.group_id = '';
  }
  constructor(
    private attitudeSkillService: AttitudeSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAttitudeSkill();
  }

  getAttitudeSkill(): void {
    this.attitudeSkillService.getAttitudeSkills().subscribe({
      next: (data) => {
        this.Datas = data.content;
        data.content.map((item: any) =>
          this.groupAttitudeSkillDropdown.push({
            id: item.group_id.id,
            name: item.group_id.group_name,
          })
        );
        console.log(this.groupAttitudeSkillDropdown);
        console.log(this.Datas);
        this.loading = false;
      },
    });
  }
  createAttitudeSkill(): void {
    this.attitudeSkillService
      .createAttitudeSkill(this.newAttitudeSkill)
      .subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({
            title: 'Division created!',
            icon: 'success',
          });
          this.resetForm();
          this.getAttitudeSkill();
        },
        error: (err) => {
          console.error('Error creating division:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: 'Failed to create division',
          });
        },
      });
  }
  updateAttitudeSkill(): void {
    console.log(this.editData + ' INI');
    this.attitudeSkillService.updateAttitudeSkill(this.editData).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Attitude skill updated!',
          icon: 'success',
        });
        this.getAttitudeSkill();
      },
      error: (err) => {
        console.error('Error updating attitude skill: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'update attitude skill failed!',
        });
      },
    });
  }
  deleteAttitudeSkill(): void {}

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

        this.attitudeSkillService.deleteAttitudeSkill(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Attitude skill deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getAttitudeSkill();
          },
          error: (err) => {
            console.error('Error deleting attitude skill:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete attitude skill',
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
    this.visible = true;
    this.dataDetail = data;
    console.log(this.dataDetail);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
