import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  datas: any[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  detailVisible: boolean = false;
  newTechnicalSkill: TechnicalSKillRequest = {
    enabled: false,
  } as TechnicalSKillRequest;
  editData: TechnicalSkill = {} as TechnicalSkill;
  dataDetail: TechnicalSkill = {} as TechnicalSkill;
  checked: boolean = false;

  resetForm(): void {
    this.newTechnicalSkill.technical_skill = '';
    this.newTechnicalSkill.enabled = false;
  }
  constructor(
    private technicalSkillService: TechnicalSkillService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllTechnicalSkills();
  }

  getAllTechnicalSkills(): void {
    this.technicalSkillService.getAllTechnicalSkills().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        console.log(this.datas);
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
        next: (data) => {
          console.log(data);
          this.visible = false;
          Swal.fire({
            title: 'Technical skill created!',
            icon: 'success',
          });
          this.resetForm();
          this.getAllTechnicalSkills();
        },
        error: (err) => {
          console.error('Error creating technical skill:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed Creating Technical Skill',
            text: err.error.message,
          });
        },
      });
  }
  updateTechnicalSkill(): void {
    this.technicalSkillService.updateTechnicalSkill(this.editData).subscribe({
      next: (data) => {
        console.log(data);
        this.editVisible = false;
        Swal.fire({
          icon: 'success',
          title: 'Technical skill updated!',
        });
        this.getAllTechnicalSkills();
      },
      error: (err) => {
        console.error('Error updating technical skill:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed Updating Technical Skill',
          text: err.error.message,
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
        this.technicalSkillService.deleteTechnicalSkill(key).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              title: 'Technical Skill deleted!',
              icon: 'success',
              text: data.message,
            });
            console.log('Data deleted successfully');
            this.getAllTechnicalSkills();
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
