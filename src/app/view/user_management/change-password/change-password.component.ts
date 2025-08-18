import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from 'src/app/shared/password.mustmatch';
import { CommonService } from 'src/app/services/common.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public isCurrentPassword: boolean = false;
  public isNewPassword: boolean = false;
  public isConfirmPassword: boolean = false;

  public userDetails: any;
  public userId: any;



  public passwordObj: any = {};
  passwordValidatorRegex: any = {
    lowerCase: /(?=.*[a-z])/,
    upperCase: /(?=.*[A-Z])/,
    minimunSeven: /(?=.{8,15})/,
    oneNumber: /(?=.*[0-9])/,
    specialCharacter: /(?=.*[$@$#!%*?&^*])/
  };

  constructor(public service: CommonService, public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public fb: FormBuilder, public route: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,15}$/)]],
      confirmPassword: ['', [Validators.required]],

    },
      { validators: MustMatch('newPassword', 'confirmPassword') }
    )
    dialogRef.disableClose = true;
  }



  ngOnInit(): void {

    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);
    this.userId = this.userDetails.USER_ID;

  }

  // used for password validations
  ngAfterViewInit() {
    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe(text => {
      Object.keys(this.passwordValidatorRegex).forEach(key => {
        this.passwordObj[key] = this.passwordValidatorRegex[key].test(text)
      })
    });
  }

  // use for close the popup form 
  onCancel() {
    this.dialogRef.close();
  }


  // use for update password 
  updatePassword() {
    if (this.changePasswordForm.valid) {
      const data = this.changePasswordForm.value;
      let obj = {
        currentPassword: this.passwordEncrypt(this.changePasswordForm.controls['currentPassword'].value),
        newPassword: this.passwordEncrypt(this.changePasswordForm.controls['newPassword'].value),
        user_id: this.userId,
      }
      this.service.postAPIMethod(`/changePassword`, obj).subscribe(
        (response: any) => {
          if (response?.result[0].ERR == 'X') {
            this.service.sweetAlertMsg('error', response.result[0].MSG);
          }
          else {
            this.service.logout();
            this.service.sweetAlertMsg('success', response.result[0].MSG);
            this.dialogRef.close(true);
            this.route.navigateByUrl("/login")
          }
        }
      )
    }
    else {
      this.service.sweetAlertMsg('error', 'Please enter valid data');

    }


  }


  // reset form
  resetPassword() {
    this.changePasswordForm.reset();
  }

  // /**** password Encryption Method */
  passwordEncrypt(password: any) {
    let ciphertext = CryptoJS.AES.encrypt(password, 'Rw7]HwL5cXH$zkh').toString();
    return ciphertext;
  }

}
