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
import { TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Response } from '../../../shared/models/response';
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
  data: Response<GroupAttitudeSkill[]> = {} as Response<GroupAttitudeSkill[]>;
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
  first = 0;
  rows = 5;
  searchQuery = '';

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
    private confirmationService: ConfirmationService
  ) {}

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.getGroupAttitudeSkills();
  }

  ngOnInit(): void {
    this.getGroupAttitudeSkills();
  }

  getGroupAttitudeSkills(): void {
    this.groupAttitudeSkillService
      .getGroupAttitudeSkills({
        name_contains: this.searchQuery,
        page_number: this.first / this.rows + 1,
        page_size: this.rows,
        with_created_by: true,
        with_updated_by: true,
      })
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching group attitude:', err);
        },
      });
  }

  createGroupAttitudeSkill(): void {
    this.groupAttitudeSkillService
      .createGroupAttitudeSkills(this.newGroupAttitudeSkill)
      .subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Group attitude skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.first = 0;
          this.searchQuery = '';
          this.getGroupAttitudeSkills();
          this.visible = false;
        },
        error: (err) => {
          console.error('Error creating group attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed creating group attitude skill',
            text: err.error.message,
            customClass: {
              container: 'z-9999',
            },
          });
        },
      });
  }
  updateGroupAttitudeSkill(): void {
    this.groupAttitudeSkillService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Group attitude skill updated!',
            icon: 'success',
          });
          this.getGroupAttitudeSkills();
          this.resetEditForm();
          this.editVisible = false;
        },
        error: (err) => {
          console.error('Error updating group attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Updating Group Attitude Skill',
            text: err.error.message,
            customClass: {
              container: 'z-9999',
            },
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
        this.groupAttitudeSkillService
          .deleteGroupAttitudeSkills(key)
          .subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Group Attitude Skill deleted!',
                icon: 'success',
                text: data.message,
              });
              this.getGroupAttitudeSkills();
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
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
  }

  stringify(obj: Object) {
    return JSON.stringify(obj);
  }
}
