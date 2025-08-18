import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-description-dialog-box',
  templateUrl: './description-dialog-box.component.html',
  styleUrls: ['./description-dialog-box.component.scss']
})
export class DescriptionDialogBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DescriptionDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ngxLoader: NgxUiLoaderService,
    public dialog: MatDialog) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    //console.log(this.data, "......YYYYYYY");
  }

  closePopUp() {
    this.dialogRef.close(false);
  }

}
