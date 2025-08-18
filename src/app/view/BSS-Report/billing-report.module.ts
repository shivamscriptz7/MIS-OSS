import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingReportRoutingModule } from './billing-report-routing.module';
import { BillingReportComponent } from './billing-report/billing-report.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    BillingReportComponent
  ],
  imports: [
    CommonModule,
    BillingReportRoutingModule,
    PdfJsViewerModule,
    DpDatePickerModule,
    FormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class BillingReportModule { }
