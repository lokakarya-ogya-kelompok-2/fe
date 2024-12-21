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
import { EmployeeAssessmentsComponent } from './features/employee-assessments/employee-assessments.component';
import { GroupAchievementComponent } from './features/group-achievement/components/group-achievement/group-achievement.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { RoleMenuComponent } from './features/role-menu/components/role-menu/role-menu.component';
import { MySummaryComponent } from './features/sum/components/my-summary/my-summary.component';
import { SummariesComponent } from './features/sum/components/summaries/summaries.component';
import { TechnicalSkillComponent } from './features/technical-skill/components/technical-skill/technical-skill.component';
import { UserManageComponent } from './features/users/components/user-manage/user-manage.component';
import { UsersReadComponent } from './features/users/components/users-read/users-read.component';
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
    path: 'manage-users',
    component: UserManageComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['user#all'],
    },
  },
  {
    path: 'users',
    component: UsersReadComponent,
    // canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['user#read'],
    },
  },
  {
    path: 'manage-group-attitude-skills',
    component: ManageGroupAttitudeSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['group-attitude-skill#all'],
    },
  },
  {
    path: 'manage-attitude-skills',
    component: AttitudeSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['attitude-skill#all'],
    },
  },
  {
    path: 'manage-divisions',
    component: ManageDivisionComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['division#all'],
    },
  },
  {
    path: 'manage-achievements',
    component: AchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['achievement#all'],
    },
  },
  {
    path: 'manage-group-achievements',
    component: GroupAchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['group-achievement#all'],
    },
  },
  {
    path: 'manage-dev-plans',
    component: DevPlanComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['dev-plan#all'],
    },
  },
  {
    path: 'manage-technical-skills',
    component: TechnicalSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['technical-skill#all'],
    },
  },
  {
    path: 'manage-emp-achievements',
    component: EmpAchievementComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['emp-achievement#all'],
    },
  },
  {
    path: 'my-summary',
    component: MySummaryComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['summary#read.self'],
    },
  },
  {
    path: 'summaries',
    component: SummariesComponent,
    // canActivate: [authGuard, roleMenuGuard],
    // data: {
    //   permission: 'summary#read',
    // },
  },
  {
    path: 'manage-role-menu',
    component: RoleMenuComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: 'role-menu#all',
    },
  },
  {
    path: 'emp-technical-skill',
    component: EmpTechnicalSkillComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['emp-technical-skill#all'],
    },
  },
  {
    path: 'emp-attitude-skills',
    component: EmpAttitudeSkillsComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['emp-attitude-skill#all'],
    },
  },
  {
    path: 'emp-dev-plans',
    component: EmpDevPlanComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: ['emp-dev-plan#all'],
    },
  },
  {
    path: 'employee-assessments',
    component: EmployeeAssessmentsComponent,
    canActivate: [authGuard, roleMenuGuard],
    data: {
      permissions: [
        'emp-attitude-skill#all',
        'emp-technical-skill#all',
        'emp-dev-plan#all',
        'summary#read.self',
        'emp-suggestion#all',
      ],
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
