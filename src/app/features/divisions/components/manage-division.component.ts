import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
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
    NavbarComponent,
  ],
  providers: [ManageDivisionService, ConfirmationService, MessageService],
  templateUrl: './manage-division.component.html',
  styleUrl: './manage-division.component.scss',
})
export class ManageDivisionComponent implements OnInit {
  posts: any[] = [];
  loading: boolean = true;
  visible: boolean = false;
  editVisible: boolean = false;
  constructor(
    private manageDivisionService: ManageDivisionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.manageDivisionService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.content;
        this.loading = false;
        console.log('Data fetched:', data);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // modal
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
