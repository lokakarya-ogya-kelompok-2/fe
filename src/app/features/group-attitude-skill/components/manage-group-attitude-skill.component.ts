import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Response } from '../../../shared/models/response';
import { Direction, Status } from '../../../shared/types';
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
  @ViewChild('groupAttitudeSkillTable') table: Table | undefined;
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
  isButtonLoading = false;

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
    this.newGroupAttitudeSkill.enabled = true;
  }

  constructor(
    private groupAttitudeSkillService: GroupAttitudeSkillService,
    private confirmationService: ConfirmationService
  ) {}

  getGroupAttitudeSkills(event: TableLazyLoadEvent): void {
    this.loading = true;
    this.groupAttitudeSkillService
      .getGroupAttitudeSkills({
        name_contains: event.globalFilter as string,
        with_created_by: true,
        with_updated_by: true,
        page_number: (event?.first || 0) / (event?.rows || 5) + 1,
        page_size: event?.rows || 5,
        sort_field: (event.sortField as string) || 'createdAt',
        sort_direction:
          event.sortField == undefined
            ? Direction.DESC
            : event.sortOrder == 1
            ? Direction.ASC
            : Direction.DESC,
      })
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching group attitude:', err);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Failed to fetch group attitude skills!',
          });
        },
      });
  }

  createGroupAttitudeSkill(): void {
    this.isButtonLoading = true;
    this.groupAttitudeSkillService
      .createGroupAttitudeSkills(this.newGroupAttitudeSkill)
      .subscribe({
        next: () => {
          this.isButtonLoading = false;
          this.table?.reset();
          Swal.fire({
            title: 'Group attitude skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.visible = false;
        },
        error: (err) => {
          this.isButtonLoading = false;
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
    this.isButtonLoading = true;
    this.groupAttitudeSkillService
      .updateGroupAttitudeSkills(this.editData)
      .subscribe({
        next: (data) => {
          this.isButtonLoading = false;
          this.table?.reset();
          this.editVisible = false;
          Swal.fire({
            title: 'Group attitude skill updated!',
            icon: 'success',
          });
        },
        error: (err) => {
          this.isButtonLoading = false;
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
              this.getGroupAttitudeSkills(this.table?.createLazyLoadMetadata());
              Swal.fire({
                title: 'Group Attitude Skill deleted!',
                icon: 'success',
                text: data.message,
              });
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
