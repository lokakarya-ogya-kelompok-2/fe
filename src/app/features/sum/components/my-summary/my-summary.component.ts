import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-my-summary',
  standalone: true,
  imports: [TableComponent, NavbarComponent, UserInformationComponent],
  templateUrl: './my-summary.component.html',
  styleUrl: './my-summary.component.scss',
})
export class MySummaryComponent {}
