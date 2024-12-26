import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TokenService } from '../../../../core/services/token.service';
import { MenuService } from '../../../menus/services/menu.service';
import { SuggestionComponent } from '../suggestion/suggestion.component';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-my-summary',
  standalone: true,
  imports: [
    SummaryComponent,
    SuggestionComponent,
    CardModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './my-summary.component.html',
  styleUrl: './my-summary.component.scss',
})
export class MySummaryComponent implements OnInit {
  @Output() onYearChange = new EventEmitter<number>();
  userId: string = '';
  selectedYear: number = new Date().getFullYear();
  hasAccessToSuggestion: boolean = true;
  assessmentSummaryAvailable: boolean = true;
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year;
  });

  constructor(
    private readonly tokenSvc: TokenService,
    private readonly menuSvc: MenuService
  ) {}

  ngOnInit(): void {
    const tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.userId = tokenPayload.sub!;
    this.menuSvc.getMenuByUserId(this.userId).subscribe({
      next: (data) => {
        this.hasAccessToSuggestion = data.content.some(
          (menu) => menu.menu_name === 'emp-suggestion#all'
        );
      },
      error: (err) => {
        console.error('Error fetching user menu: ', err);
      },
    });
  }

  assSumAvail(val: boolean) {
    this.assessmentSummaryAvailable = val;
  }

  onChange(event: DropdownChangeEvent) {
    this.onYearChange.emit(event.value as number);
  }
}
