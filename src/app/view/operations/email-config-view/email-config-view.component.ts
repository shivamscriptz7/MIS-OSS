import { Component, OnInit, Inject, Injectable, } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-config-view',
  templateUrl: './email-config-view.component.html',
  styleUrls: ['./email-config-view.component.scss']
})
export class EmailConfigViewComponent implements OnInit {

  public reportNameArr:any;
  public emailArr:any;

  constructor(
    public dialogRef: MatDialogRef<EmailConfigViewComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    //public data: any,

  ) { }

  ngOnInit(): void {
    this.reportNameArr = this.data.details.REPORT_NAME.split(',');
    this.emailArr = this.data.details.EMAIL.split(',');
    //console.log(abc, "lllll")
  }

  public closeUserDialogRef() {
    this.dialogRef.close(false);
  }

}
