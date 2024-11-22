import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
// import { AuthGuard } from './guards/auth-guard.guard';
import { BrowserModule } from '@angular/platform-browser';
import { HrPageComponent } from './pages/hr-page/hr-page.component';
import { ManageDivisionComponent } from './pages/manage-division/manage-division.component';
import { ManageGroupAttitudeSkillComponent } from './pages/manage-group-attitude-skill/manage-group-attitude-skill.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'main', component: MainPageComponent },
  { path: 'menu', component: MenuPageComponent },
  {
    path: 'hr',
    component: HrPageComponent,
    children: [
      { path: 'manage-divisions', component: ManageDivisionComponent },
      {
        path: 'manage-group-attitude-skills',
        component: ManageGroupAttitudeSkillComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule, RouterModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
