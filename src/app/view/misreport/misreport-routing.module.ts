import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from '../misreport/report/report.component';


const routes: Routes = [{
  path: '',
  component: ReportComponent
},
{
  path: 'slr',
  component: ReportComponent

},
{
  path: 'slr_associated',
  component: ReportComponent

},
{
  path: 'roaming',
  component: ReportComponent

},
{
  path: 'payments',
  component: ReportComponent

},
{
  path: 'deposits',
  component: ReportComponent

},
{
  path: 'gst',
  component: ReportComponent

},
{
  path: 'others',
  component: ReportComponent

}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisreportRoutingModule { }
