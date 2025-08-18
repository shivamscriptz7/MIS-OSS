import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { MustMatch } from 'src/app/shared/password.mustmatch';
import { MatDialog } from '@angular/material/dialog';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
// import { SocketService } from 'src/app/services/socket.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;
  public token: any;
  public selectedForm = "";     //kajal 03/05/2023 
  public permissionKeys: any;    //shivam 05/07/2023
  // public permissionKey:any;
  public isShowPassword: boolean = false;
  public isMatchPassword: boolean = false;
  public isConfirmPassword: boolean = false;
  public loginSubscription: any;
  public userDetails: any;
  public userID: any;
  public loginbtn: boolean = false;
  public login_Flag: any;
  public details: any;

  resetPswdForm: FormGroup;
  loginFormGroup: FormGroup;
  passwordObj: any = {};
  passwordValidatorRegex: any = {
    lowerCase: /(?=.*[a-z])/,
    upperCase: /(?=.*[A-Z])/,
    minimunSeven: /(?=.{8,15})/,
    oneNumber: /(?=.*[0-9])/,
    specialCharacter: /(?=.*[$@$#!%*?&^*])/
  };

  userId: any;
  menuPermData: any;
  user_name: any;

  constructor(private fb: FormBuilder, public service: CommonService, public route: Router,
    public ngxLoader: NgxUiLoaderService, public dialog: MatDialog,
  ) {
    this.resetPswdForm = this.fb.group({
      new_pswd: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,15}$/)]],
      confirm_pswd: ['', [Validators.required]],
    }, { validators: MustMatch('new_pswd', 'confirm_pswd') })

    this.loginFormGroup = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9_-]{2,25}$')]),
      //userName: new FormControl('', [Validators.required, Validators.pattern('^(?!\s)((?!\s{2}).)*$')]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^([^'"]*)$/)]),

    })

  }
  ngOnInit(): void {
    this.selectedForm = 'loginFormGroup';
    if (localStorage.getItem("access-token")) {
      this.route.navigateByUrl("/MIS/dashboard")
      // let data: any = localStorage.getItem("userData");
      // let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      // data = JSON.parse(decryptUserData)
      // this.userId = data.USER_ID;

    } else {
      this.route.navigateByUrl("/login");
      //this.test();
    }

  }



  // used for password validations
  ngAfterViewInit() {
    this.resetPswdForm.controls['new_pswd'].valueChanges.subscribe(text => {
      Object.keys(this.passwordValidatorRegex).forEach(key => {
        this.passwordObj[key] = this.passwordValidatorRegex[key].test(text)
      })
    });
  }

  // used for user reset password
  resetUserPswd() {

    if (this.resetPswdForm.valid) {
      let pswdObj = {
        user_id: this.userId,
        randomPassword: this.passwordEncrypt(this.loginFormGroup.controls['password'].value),
        email_id: localStorage.getItem('email'),
        new_pswd: this.passwordEncrypt(this.resetPswdForm.controls['new_pswd'].value),
      }
      this.service.postAPIMethod('/user/resetPswd', pswdObj).subscribe((res => {
        if (res.result[0].ERR == 'X') {
          this.service.sweetAlertMsg('error', res.result[0].MSG)
        } else {
          this.service.sweetAlertMsg('success', res.result[0].MSG);
          this.loginFormGroup.patchValue({ "userName": '', "password": '' });
          this.ngOnInit();
        }
      }))
    }
  }
  title: any;
  userLogin_old() {
    const data = this.loginFormGroup.value;
    data.password = this.passwordEncrypt(this.loginFormGroup.controls['password'].value)
    this.ngxLoader.start();
    try {
      //cal postApiMethod in common service
      this.service.postAPIMethod('/login', data).subscribe((res => {
        this.user_name = res.result[0].USER_NAME;
        if (res.result[0].USER_LOGIN_STATUS === 'new') {
          localStorage.setItem('email', res.result[0].USER_EMAIL);
          this.userId = res.result[0].USER_ID;
          this.service.sweetAlertMsg('success', 'Please reset your password!');
          this.selectedForm = 'resetPswdForm';
        } else if (res.result[0].ERR == 'X') {
          this.service.sweetAlertMsg('error', res.result[0].MSG)
        } else {

          let loginData = JSON.stringify(res.result[0])
          this.token = res.propertyObj.token;

          let encryptUserData = CryptoJS.AES.encrypt(loginData, 'Rw7]HwL5cXH$zkh').toString();

          localStorage.setItem('userData', encryptUserData);
          localStorage.setItem('access-token', this.token);
          this.route.navigate(['/MIS/dashboard']);
          this.service.sweetAlertMsg('success', res.result[0].MSG);
        }
        this.ngxLoader.stop();
      }));
    } catch (error) {
      this.service.sweetAlertMsg('error', "Network Error")
    }
  }




  userLogin() {
    const data = this.loginFormGroup.value;
    data.password = this.passwordEncrypt(this.loginFormGroup.controls['password'].value);

    let UserName = this.loginFormGroup.get('userName')?.value;
    this.service.getAPIMethod(`/fetchLoginFlag?USER_NAME=${UserName}`).subscribe((res) => {


      if (res.result.length > 0) {
        this.login_Flag = res.result[0].LOGIN_FLAG;
      } else {
        this.login_Flag = 0;
      }

      // try {
      //   setTimeout(() => {
      if (this.login_Flag == 1) {
        this.loginbtn == true;
        const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,
          {

            data: {
              heading: 'Confirmation',
              title: "Are you sure you want to log in? If you click submit, all previous sessions for this user will be logged out.",
              buttonName: 'ok'
            },
            width: '400px',
            height: 'auto'
          }
        );

        dialogRef.afterClosed().subscribe((closeResult: any) => {
          // Call postApiMethod in common service

          if (closeResult) {
            this.loginbtn == false;
            this.service.postAPIMethod('/login', data)?.subscribe((res => {
              this.ngxLoader.start();
              // Handle errors
              if (res.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', res.result[0].MSG);
                this.ngxLoader.stop();
                return; // Stop execution if there's an error
              }


              let loginData = JSON.stringify(res.result[0]);
              this.token = res.propertyObj.token;
              let encryptUserData = CryptoJS.AES.encrypt(loginData, 'Rw7]HwL5cXH$zkh').toString();
              localStorage.setItem('userData', encryptUserData);
              localStorage.setItem('access-token', this.token);
              this.route.navigate(['/MIS/dashboard']);
              this.service.sweetAlertMsgLogin('success', res.result[0].MSG);

              this.ngxLoader.stop();
            }));
          }

        });


      } else {
        this.service.postAPIMethod('/login', data).subscribe((res => {

          this.ngxLoader.start();
          // Handle errors
          if (res.result[0].ERR == 'X') {
            this.service.sweetAlertMsg('error', res.result[0].MSG);
            this.ngxLoader.stop();
            return; // Stop execution if there's an error
          }

          // Proceed with login if user is not already logged in
          if (res.result[0].USER_LOGIN_STATUS === 'new') {
            localStorage.setItem('email', res.result[0].USER_EMAIL);
            this.userId = res.result[0].USER_ID;
            this.service.sweetAlertMsg('success', 'Please reset your password!');
            this.selectedForm = 'resetPswdForm';
            this.ngxLoader.stop();
            return; // Stop execution
          }

          this.details = {
            'USERID': res.result[0].USER_ID,
            'LOGIN_FLAG': 1,
            'PROC_STATUS': 1

          }

          let loginData = JSON.stringify(res.result[0]);
          this.token = res.propertyObj.token;
          let encryptUserData = CryptoJS.AES.encrypt(loginData, 'Rw7]HwL5cXH$zkh').toString();
          localStorage.setItem('userData', encryptUserData);
          localStorage.setItem('access-token', this.token);
          this.updateLoginFlagData();
          this.route.navigate(['/MIS/dashboard']);
          this.service.sweetAlertMsgLogin('success', res.result[0].MSG);
          this.ngxLoader.stop();
        }));






      }
    })
  }


  public updateLoginFlagData() {
    this.service.postAPIMethod('/update_loginFlag', this.details).subscribe((res) => {
      //this.login_Flag=res.result[0].LOGIN_FLAG;
    })
  }
  /**** password Encryption Method */
  passwordEncrypt(password: any) {
    let ciphertext = CryptoJS.AES.encrypt(password, 'Rw7]HwL5cXH$zkh').toString();
    return ciphertext;
  }







}
