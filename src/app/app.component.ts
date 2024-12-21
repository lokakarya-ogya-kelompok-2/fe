import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AchievementComponent } from './features/achievement/components/achievement/achievement.component';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { DevPlanComponent } from './features/dev-plan/components/dev-plan/dev-plan.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { EmpAchievementComponent } from './features/emp-achievement/components/emp-achievement/emp-achievement.component';
import { EmpAttitudeSkillsComponent } from './features/emp/emp-attitude-skill/components/emp-attitude-skills/emp-attitude-skills.component';
import { EmpDevPlanComponent } from './features/emp/emp-dev-plan/components/emp-dev-plan/emp-dev-plan.component';
import { EmployeeAssessmentsComponent } from './features/employee-assessments/employee-assessments.component';
import { GroupAchievementComponent } from './features/group-achievement/components/group-achievement/group-achievement.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { MainPageComponent } from './features/menu/components/main-page.component';
import { RoleMenuComponent } from './features/role-menu/components/role-menu/role-menu.component';
import { MySummaryComponent } from './features/sum/components/my-summary/my-summary.component';
import { SummariesComponent } from './features/sum/components/summaries/summaries.component';
import { SummaryComponent } from './features/sum/components/summary/summary.component';
import { TechnicalSkillComponent } from './features/technical-skill/components/technical-skill/technical-skill.component';

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
    TechnicalSkillComponent,
    EmpAchievementComponent,
    SummaryComponent,
    RoleMenuComponent,
    EmpAttitudeSkillsComponent,
    EmpDevPlanComponent,
    SummariesComponent,
    MySummaryComponent,
    RouterModule,
    EmployeeAssessmentsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fe';
}
