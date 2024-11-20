import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
// import { AuthGuard } from './guards/auth-guard.guard';
import { BrowserModule } from '@angular/platform-browser';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { ManageDivisionComponent } from './pages/manage-division/manage-division.component';
export const routes: Routes = [
    {path:'', component: IndexPageComponent},
    {path:'login', component: LoginPageComponent},
    {path:'main', component: MainPageComponent},
    {path:'menu', component: MenuPageComponent},
    {path:'manage-divisions', component: ManageDivisionComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes), BrowserModule, RouterModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
