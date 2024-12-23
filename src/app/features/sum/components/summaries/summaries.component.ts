import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterMetadata } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  Table,
  TableLazyLoadEvent,
  TableModule,
  TablePageEvent,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Response } from '../../../../shared/models/response';
import { Direction } from '../../../../shared/types';
import { Division } from '../../../divisions/models/division';
import { ManageDivisionService } from '../../../divisions/services/manage-division.service';
import { User } from '../../../users/models/user';
import { UserService } from '../../../users/services/user.service';
import { Summary, SummaryQueryParam } from '../../models/summary';
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
  data: Response<Summary[]> = {} as Response<Summary[]>;
  divisions: Division[] = [];
  years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year;
  });
  isLoading: boolean = true;
  visible: boolean = false;
  dialogHeader: string = '';
  selectedUser: User = {} as User;
  selectedYear: number = new Date().getFullYear();
  isSuggestionsLoading: boolean = false;
  selectedDivisions: Division[] = [];
  currentUser: User = {} as User;
  first = 0;
  rows = 5;
  searchQuery = '';

  isHR: boolean = false;

  constructor(
    private readonly summaryService: SummaryService,
    private readonly userSvc: UserService,
    private readonly tokenSvc: TokenService,
    private readonly divisionSvc: ManageDivisionService
  ) {}

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
  }

  async ngOnInit(): Promise<void> {
    const tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    let data = await firstValueFrom(this.userSvc.getById(tokenPayload.sub!));
    try {
      this.currentUser = data.content;
      this.isHR = this.currentUser.roles.some(
        (role) => role.role_name.toLowerCase() == 'hr'
      );
    } catch (err) {
      console.error('Failed to get current user: ', err);
    }
    if (this.isHR) {
      let data = await firstValueFrom(this.divisionSvc.getAllDivisions());
      try {
        this.divisions = data.content;
      } catch (err) {
        console.error('Failed to get divisions: ', err);
      }
    }
  }

  async getAssessmentSummaries(event: TableLazyLoadEvent) {
    await this.ngOnInit();
    this.isLoading = true;
    let filter = {
      any_contains: event.globalFilter,
      years: [(event.filters?.['year'] as FilterMetadata)?.value],
      page_number: (event?.first || 0) / (event?.rows || 5) + 1,
      page_size: event?.rows || 5,
      sort_field: (event.sortField as string) || 'createdAt',
      sort_direction:
        event.sortField == undefined
          ? Direction.DESC
          : event.sortOrder == 1
          ? Direction.ASC
          : Direction.DESC,
    } as SummaryQueryParam;
    if (!this.isHR) {
      filter = {
        ...filter,
        division_ids: [this.currentUser.division!.id],
      };
    } else {
      filter = {
        ...filter,
        division_ids: (event.filters?.['division_ids'] as FilterMetadata)
          ?.value,
      };
    }
    this.summaryService.getAllSummary(filter).subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching summaries:', err);
        Swal.fire({
          title: 'Failed to fetch summaries',
          icon: 'error',
        });
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
