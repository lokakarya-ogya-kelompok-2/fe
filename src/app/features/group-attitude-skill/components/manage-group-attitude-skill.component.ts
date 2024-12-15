import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Status } from '../../../shared/types';
import {
  GroupAttitudeSkill,
  GroupAttitudeSkillRequest,
} from '../models/group-attitude-skill';
import { GroupAttitudeSkillService } from '../services/group-attitude-skill.service';

@Component({
  selector: 'app-manage-group-attitude-skill',
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
    CheckboxModule,
    FormsModule,
    NavbarComponent,
    DropdownModule,
    ToggleButtonModule,
  ],
  providers: [GroupAttitudeSkillService, ConfirmationService, MessageService],
  templateUrl: './manage-group-attitude-skill.component.html',
  styleUrl: './manage-group-attitude-skill.component.scss',
})
export class ManageGroupAttitudeSkillComponent {
  data: GroupAttitudeSkill[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newGroupAttitudeSkill: GroupAttitudeSkillRequest = {
    enabled: true,
  } as GroupAttitudeSkillRequest;
  editGroupAttitudeSkill: GroupAttitudeSkillRequest =
    {} as GroupAttitudeSkillRequest;
  checked: boolean = false;
  editData: GroupAttitudeSkill = {} as GroupAttitudeSkill;
  dataDetail: GroupAttitudeSkill = {} as GroupAttitudeSkill;

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
    this.newGroupAttitudeSkill.group_name = '';
    this.newGroupAttitudeSkill.percentage = 0;
    this.newGroupAttitudeSkill.enabled = false;
  }
  resetEditForm(): void {
    this.editData.group_name = '';
    this.editData.percentage = 0;
    this.editData.enabled = false;
  }
  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.groupAttitudeSkillService
      .getGroupAttitudeSkills({
        with_created_by: true,
        with_updated_by: true,
      })
      .subscribe({
        next: (data) => {
          this.data = data.content;
          this.loading = false;
          console.log('Data fetched:', data.content);
        },
        error: (err) => {
          console.error('Error fetching data:', err);
        },
      });
  }

  createGroupAttitudeSkill(): void {
    console.log(JSON.stringify(this.newGroupAttitudeSkill) + ' INIIIII');
    this.groupAttitudeSkillService
      .createGroupAttitudeSkills(this.newGroupAttitudeSkill)
      .subscribe({
        next: (data) => {
          console.log('Data created:', data);
          Swal.fire({
            title: 'Group attitude skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.getAllData();
        },
        error: (err) => {
          console.error('Error creating group attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed creating group attitude skill',
            text: err.error.message,
          });
        },
      });
  }
  updateGroupAttitudeSkill(): void {
    console.log('edittt');

    this.groupAttitudeSkillService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (data) => {
          console.log('Data updated:', data);
          Swal.fire({
            title: 'Group attitude skill updated!',
            icon: 'success',
          });
          this.getAllData();
          this.resetEditForm();
        },
        error: (err) => {
          console.error('Error updating group attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Updating Group Attitude Skill',
            text: err.error.message,
          });
        },
      });
  }
  confirmDelete(event: Event, key: string) {
    console.log(event.target);
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
        this.groupAttitudeSkillService
          .deleteGroupAttitudeSkills(key)
          .subscribe({
            next: (data) => {
              console.log(data);
              Swal.fire({
                title: 'Group Attitude Skill deleted!',
                icon: 'success',
                text: data.message,
              });
              this.getAllData();
            },
            error: (err) => {
              console.error('Error deleting group attitude skill:', err);
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete group attitude skill',
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
  showEditDialog(data: GroupAttitudeSkill) {
    this.editVisible = true;
    this.editData = { ...data };
    console.log(this.editData);
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
    console.log(this.dataDetail);
  }
}
