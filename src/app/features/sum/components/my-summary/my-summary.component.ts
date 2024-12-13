import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { UserInformationComponent } from '../../../emp/user-information/components/user-information/user-information.component';
import { MenuService } from '../../../menus/services/menu.service';
import { SuggestionComponent } from '../suggestion/suggestion.component';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-my-summary',
  standalone: true,
  imports: [
    NavbarComponent,
    SummaryComponent,
    UserInformationComponent,
    SuggestionComponent,
    CardModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './my-summary.component.html',
  styleUrl: './my-summary.component.scss',
})
export class MySummaryComponent implements OnInit {
  userId: string = '';
  currentYear = new Date().getFullYear();
  selectedPeriod: any = null;
  hasAccessToSuggestion: boolean = true;
  years = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { name: year.toString(), value: year.toString() };
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
}
