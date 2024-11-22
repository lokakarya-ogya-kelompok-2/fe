import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { LoginComponent } from './features/auth/login/components/login.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
export const routes: Routes = [
  { path: '', component: IndexPageComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  {
    path: 'manage',
    // component: ManageComponent,
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
