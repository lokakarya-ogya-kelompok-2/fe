import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ManageGroupAttitudeSkillService } from '../services/manage-group-attitude-skill.service';

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
    NavbarComponent,
  ],
  providers: [
    ManageGroupAttitudeSkillService,
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './manage-group-attitude-skill.component.html',
  styleUrl: './manage-group-attitude-skill.component.scss',
})
export class ManageGroupAttitudeSkillComponent {
  datas: any[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  constructor(
    private manageGroupAttitudeSkillService: ManageGroupAttitudeSkillService,
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
    this.manageGroupAttitudeSkillService.getGroupAttitudeSkillss().subscribe({
      next: (data) => {
        this.datas = data.content;
        this.loading = false;
        console.log('Data fetched:', data.content);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  showDialog() {
    this.visible = true;
  }
  showEditDialog() {
    this.editVisible = true;
  }

  confirm2(event: Event, key: string) {
    console.log('masuk');
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
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
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
}
