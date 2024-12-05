import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleMenuGuard } from './core/guards/role-menu.guard';
import { AchievementComponent } from './features/achievement/components/achievement/achievement.component';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { DevPlanComponent } from './features/dev-plan/components/dev-plan/dev-plan.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { EmpAchievementComponent } from './features/emp-achievement/components/emp-achievement/emp-achievement.component';
import { EmpAttitudeSkillsComponent } from './features/emp/emp-attitude-skill/components/emp-attitude-skills/emp-attitude-skills.component';
import { EmpDevPlanComponent } from './features/emp/emp-dev-plan/components/emp-dev-plan/emp-dev-plan.component';
import { EmpTechnicalSkillComponent } from './features/emp/emp-technical-skill/components/emp-technical-skill/emp-technical-skill.component';
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
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [authGuard],
  },
  {
    path: 'emp-dev-plans',
    component: EmpDevPlanComponent,
    // canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'emp-dev-plan#all',
    },
  },

  {
    path: 'manage-users',
    component: UserListComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'user#all',
    },
  },
  {
    path: 'manage-group-attitude-skills',
    component: ManageGroupAttitudeSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'group-attitude-skill#all',
    },
  },
  {
    path: 'manage-attitude-skills',
    component: AttitudeSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'attitude-skill#all',
    },
  },
  {
    path: 'manage-divisions',
    component: ManageDivisionComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'division#all',
    },
  },
  {
    path: 'manage-achievements',
    component: AchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'achievement#all',
    },
  },
  {
    path: 'manage-group-achievements',
    component: GroupAchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'group-achievement#all',
    },
  },
  {
    path: 'manage-dev-plans',
    component: DevPlanComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'dev-plan#all',
    },
  },
  {
    path: 'manage-technical-skills',
    component: TechnicalSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'technical-skill#all',
    },
  },
  {
    path: 'manage-emp-achievements',
    component: EmpAchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'emp-achievement#all',
    },
  },
  {
    path: 'manage-summaries',
    component: SummaryComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'summary#read',
    },
  },
  {
    path: 'manage-role-menu',
    component: RoleMenuComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'role-menu#all',
    },
  },
  {
    path: 'emp-technical-skill',
    component: EmpTechnicalSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'emp-technical-skill#all',
    },
  },
  {
    path: 'emp-attitude-skills',
    component: EmpAttitudeSkillsComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permission: 'emp-attitude-skill#all',
    },
  },
  // {
  //   path: 'manage',
  //   component: ManageComponent,
  //   canActivate: [authGuard],
  //   children: [],
  // },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
