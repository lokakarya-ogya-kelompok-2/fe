import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { ManageDivisionComponent } from './pages/manage-division/manage-division.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent, IndexPageComponent, MainPageComponent, MenuPageComponent, ManageDivisionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe';
}
