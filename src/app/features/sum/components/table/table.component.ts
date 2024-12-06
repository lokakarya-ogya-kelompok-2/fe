import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

interface TableData {
  aspek: string;
  nilai: number;
  bobot: number;
  nilaiAkhir: number;
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  data: TableData[] = [
    {
      aspek: 'Project',
      nilai: 85,
      bobot: 10,
      nilaiAkhir: 17,
    },
    {
      aspek: 'Sertifikasi',
      nilai: 90,
      bobot: 30,
      nilaiAkhir: 27,
    },
    {
      aspek: 'Training',
      nilai: 78,
      bobot: 20,
      nilaiAkhir: 15.6,
    },
  ];
}
