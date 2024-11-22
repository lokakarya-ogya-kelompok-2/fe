import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-hr-page',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './manage-page.component.html',
  styleUrl: './manage-page.component.scss',
})
export class ManageComponent {}
