import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { AchievementComponent } from './features/achievement/components/achievement/achievement.component';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { DevPlanComponent } from './features/dev-plan/components/dev-plan/dev-plan.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { EmpAchievementComponent } from './features/emp-achievement/components/emp-achievement/emp-achievement.component';
import { EmpDevPlanComponent } from './features/emp/emp-dev-plan/components/emp-dev-plan/emp-dev-plan.component';
import { GroupAchievementComponent } from './features/group-achievement/components/group-achievement/group-achievement.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { RoleMenuComponent } from './features/role-menu/components/role-menu/role-menu.component';
import { SummaryComponent } from './features/summary/components/summary/summary.component';
import { TechnicalSkillComponent } from './features/technical-skill/components/technical-skill/technical-skill.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
  },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'emp-dev-plan', component: EmpDevPlanComponent },
  { path: 'manage-users', component: UserListComponent },
  {
    path: 'manage-group-attitude-skills',
    component: ManageGroupAttitudeSkillComponent,
  },
  {
    path: 'manage-attitude-skills',
    component: AttitudeSkillComponent,
  },
  {
    path: 'manage-divisions',
    component: ManageDivisionComponent,
  },
  {
    path: 'manage-achievements',
    component: AchievementComponent,
  },
  {
    path: 'manage-group-achievements',
    component: GroupAchievementComponent,
  },
  {
    path: 'manage-dev-plans',
    component: DevPlanComponent,
  },
  {
    path: 'manage-technical-skills',
    component: TechnicalSkillComponent,
  },
  {
    path: 'manage-emp-achievements',
    component: EmpAchievementComponent,
  },
  {
    path: 'manage-summaries',
    component: SummaryComponent,
  },
  {
    path: 'manage-role-menu',
    component: RoleMenuComponent,
  },
  // {
  //   path: 'manage',
  //   component: ManageComponent,
  //   canActivate: [authGuard],
  //   children: [],
  // },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
