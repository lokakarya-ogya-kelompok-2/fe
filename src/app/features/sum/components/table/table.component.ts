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
  // ngOnInit() {
  //   // Mock data
  //   this.files = [
  //     {
  //       data: {
  //         // rowData
  //         key: '0',
  //         group_name: 'Group 1',
  //         percentage: 30,
  //         type: 'Group',
  //       },
  //       children: [
  //         {
  //           key: '0-0',
  //           group_name: 'Group group',
  //           percentage: 40,
  //           type: 'Group',
  //         },
  //       ], // rowNode.children
  //       expanded: false, // rowNode.expanded
  //       leaf: false, // rowNode.leaf
  //     },
  //   ];
  //   console.log(this.files);
  // }
}
