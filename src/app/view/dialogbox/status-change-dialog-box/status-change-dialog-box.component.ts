import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-status-change-dialog-box',
  templateUrl: './status-change-dialog-box.component.html',
  styleUrls: ['./status-change-dialog-box.component.scss']
})
export class StatusChangeDialogBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StatusChangeDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {dialogRef.disableClose = true;   }
    

  ngOnInit(): void {

  }

  onSubmit() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
