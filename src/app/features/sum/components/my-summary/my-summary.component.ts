import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-my-summary',
  standalone: true,
  imports: [NavbarComponent, SummaryComponent],
  templateUrl: './my-summary.component.html',
  styleUrl: './my-summary.component.scss',
})
export class MySummaryComponent implements OnInit {
  userId: string = '';

  constructor(private readonly tokenSvc: TokenService) {}

  ngOnInit(): void {
    const tokenPayload = this.tokenSvc.decodeToken(this.tokenSvc.getToken()!);
    this.userId = tokenPayload.sub!;
  }
}
