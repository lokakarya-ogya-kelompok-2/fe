import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Summary } from '../../models/summary';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: Summary[] = [];
  @Input() tableHeader: string = '';
}
