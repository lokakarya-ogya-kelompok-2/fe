import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { User } from '../../../users/models/user';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { SummaryAndSuggestionsComponent } from '../summary-and-suggestions/summary-and-suggestions.component';
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
    SummaryAndSuggestionsComponent,
    DropdownModule,
  ],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
})
export class SummariesComponent implements OnInit {
  summaries: Summary[] = [];
  divisions: any[] = [];
  years: yearOption[] = [];
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {} as User;
  selectedYear: number = new Date().getFullYear();
  isSuggestionsLoading: boolean = false;

  constructor(private readonly summaryService: SummaryService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.isLoading = true;
    this.summaryService.getAllSummary().subscribe({
      next: (data) => {
        this.summaries = data.content;
        this.isLoading = false;
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
