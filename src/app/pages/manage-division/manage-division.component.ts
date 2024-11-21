import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ManageDivisionService } from '../../manage-division.service';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
// import { Customer, Representative } from '@domain/customer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-manage-division',
  standalone: true,
  imports: [CommonModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule, ButtonModule, DialogModule,ConfirmDialogModule, ToastModule],
  providers: [ManageDivisionService],
  templateUrl: './manage-division.component.html',
  styleUrl: './manage-division.component.scss'
})

export class ManageDivisionComponent implements OnInit{
posts:any[]=[]
loading: boolean = true;
visible: boolean = false;
editVisible: boolean = false;
constructor(private manageDivisionService: ManageDivisionService) {}

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
showEditDialog(){
  this.editVisible = true;
}

// confirm2(event: Event) {
//   this.manageDivisionService.confirm({
//       target: event.target as EventTarget,
//       message: 'Do you want to delete this record?',
//       header: 'Delete Confirmation',
//       icon: 'pi pi-info-circle',
//       acceptButtonStyleClass:"p-button-danger p-button-text",
//       rejectButtonStyleClass:"p-button-text p-button-text",
//       acceptIcon:"none",
//       rejectIcon:"none",

//       accept: () => {
//           this.manageDivisionService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
//       },
//       reject: () => {
//           this.manageDivisionService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
//       }
//   });
//   }
}
