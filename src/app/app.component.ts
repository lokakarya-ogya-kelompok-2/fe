import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ManageDivisionComponent } from './pages/manage-division/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './pages/manage-group-attitude-skill/manage-group-attitude-skill.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginPageComponent,
    IndexPageComponent,
    MainPageComponent,
    ManageDivisionComponent,
    ManageGroupAttitudeSkillComponent,
    MenuPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fe';
}
