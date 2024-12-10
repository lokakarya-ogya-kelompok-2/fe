import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SummaryItem } from '../../models/summary';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data, ' INI DATA');
  }
  @Input() data: SummaryItem[] = [];
  @Input() tableHeader: string = '';
}
