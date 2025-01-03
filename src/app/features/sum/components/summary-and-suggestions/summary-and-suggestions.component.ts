import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EmpSuggestion } from '../../models/emp-suggestion';
import { EmpSuggestionService } from '../../services/emp-suggestion.service';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-summary-and-suggestions',
  standalone: true,
  imports: [SummaryComponent, TableModule],
  templateUrl: './summary-and-suggestions.component.html',
  styleUrl: './summary-and-suggestions.component.scss',
})
export class SummaryAndSuggestionsComponent implements OnChanges {
  @Input() userId: string | undefined = '';
  @Input() editableAndAllowApprove: boolean = false;
  @Input() year: number | undefined = 0;

  suggestions: EmpSuggestion[] = [];
  isLoading: boolean = false;

  constructor(private readonly suggestionSvc: EmpSuggestionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] || changes['year']) {
      this.isLoading = true;
      this.suggestionSvc
        .list({
          user_ids: [this.userId!],
          years: [this.year!],
        })
        .subscribe({
          next: (data) => {
            this.suggestions = data.content;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to fetch emp suggestions: ', err);
            this.isLoading = false;
          },
        });
    }
  }
}
