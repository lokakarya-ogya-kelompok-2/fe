import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AttitudeSkillComponent } from './features/attitude-skill/components/attitude-skill.component';
import { LoginComponent } from './features/auth/login/components/login.component';
import { ManageDivisionComponent } from './features/divisions/components/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './features/group-attitude-skill/components/manage-group-attitude-skill.component';
import { IndexPageComponent } from './features/index/components/index-page.component';
import { ManageComponent } from './features/manage/components/manage-page.component';
import { MainPageComponent as MenuComponent } from './features/menu/components/main-page.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
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
