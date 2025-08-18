import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Regex } from 'src/app/shared/regex';

@Component({
  selector: 'app-add-update-user-role',
  templateUrl: './add-update-user-role.component.html',
  styleUrls: ['./add-update-user-role.component.scss']
})
export class AddUpdateUserRoleComponent implements OnInit {

  public userRoleForm: FormGroup;
  public buttonName = 'Submit'
  public title = 'Create Role'
  public role_id = '';
  public inputValue: string = '';


  constructor(public fb: FormBuilder,
    public service: CommonService,
    public route: Router,
    public dialogRef: MatDialogRef<AddUpdateUserRoleComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.userRoleForm = this.fb.group({
      role_id: [""],
      role_name: ["", [Validators.required, Validators.maxLength(25), Validators.pattern(Regex.spaceValidations)]],
      role_desc: ['', [Validators.maxLength(50), Validators.pattern(Regex.descValidation)]],
    })
  }

  ngOnInit(): void {
    // use for update 
    if (this.data.details != '')
    // if data is not empty then condition is true, and execute.
    {
      this.buttonName = "Update"
      this.title = "Update Role"
      this.userRoleForm.patchValue({
        role_name: this.data.details.ROLE_NAME,
        role_desc: this.data.details.ROLE_DESC,
        role_id: this.data.details.ROLE_ID
      })
    }
  }

  // using form controls
  get userRoleFormcontrol() {
    return this.userRoleForm.controls;
  }

  // submit form
  userRoleFormSubmit() {
    if (this.userRoleForm.valid) {
      try {
        const data = this.userRoleForm.value;

        let object = {
          data: data,
          //prevData:this.data.details
        }

        this.service.postAPIMethod(`/addUpdateRole`, object).subscribe(
          (response: any) => {
            if (response?.result[0].ERR == 'X') {
              this.service.sweetAlertMsg('error', response.result[0].MSG);
            }
            else {
              this.service.sweetAlertMsg('success', response.result[0].MSG);
              this.dialogRef.close(true);
            }
          }
        )
      }
      catch (error) {
        this.service.sweetAlertMsg('error', error);
      }
    }
    else {

    }

  }
  // user for reset role form value
  resetForm() {
    this.userRoleForm.patchValue({
      role_name: this.data.details.ROLE_NAME,
      role_desc: this.data.details.ROLE_DESC,
    })
    this.userRoleForm.markAsUntouched();
    this.userRoleForm.markAsPristine();
  }
}
