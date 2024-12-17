import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Status } from '../../../shared/types';
import { GroupAttitudeSkillService } from '../../group-attitude-skill/services/group-attitude-skill.service';
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
    ToggleButtonModule,
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
    enabled: true,
  } as AttitudeSkillRequest;
  checked: boolean = false;
  groupAttitudeSkillDropdown: SelectItem[] = [
    { label: 'Select a group attitude', value: '', disabled: true },
  ];
  dataDetail: AttitudeSkill = {} as AttitudeSkill;
  expandedRows: { [key: string]: boolean } = {};
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
  resetForm(): void {
    this.newAttitudeSkill.attitude_skill = '';
    this.newAttitudeSkill.enabled = false;
    this.newAttitudeSkill.group_id = '';
  }
  constructor(
    private attitudeSkillService: AttitudeSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private readonly groupAttitudeSkillService: GroupAttitudeSkillService
  ) {}

  ngOnInit(): void {
    this.getGroupAttitudeSkill();
    this.getAttitudeSkill();
  }
  getGroupAttitudeSkill(): void {
    this.groupAttitudeSkillService.getGroupAttitudeSkills().subscribe({
      next: (data) => {
        data.content.forEach((group) => {
          this.groupAttitudeSkillDropdown.push({
            label: group.group_name,
            value: group.id,
            disabled: !group.enabled,
          });
        });
      },
      error: (err) => {
        console.error('Error fetching group attitude skill:', err);
      },
    });
  }

  getAttitudeSkill(): void {
    this.loading = true;
    this.attitudeSkillService
      .getAttitudeSkills({
        with_group: true,
        with_created_by: true,
        with_updated_by: true,
      })
      .subscribe({
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
          Swal.fire({
            title: 'Attitude Skill created!',
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
            text: err.error.message,
          });
        },
      });
  }
  updateAttitudeSkill(): void {
    this.attitudeSkillService.updateAttitudeSkill(this.editData).subscribe({
      next: (data) => {
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
          title: 'Failed Updating Attitude Skill',
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
        console.log('delete data');
        this.attitudeSkillService.deleteAttitudeSkill(key).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Attitude skill deleted!',
              icon: 'success',
              text: data.message,
            });
            this.getAttitudeSkill();
          },
          error: (err) => {
            console.error('Error deleting attitude skill: ', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete attitude skill',
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
