import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisreportRoutingModule } from './misreport-routing.module';
import { ReportComponent } from '../misreport/report/report.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportSlaExcelService } from 'src/app/services/export-sla-excel.service';
//import { SharedModule } from 'src/app/shared/shared/shared.module';
import { CommonService } from 'src/app/services/common.service';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectFilterModule } from 'mat-select-filter';






@NgModule({
  declarations: [
    ReportComponent,

  ],
  imports: [

    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    PdfJsViewerModule,
    MisreportRoutingModule,
    DpDatePickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectFilterModule,
    // SharedModule
    //NgxLoadingModule,
  ],
  //providers: [HttpClient, ExportSlaExcelService, CommonService],
  // providers: [],
  exports: [],
})
export class MisreportModule { }
