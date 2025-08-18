import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Regex } from 'src/app/shared/regex';

@Component({
  selector: 'app-delete-dialog-box',
  templateUrl: './delete-dialog-box.component.html',
  styleUrls: ['./delete-dialog-box.component.scss']
})
export class DeleteDialogBoxComponent implements OnInit {

  deleteForm: FormGroup;
  reason: string = '';
  constructor(public fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteDialogBoxComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.deleteForm = this.fb.group({
      reason: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(Regex.descValidation)]]
    }),
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }
  // use for delete control form.
  get deleteControls() {
    return this.deleteForm.controls;
  }

  // submit delete button 
  onSubmit() {
    if (this.deleteForm.valid) {

      this.dialogRef.close({ "reason": this.deleteForm.value.reason });
    }
    else {

    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
