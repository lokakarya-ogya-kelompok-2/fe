import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AchievementComponent } from './features/achievement/components/achievement/achievement.component';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { DevPlanComponent } from './features/dev-plan/components/dev-plan/dev-plan.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { GroupAchievementComponent } from './features/group-achievement/components/group-achievement/group-achievement.component';
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
    AttitudeSkillComponent,
    AchievementComponent,
    GroupAchievementComponent,
    DevPlanComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fe';
}
