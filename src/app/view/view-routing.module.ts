import { UserModule } from './user_management/user.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { authguard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    canActivate: [authguard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule),
        canActivate: [authguard],

      },
      {
        path: 'user',
        loadChildren: () => import('./user_management/user.module').then((mod) => mod.UserModule),
        canActivate: [authguard],
      },

      {
        path: 'slr',
        loadChildren: () => import('./misreport/misreport.module').then((mod) => mod.MisreportModule),
        canActivate: [authguard],
        // canActivate: [authguard],

      },
      // {
      //   path: 'slr_associated',
      //   loadChildren: () => import('./misreport/misreport.module').then((mod) => mod.MisreportModule),
      //   canActivate: [authguard],
      //   // canActivate: [authguard],

      // },
      {
        path: 'role',
        loadChildren: () => import('./master-forms/master.module').then((mod) => mod.RoleModule),
        canActivate: [authguard],
      },
      {
        path: 'operation',
        loadChildren: () => import('./operations/operation.module').then((mod) => mod.OperationModule),
        canActivate: [authguard],
      },
      // {
      //   path: ':param',
      //   loadChildren: () => import('./BSS-Report/billing-report.module').then((mod) => mod.BillingReportModule),
      //   canActivate: [authguard],
      // },
      {
        path: 'Reports',
        loadChildren: () => import('./BSS-Report/billing-report.module').then((mod) => mod.BillingReportModule),
        canActivate: [authguard],
      },
      {
        path: 'slr_reports',
        loadChildren: () => import('./misreport/misreport.module').then((mod) => mod.MisreportModule),
        canActivate: [authguard],
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
