import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
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
  ],
  providers: [DevPlanService, ConfirmationService, MessageService, FormsModule],
  templateUrl: './dev-plan.component.html',
  styleUrl: './dev-plan.component.scss',
})
export class DevPlanComponent implements OnInit {
  datas: any[] = [];
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

  resetForm(): void {
    this.newDevPlan.plan = '';
    this.newDevPlan.enabled = false;
  }
  constructor(
    private devPlanService: DevPlanService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllDevPlan();
  }

  getAllDevPlan(): void {
    this.devPlanService.getAllDevPlan().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        console.log(this.datas);
      },
      error: (err) => {
        console.error('Error fetch dev plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Fetching Dev Plan',
        });
      },
    });
  }
  createDevPlan(): void {
    this.devPlanService.createDevPlan(this.newDevPlan).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Dev Plan created!',
          icon: 'success',
        });
        this.getAllDevPlan();
        this.resetForm();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error creating dev plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Creating Dev Plan',
        });
      },
    });
  }
  updateDevPlan(): void {
    this.devPlanService.updateDevPlan(this.editData).subscribe({
      next: () => {
        console.log(this.editData);
        Swal.fire({
          title: 'Dev Plan updated!',
          icon: 'success',
        });
        this.getAllDevPlan();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error updating dev plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Dev Plan',
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

        this.devPlanService.deleteDevPlan(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Dev Plan deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getAllDevPlan();
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
    console.log(this.editData, 'from dialog button');
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
