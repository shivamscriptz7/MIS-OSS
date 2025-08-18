import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select'
import { DeleteDialogBoxComponent } from 'src/app/view/dialogbox/delete-dialog-box/delete-dialog-box.component';
import { StatusChangeDialogBoxComponent } from 'src/app/view/dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTooltipModule } from '@angular/material/tooltip'





@NgModule({
  declarations: [
    DeleteDialogBoxComponent,
    StatusChangeDialogBoxComponent,
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatDialogModule,
    MatSelectModule,
    MatSelectFilterModule,
    MatFormFieldModule,
    PdfJsViewerModule,
    MatTooltipModule




  ],
  exports: [DataTablesModule, MatSelectModule, MatSelectFilterModule],
})
export class SharedModule { }