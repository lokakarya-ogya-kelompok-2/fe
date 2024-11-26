import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { AchievementComponent } from './features/achievement/components/achievement/achievement.component';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { DevPlanComponent } from './features/dev-plan/components/dev-plan/dev-plan.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { EmpAchievementComponent } from './features/emp-achievement/components/emp-achievement/emp-achievement.component';
import { GroupAchievementComponent } from './features/group-achievement/components/group-achievement/group-achievement.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { ManageComponent } from './features/manage/components/manage-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { SummaryComponent } from './features/summary/components/summary/summary.component';
import { TechnicalSkillComponent } from './features/technical-skill/components/technical-skill/technical-skill.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  // , canActivate: [authGuard]
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      { path: '', component: ManageDivisionComponent },
      {
        path: 'group-attitude-skills',
        component: ManageGroupAttitudeSkillComponent,
      },
      {
        path: 'attitude-skills',
        component: AttitudeSkillComponent,
      },
      {
        path: 'achievements',
        component: AchievementComponent,
      },
      {
        path: 'group-achievements',
        component: GroupAchievementComponent,
      },
      {
        path: 'dev-plans',
        component: DevPlanComponent,
      },
      {
        path: 'technical-skills',
        component: TechnicalSkillComponent,
      },
      {
        path: 'emp-achievements',
        component: EmpAchievementComponent,
      },
      {
        path: 'summaries',
        component: SummaryComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule, RouterModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
