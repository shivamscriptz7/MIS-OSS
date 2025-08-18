import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingReportComponent } from './billing-report/billing-report.component';

const routes: Routes = [{
  path: ':param',
  component: BillingReportComponent

}

  // {
  //   path: 'Prepaid',
  //   component: BillingReportComponent

  // },
  // {
  //   path: 'Mediation',
  //   component: BillingReportComponent

  // },
  // {
  //   path: 'ICB',
  //   component: BillingReportComponent

  // }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingReportRoutingModule { }
