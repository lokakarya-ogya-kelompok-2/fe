import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Response } from '../../../shared/models/response';
import { Division, DivisionRequest } from '../models/division';
import { ManageDivisionService } from '../services/manage-division.service';

@Component({
  selector: 'app-manage-division',
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
    NavbarComponent,
  ],
  providers: [
    ManageDivisionService,
    ConfirmationService,
    MessageService,
    FormsModule,
  ],
  templateUrl: './manage-division.component.html',
  styleUrl: './manage-division.component.scss',
})
export class ManageDivisionComponent implements OnInit {
  data: Response<Division[]> = {} as Response<Division[]>;
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newDivision: DivisionRequest = {} as DivisionRequest;
  editData: Division = {} as Division;
  dataDetail: Division = {} as Division;
  first = 0;
  divisionNameContains = '';
  rows = 5;

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.getDivisions();
  }

  resetForm(): void {
    this.newDivision.division_name = '';
  }
  constructor(
    private manageDivisionService: ManageDivisionService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getDivisions();
  }

  getDivisions(): void {
    this.manageDivisionService
      .getAllDivisions({
        name_contains: this.divisionNameContains,
        with_created_by: true,
        with_updated_by: true,
        page_number: this.first / this.rows + 1,
        page_size: this.rows,
      })
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching divisions:', err);
        },
      });
  }
  createDivision(): void {
    this.manageDivisionService.createDivision(this.newDivision).subscribe({
      next: () => {
        Swal.fire({
          title: 'Division created!',
          icon: 'success',
        });
        this.resetForm();
        this.first = 0;
        this.getDivisions();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error creating division:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to create division',
          text: err.error.message,
          customClass: {
            container: 'z-9999',
          },
        });
      },
    });
  }
  updateDivision(): void {
    this.manageDivisionService.updateDivision(this.editData).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Division updated!',
          icon: 'success',
        });
        this.getDivisions();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error updating division: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Update Division Failed',
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
        this.manageDivisionService.deleteDivision(key).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Division deleted!',
              icon: 'success',
              text: data.message,
            });
            this.getDivisions();
          },
          error: (err) => {
            console.error('Error deleting division:', err);
            Swal.fire({
              icon: 'error',
              title: 'Delete Division Failed',
              text: err.error.message,
              customClass: {
                container: 'z-9999',
              },
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
