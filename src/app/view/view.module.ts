import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewRoutingModule } from './view-routing.module';
//import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuardService } from '../services/auth-guard.service';
//import { SharedModule } from '../shared/shared/shared.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DescriptionDialogBoxComponent } from './dialogbox/description-dialog-box/description-dialog-box.component';
import { AvatarModule } from "ngx-avatar";
//import { MatTreeModule } from '@angular/material/tree';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomPdfDownloadBoxComponent } from './dialogbox/custom-pdf-download-box/custom-pdf-download-box.component';
import { MonitoringDialogBoxComponent } from './dialogbox/monitoring-dialog-box/monitoring-dialog-box.component';
import { MonitoringPermissionDialogboxComponent } from './dialogbox/monitoring-permission-dialogbox/monitoring-permission-dialogbox.component';
import { MonitoringTypePermissionComponent } from './dialogbox/monitoring-type-permission/monitoring-type-permission.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';




@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    DescriptionDialogBoxComponent,
    CustomPdfDownloadBoxComponent,
    MonitoringDialogBoxComponent,
    MonitoringPermissionDialogboxComponent,
    MonitoringTypePermissionComponent

  ],
  imports: [
    CommonModule,
    ViewRoutingModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatTreeModule,
    NgSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule

    // AvatarModule,
    //SharedModule
  ],
  providers: [
    AuthGuardService,
  ],
  exports: []
})
export class ViewModule { }
