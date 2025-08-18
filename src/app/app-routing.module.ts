import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/authentication/login/login.component';
import { ForgotPasswordComponent } from './view/authentication/forgot-password/forgot-password.component';
import { DashboardComponent } from './view/dashboard/dashboard/dashboard.component';
import { HeaderComponent } from './view/header/header.component';
import { authguard } from './guard/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'MIS',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
    canActivate: [authguard],
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
