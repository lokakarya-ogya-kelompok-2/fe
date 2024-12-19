import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { Summary } from '../../models/summary';
import { SummaryService } from '../../services/summary.service';
import { SummaryAndSuggestionsComponent } from '../summary-and-suggestions/summary-and-suggestions.component';

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
    MultiSelectModule,
  ],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
})
export class SummariesComponent implements OnInit {
  summaries: Summary[] = [];
  divisionNames: string[] = [];
  years: number[] = [];
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {} as User;
  selectedYear: number = new Date().getFullYear();
  isSuggestionsLoading: boolean = false;
  value: any[] = [];
  currentUser: User = {} as User;
  constructor(
    private readonly summaryService: SummaryService,
    private readonly userSvc: UserService,
    private readonly tokenSvc: TokenService
  ) {}

  ngOnInit(): void {
    const tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.userSvc.getById(tokenPayload.sub!).subscribe({
      next: (data) => {
        this.currentUser = data.content;
      },
      error: (err) => {
        console.error('Failed to gget current user: ', err);
      },
      complete: () => {
        this.loadSummary();
      },
    });
  }

  loadSummary() {
    this.isLoading = true;
    let filter = {};
    if (!this.currentUser.roles?.some((role) => role.role_name == 'HR')) {
      filter = {
        division_ids: [this.currentUser.division!.id],
      };
    }
    this.summaryService.getAllSummary(filter).subscribe({
      next: (data) => {
        this.summaries = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching summaries:', err);
      },
      complete: () => {
        this.divisionNames = [
          ...new Set(
            this.summaries
              .map((summary) => summary.user_id.division?.division_name)
              .filter((name) => name != null)
          ),
        ].sort();
        this.years = [
          ...new Set(this.summaries.map((summary) => summary.year)),
        ].sort();
        console.log(this.summaries, 'INI DATA SUMMARY');
      },
    });
  }

  showDialog(user: User, year: number) {
    this.visible = true;
    this.selectedUser = user;
    this.selectedYear = year;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
