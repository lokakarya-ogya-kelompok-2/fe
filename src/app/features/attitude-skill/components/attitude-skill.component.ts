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
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { GroupAttitudeSkill } from '../../group-attitude-skill/models/group-attitude-skill';
import { ManageGroupAttitudeSkillService } from '../../group-attitude-skill/services/manage-group-attitude-skill.service';
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
    NavbarComponent,
  ],
  templateUrl: './attitude-skill.component.html',
  styleUrl: './attitude-skill.component.scss',
  providers: [AttitudeSkillService, ConfirmationService, MessageService],
})
export class AttitudeSkillComponent implements OnInit {
  Datas: AttitudeSkill[] = [];
  loading: boolean = false;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  editData: AttitudeSkill = {} as AttitudeSkill;
  newAttitudeSkill: AttitudeSkillRequest = {
    enabled: false,
  } as AttitudeSkillRequest;
  checked: boolean = false;
  groupAttitudeSkillDropdown: GroupAttitudeSkill[] = [];
  dataDetail: AttitudeSkill = {} as AttitudeSkill;
  expandedRows: { [key: string]: boolean } = {};
  resetForm(): void {
    this.newAttitudeSkill.attitude_skill = '';
    this.newAttitudeSkill.enabled = false;
    this.newAttitudeSkill.group_id = '';
  }
  constructor(
    private attitudeSkillService: AttitudeSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private readonly groupAttitudeSkillService: ManageGroupAttitudeSkillService
  ) {}

  ngOnInit(): void {
    this.getGroupAttitudeSkill();
    this.getAttitudeSkill();
  }
  getGroupAttitudeSkill(): void {
    this.groupAttitudeSkillService.getGroupAttitudeSkills().subscribe({
      next: (data) => {
        this.groupAttitudeSkillDropdown = data.content;

        console.log(this.groupAttitudeSkillDropdown);
      },
      error: (err) => {
        console.error('Error fetching group attitude skill:', err);
      },
    });
  }

  getAttitudeSkill(): void {
    this.loading = true;
    this.attitudeSkillService.getAttitudeSkills().subscribe({
      next: (data) => {
        this.Datas = data.content;
        this.Datas.forEach((data) => {
          this.expandedRows[data.group_id.group_name] = true;
        });
        this.loading = false;
        console.log(this.Datas);
      },
      error: (err) => {
        console.error('Error fetching attitude skill:', err);
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
            title: 'Attitude SKill created!',
            icon: 'success',
          });
          this.resetForm();
          this.getAttitudeSkill();
        },
        error: (err) => {
          console.error('Error updating attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Updating Attitude Skill',
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
        console.error('Error updating attitude skill:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Attitude Skill',
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
    this.detailVisible = true;
    this.dataDetail = data;
    console.log(this.dataDetail);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
