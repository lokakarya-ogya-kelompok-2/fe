import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NavbarComponent, UserInformationComponent, TableComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {}
