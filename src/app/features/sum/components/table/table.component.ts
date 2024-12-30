import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { SummaryItem } from '../../models/summary';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, CommonModule, TreeTableModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() isScoreCategorical: boolean = false;
  @Input() data: SummaryItem[] = [];
  // files: any[] = [];
  expandedRows: { [key: string]: boolean } = {};
  @Input() tableHeader: string = '';

  ngOnInit() {
    if (this.data) {
      this.data.forEach((item) => {
        this.expandedRows[item.aspect] = false;
      });
    }
  }

  getScoreCategory(score: number): string {
    if (score >= 80 && score <= 100) return 'Excellent';
    if (score >= 60 && score < 80) return 'Good';
    if (score >= 40 && score < 60) return 'Fair';
    if (score >= 20 && score < 40) return 'Poor';
    return 'Very Poor';
  }

  stringify(obj: Object) {
    return JSON.stringify(obj);
  }
}
