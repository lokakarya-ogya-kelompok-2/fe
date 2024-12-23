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
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction, Status } from '../../../../shared/types';
import { DevPlan, DevPlanRequest } from '../../models/dev-plan';
import { DevPlanService } from '../../services/dev-plan.service';
@Component({
  selector: 'app-dev-plan',
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
  providers: [DevPlanService, ConfirmationService, MessageService, FormsModule],
  templateUrl: './dev-plan.component.html',
  styleUrl: './dev-plan.component.scss',
})
export class DevPlanComponent {
  data: Response<DevPlan[]> = {} as Response<DevPlan[]>;
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newDevPlan: DevPlanRequest = {
    enabled: true,
  } as DevPlanRequest;
  editData: DevPlan = {} as DevPlan;
  dataDetail: DevPlan = {} as DevPlan;
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
  isButtonLoading = false;
  @ViewChild('devPlanTable') table: Table | undefined;

  resetForm(): void {
    this.newDevPlan.plan = '';
    this.newDevPlan.enabled = true;
  }
  constructor(
    private devPlanService: DevPlanService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  getDevPlans(event: TableLazyLoadEvent): void {
    this.devPlanService
      .getAllDevPlan({
        with_created_by: true,
        with_updated_by: true,
        name_contains: event.globalFilter as string,
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
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetch dev plan:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Fetching Dev Plan',
          });
        },
      });
  }
  createDevPlan(): void {
    this.isButtonLoading = true;
    this.devPlanService.createDevPlan(this.newDevPlan).subscribe({
      next: (data) => {
        this.isButtonLoading = false;
        this.table?.reset();
        Swal.fire({
          title: 'Dev Plan created!',
          icon: 'success',
        });
        this.resetForm();
        this.visible = false;
      },
      error: (err) => {
        this.isButtonLoading = false;
        console.error('Error creating dev plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Creating Dev Plan',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }
  updateDevPlan(): void {
    this.isButtonLoading = true;
    this.devPlanService.updateDevPlan(this.editData).subscribe({
      next: () => {
        this.isButtonLoading = false;
        this.table?.reset();
        Swal.fire({
          title: 'Dev Plan updated!',
          icon: 'success',
        });
        this.editVisible = false;
      },
      error: (err) => {
        this.isButtonLoading = false;
        console.error('Error updating dev plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Dev Plan',
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
        this.devPlanService.deleteDevPlan(key).subscribe({
          next: (data) => {
            this.getDevPlans(this.table?.createLazyLoadMetadata());
            Swal.fire({
              title: 'Dev Plan deleted!',
              icon: 'success',
              text: data.message,
            });
          },
          error: (err) => {
            console.error('Error deleting dev plan:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Failed to delete dev plan',
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
