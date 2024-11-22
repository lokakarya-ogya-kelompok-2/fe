import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/login/components/login.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { MainPageComponent } from './features/menu/components/main-page.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    IndexPageComponent,
    MainPageComponent,
    ManageDivisionComponent,
    ManageGroupAttitudeSkillComponent,
    MainPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fe';
}
