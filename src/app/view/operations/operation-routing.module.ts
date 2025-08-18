import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListingComponent } from './report-listing/report-listing.component';
import { scheduled } from 'rxjs';
import { ScheduleComponent } from './schedule/schedule.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { MonitoringListingComponent } from './monitoring-listing/monitoring-listing.component';


const routes: Routes = [

  {
    path: 'report-creation',
    component: ReportListingComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },

  {
    path: 'monitoring',
    component: MonitoringComponent
  },
  {
    path: 'audit-trail',
    component: AuditTrailComponent
  },

  // {
  //   //MonitoringListingComponent
  //   path: 'step-monitoring',
  //   component: MonitoringComponent
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
