import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import console from 'console';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { DialogType } from '../../../../shared/types';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { SummaryComponent } from '../summary/summary.component';
interface yearOption {
  year: number;
}
@Component({
  selector: 'app-summaries',
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
    NavbarComponent,
    ChipModule,
    SummaryComponent,
    DropdownModule,
  ],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
})
export class SummariesComponent {
  summaries: Summary[] = [];
  divisions: any[] = [];
  years: yearOption[] = [];
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {} as User;
  selectedYear: number = new Date().getFullYear();
  dialogType = DialogType;
  currentDialogType: DialogType = DialogType.ADD;
  constructor(
    private readonly userSvc: UserService,
    private readonly summaryService: SummaryService
  ) {}

  loadSummary() {
    this.isLoading = true;
    this.summaryService.getAllSummary().subscribe({
      next: (data) => {
        this.summaries = data.content;
        this.isLoading = false;
        // console.log(this.summaries);
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
      complete: () => {
        this.divisions = Array.from(
          new Set(
            this.summaries
              .map((summary) => summary.user_id.division?.division_name)
              .filter((name) => name != null)
          )
        )
          .sort()
          .map((name) => ({ division_name: name }));

        // console.log('Unique divisions:', this.divisions);

        this.years = Array.from(
          new Set(
            this.summaries
              .map((summary) => summary?.year)
              .filter((year) => year != null)
          )
        )
          .sort()
          .map((year) => ({ year }));
        // console.log(this.years, 'ini yearsssssssssss');
      },
    });
  }

  showDialog(user: User, year: number) {
    this.visible = true;
    this.selectedUser = user;
    this.selectedYear = year;
    // console.log(userData);
    console.log('DIALOG VISIBLE: ', this.visible);
  }

  ngOnInit(): void {
    // this.loadUsers();
    this.loadSummary();
    // console.log(this.divisions);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
