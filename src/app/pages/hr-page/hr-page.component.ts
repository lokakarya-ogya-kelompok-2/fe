import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-hr-page',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './hr-page.component.html',
  styleUrl: './hr-page.component.scss',
})
export class HrPageComponent {}
