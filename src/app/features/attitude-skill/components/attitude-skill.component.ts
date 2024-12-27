import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Response } from '../../../shared/models/response';
import { Direction, Status } from '../../../shared/types';
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
  data: Response<AttitudeSkill[]> = {} as Response<AttitudeSkill[]>;
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
  first = 0;
  rows = 5;
  @ViewChild('attitudeSkillTable') table: Table | undefined;
  isButtonLoading = false;

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

  getAttitudeSkills(event: TableLazyLoadEvent): void {
    this.loading = true;
    this.attitudeSkillService
      .getAttitudeSkills({
        any_contains: event.globalFilter as string,
        with_group: true,
        with_created_by: true,
        with_updated_by: true,
        page_number: (event.first || 0) / (event.rows || 5) + 1,
        page_size: event.rows || 5,
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
          const groupOrder: { [key: string]: number } = {};
          this.data.content.forEach((data, i) => {
            this.expandedRows[data.group_id.group_name] = true;
            if (groupOrder[data.group_id.id] == undefined) {
              groupOrder[data.group_id.id] = i;
            }
          });
          this.data.content.sort(
            (a, b) => groupOrder[a.group_id.id] - groupOrder[b.group_id.id]
          );
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching attitude skill:', err);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Failed fo fetch attitude skills',
          });
        },
      });
  }
  createAttitudeSkill(): void {
    this.isButtonLoading = true;
    this.attitudeSkillService
      .createAttitudeSkill(this.newAttitudeSkill)
      .subscribe({
        next: () => {
          this.isButtonLoading = false;
          this.table?.reset();
          Swal.fire({
            title: 'Attitude Skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.visible = false;
        },
        error: (err) => {
          this.isButtonLoading = false;
          console.error('Error creating attitude skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to create attitude skill',
            text: err.error.message,
            customClass: {
              container: 'z-9999',
            },
          });
        },
      });
  }
  updateAttitudeSkill(): void {
    this.isButtonLoading = true;
    this.loading = true;
    this.attitudeSkillService.updateAttitudeSkill(this.editData).subscribe({
      next: () => {
        this.isButtonLoading = false;
        this.table?.reset();
        Swal.fire({
          title: 'Attitude skill updated!',
          icon: 'success',
        });
        this.loading = false;
        this.editVisible = false;
      },
      error: (err) => {
        this.isButtonLoading = false;
        console.error('Error updating attitude skill: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update attitude skill',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }
  confirmDelete(event: Event, key: string) {
    this.loading = true;
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
        this.attitudeSkillService.deleteAttitudeSkill(key).subscribe({
          next: (data) => {
            this.getAttitudeSkills(this.table?.createLazyLoadMetadata());
            Swal.fire({
              title: 'Attitude skill deleted!',
              icon: 'success',
              text: data.message,
            });
            this.loading = false;
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
