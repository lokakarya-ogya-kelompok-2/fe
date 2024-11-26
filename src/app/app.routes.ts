import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { ManageComponent } from './features/manage/components/manage-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: UserListComponent },
      {
        path: 'group-attitude-skills',
        component: ManageGroupAttitudeSkillComponent,
      },
      {
        path: 'attitude-skills',
        component: AttitudeSkillComponent,
      },
      {
        path: 'divisions',
        component: ManageDivisionComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
