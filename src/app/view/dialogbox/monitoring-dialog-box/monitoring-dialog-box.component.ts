import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-monitoring-dialog-box',
  templateUrl: './monitoring-dialog-box.component.html',
  styleUrls: ['./monitoring-dialog-box.component.scss']
})
export class MonitoringDialogBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MonitoringDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public service: CommonService) { dialogRef.disableClose = true; }

  ngOnInit(): void {
  }
  pdfData: any = this.data?.changesData;
  @Output() sendData = new EventEmitter<any>();

  dialogClose() {
    this.dialogRef.close();
  }

  public logPdfDownLoad() {
   
    this.service.generatePDF(this.data.title);
  }




}
