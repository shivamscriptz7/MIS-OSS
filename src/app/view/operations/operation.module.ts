import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReportCreationComponent } from './report-creation/report-creation.component';

import { OperationRoutingModule } from './operation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { UserRoutingModule } from '../user_management/user-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ReportListingComponent } from './report-listing/report-listing.component';


// tree
// import { BrowserModule } from '@angular/platform-browser';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { TreeNgxModule } from 'tree-ngx';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ScheduleComponent } from './schedule/schedule.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';
import { MatChipsModule } from '@angular/material/chips';
// import { UserMonitoringComponent } from './monitoring/user-monitoring/user-monitoring/user-monitoring.component';
// import { RoleMonitoringComponent } from './monitoring/user-monitoring/role-monitoring/role-monitoring.component';
// import { PermissionMonitoringComponent } from './monitoring/user-monitoring/permission-monitoring/permission-monitoring.component';
// import { ReportMonitoringComponent } from './monitoring/user-monitoring/report-monitoring/report-monitoring.component';
// import { ScheduleMonitoringComponent } from './monitoring/user-monitoring/schedule-monitoring/schedule-monitoring.component';
import { UserMonitoringComponent } from './audit-trail/user-monitoring/user-monitoring.component';
import { RoleMonitoringComponent } from './audit-trail/role-monitoring/role-monitoring.component';
import { PermissionMonitoringComponent } from './audit-trail/permission-monitoring/permission-monitoring.component';
import { ReportMonitoringComponent } from './audit-trail/report-monitoring/report-monitoring.component';
import { ScheduleMonitoringComponent } from './audit-trail/schedule-monitoring/schedule-monitoring.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { EmailConfigViewComponent } from './email-config-view/email-config-view.component';
// import { EmailConfigMonitoringComponent } from './monitoring/user-monitoring/email-config-monitoring/email-config-monitoring.component';
import { EmailConfigMonitoringComponent } from './audit-trail/email-config-monitoring/email-config-monitoring.component';
import { MonitoringCreationComponent } from './monitoring-creation/monitoring-creation.component';
import { ProcessMonitoringComponent } from './audit-trail/process-monitoring/process-monitoring.component';
import { MonitoringListingComponent } from './monitoring-listing/monitoring-listing.component';
import { MonitoringGraphViewComponent } from './monitoring-graph-view/monitoring-graph-view.component';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [
    ReportCreationComponent,
    ReportListingComponent,
    ScheduleComponent,
    MonitoringComponent,
    ScheduleCreateComponent,
    UserMonitoringComponent,
    RoleMonitoringComponent,
    PermissionMonitoringComponent,
    ReportMonitoringComponent,
    ScheduleMonitoringComponent,
    EmailConfigurationComponent,
    AuditTrailComponent,
    EmailConfigViewComponent,
    EmailConfigMonitoringComponent,
    MonitoringCreationComponent,
    ProcessMonitoringComponent,
    MonitoringListingComponent,
    MonitoringGraphViewComponent

  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DpDatePickerModule,
    HttpClientModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSelectModule, UserRoutingModule, FormsModule,
    // BrowserModule,
    MatTreeModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatAutocompleteModule,
    NgSelectModule,
    MatChipsModule,
    MatTooltipModule

  ],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class OperationModule { }
