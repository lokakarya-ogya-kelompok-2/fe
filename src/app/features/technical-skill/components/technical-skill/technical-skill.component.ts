import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
  Table,
  TableLazyLoadEvent,
  TableModule,
  TablePageEvent,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction, Status } from '../../../../shared/types';
import {
  TechnicalSkill,
  TechnicalSKillRequest,
} from '../../models/technical-skill';
import { TechnicalSkillService } from '../../services/technical-skill.service';

@Component({
  selector: 'app-technical-skill',
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
    CheckboxModule,
    NavbarComponent,
    ToggleButtonModule,
    DropdownModule,
  ],
  providers: [
    TechnicalSkillService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
  templateUrl: './technical-skill.component.html',
  styleUrl: './technical-skill.component.scss',
})
export class TechnicalSkillComponent {
  data: Response<TechnicalSkill[]> = {} as Response<TechnicalSkill[]>;
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newTechnicalSkill: TechnicalSKillRequest = {
    enabled: true,
  } as TechnicalSKillRequest;
  editData: TechnicalSkill = {} as TechnicalSkill;
  dataDetail: TechnicalSkill = {} as TechnicalSkill;
  checked: boolean = false;
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
  searchQuery = '';
  @ViewChild('name') table: Table | undefined;
  isButtonLoading = false;

  resetForm(): void {
    this.newTechnicalSkill.technical_skill = '';
    this.newTechnicalSkill.enabled = true;
  }

  constructor(
    private technicalSkillService: TechnicalSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // ngOnInit(): void {
  //   this.getTechnicalSkills();
  // }

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    // this.getTechnicalSkills();
  }

  getTechnicalSkills(event: TableLazyLoadEvent): void {
    this.technicalSkillService
      .getAllTechnicalSkills({
        with_created_by: true,
        with_updated_by: true,
        name_contains: this.searchQuery,
        // page_number: this.first / this.rows + 1,
        // page_size: this.rows,
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
          console.error('Error Fetching dev plan:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Fetching Dev Plan',
          });
        },
      });
  }

  createTechnicalSkill(): void {
    this.technicalSkillService
      .createTechnicalSkill(this.newTechnicalSkill)
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Technical skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.first = 0;
          this.searchQuery = '';
          // this.getTechnicalSkills();
          this.table?.reset();
          this.visible = false;
        },
        error: (err) => {
          console.error('Error creating technical skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Creating Technical Skill',
            text: err.error.message,
            customClass: {
              container: 'z-9999',
            },
          });
        },
      });
  }
  updateTechnicalSkill(): void {
    this.technicalSkillService.updateTechnicalSkill(this.editData).subscribe({
      next: (data) => {
        this.editVisible = false;
        Swal.fire({
          icon: 'success',
          title: 'Technical skill updated!',
        });
        // this.getTechnicalSkills();
        this.table?.reset();
      },
      error: (err) => {
        console.error('Error updating technical skill:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Technical Skill',
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
        this.technicalSkillService.deleteTechnicalSkill(key).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Technical Skill deleted!',
              icon: 'success',
              text: data.message,
            });
            // this.getTechnicalSkills();
            this.table?.reset();
          },
          error: (err) => {
            console.error('Error deleting technical skill:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete technical skill',
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
  }
  showDialogDetail(data: any) {
    this.detailVisible = true;
    this.dataDetail = data;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
