import { Component, ChangeDetectorRef, OnInit, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { Regex } from 'src/app/shared/regex';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  public editable: boolean = false;
  public closebtn: boolean = false;
  public resetbtn: boolean = false;
  public submitBtn: boolean = false;
  public removeImgBtn: boolean = false;
  public isDisabled = false;
  public userProfileForm: FormGroup;
  public profileData: any;
  public selectedImagenew: any;
  public imageUrl: any = '';
  public firstName: any;
  public lastName: any;
  public zone: any;
  public userZone: any;
  public profile: any;
  public userCircle: any;
  public userType: any;
  public ngxFirstName: any;
  public ngxLastName: any;
  public selectImage: boolean = false;
  public userId: any;

  constructor(public commonService: CommonHelperService,
    public dialog: MatDialog,
    public ngxLoader: NgxUiLoaderService, public fb: FormBuilder,
    public service: CommonService, public ngxloader: NgxUiLoaderService,
  ) {
    this.userProfileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: ['', [Validators.pattern('[a-zA-Z ]*')]],
      user_contact: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      user_id: ['',],
      circle: ['',],
      user_zone: ['',],
      user_email: ['', []],
      user_image: ['',],
      user_role: ['',],
      user_type: ['',]
    })
  }


  ngOnInit(): void {
    this.getUpdatedProfile();
    this.resetbtn = true;
    this.submitBtn = true;
    this.userProfileForm.controls['user_email'].disable();
  }
  // using form controls
  get userProfileControl() {
    return this.userProfileForm.controls;
  }


  public showPlaceholder: any = '';

  // for edit profile
  editProfileDetails() {
    this.userProfileForm.enable();
    this.showPlaceholder = 'Please Enter Last Name';
    this.editable = true;
    this.selectImage = true;
    this.closebtn = false;
    this.resetbtn = true;
    this.submitBtn = true;
    this.selectedImagenew == null || this.selectedImagenew == '' ? this.removeImgBtn = false : this.removeImgBtn = true;
  }

  // use for update_User_Profile_picture
  updateProfilePicture() {
    this.selectedImagenew == null || this.selectedImagenew == '' ? this.removeImgBtn = false : this.removeImgBtn = true;
  }

  // use for hide_show buttons
  viewProfileDetails() {
    this.editable = false;
    this.selectImage = false;
    this.removeImgBtn = false;
    this.resetForm();
  }

  public removePicValidation: any;
  // use for get user_profile data 
  getUpdatedProfile() {
    this.userProfileForm.disable();
    this.ngxloader.start();
    this.service.getAPIMethod('/getUserProfileDetails').subscribe((response: any) => {
      this.ngxloader.stop();
      this.userZone = response.result[0].ZONE_NAMES?.split(',');
      this.userCircle = response.result[0].CIRCLE_NAMES?.split(',');
      this.userId = response.result[0].USER_ID;
      this.removePicValidation = response.result[0].USER_IMAGE;
      // use to store userProfile data
      this.profile = response.result[0]
      this.profileData = JSON.stringify(response.result[0]);
      let encryptUserData = CryptoJS.AES.encrypt(this.profileData, 'Rw7]HwL5cXH$zkh').toString();

      localStorage.setItem('userData', encryptUserData);
      this.service.getHeaderImage('image')
      this.userProfileForm.patchValue({
        first_name: response.result[0].FIRST_NAME,
        last_name: response.result[0].LAST_NAME,
        user_contact: response.result[0].USER_CONTACT,
        user_id: response.result[0].USER_ID,
        circle: response.result[0].CIRCLE_NAMES,
        user_email: response.result[0].USER_EMAIL,
        user_image: response.result[0].USER_IMAGE,
        user_role: response.result[0].ROLE_NAME,
        user_type: response.result[0].TYPE_NAMES,
        user_zone: response.result[0].ZONE_NAMES

      })

      // get data from local storage.
      let data: any = localStorage.getItem("userData");
      let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);

      data = JSON.parse(decryptUserData);
      this.imageUrl = data.USER_IMAGE,
        this.firstName = data.FIRST_NAME,
        this.lastName = data.LAST_NAME,
        this.ngxFirstName = data.FIRST_NAME?.trimStart().split(' ');
      this.ngxLastName = data.LAST_NAME?.trimStart().split(' ');
      this.imageUrl = response.result[0].USER_IMAGE;
      this.selectedImagenew = response.result[0].USER_IMAGE;
      if (response?.result[0].ERR == 'X') {
        this.service.sweetAlertMsg('error', response.result[0].MSG);
      }
    })


  }




  changeProfileValues() {

    if (this.profile.FIRST_NAME != this.userProfileForm.controls['first_name'].value || this.profile.LAST_NAME != this.userProfileForm.controls['last_name'].value || this.profile.USER_CONTACT != this.userProfileForm.controls['user_contact'].value || !this.userProfileForm.dirty) {
      this.submitBtn = false;
      this.resetbtn = false;
    } else {
      this.submitBtn = true;
      this.resetbtn = true;
    }
  }
  // function use for submit data 
  profileFormSubmit() {
    this.showPlaceholder = '';
    this.profile.USER_IMAGE == null || this.profile.USER_IMAGE == '' ? this.removeImgBtn = false : this.removeImgBtn = true;
    let data = this.userProfileForm.value;
    let user_Contact = this.userProfileForm.controls['user_contact'].value
    if (user_Contact.length != 10) {
      return;
    }
    if (this.userProfileForm.valid) {
      let obj = {
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        user_contact: data.user_contact,
        user_id: data.user_id,
        user_image: this.selectedImagenew
      }
      this.service.postAPIMethod(`/updateUserProfile`, obj).subscribe((response: any) => {
        if (response?.result[0].ERR == 'X') {
          this.service.sweetAlertMsg('error', response.result[0].MSG);
        }
        else {
          this.service.sweetAlertMsg('success', response.result[0].MSG);
          localStorage.removeItem('userData');

          this.submitBtn = false;
          this.getUpdatedProfile();
          this.viewProfileDetails();
        }
      })
    }
    else {
      this.service.sweetAlertMsg('error', 'form is invalid ');
    }

  }

  // use for image upload and convert it into base64
  async onSelectImage(event: any) {
    let events = event;
    this.submitBtn = false;
    this.resetbtn = false;
    this.removeImgBtn = true;
    try {
      if (event.target.files[0]?.size < 1048576) {
        if (event.target.files && event.target?.files[0]) {
          let reader = new FileReader();
          await reader.readAsDataURL(event.target?.files[0]); // read file as data url
          reader.onload = async (event) => { // called once readAsDataURL is completed
            this.imageUrl = event.target?.result;
            this.selectedImagenew = await event.target?.result;
            events.target.value = null;

          }
        }
      }
      else {
        this.service.sweetAlertMsg('error', "Image size should not be Greater then 1Mb");
        this.selectedImagenew == null || this.selectedImagenew == '' ? this.submitBtn = true : this.submitBtn = false;
        this.selectedImagenew == null || this.selectedImagenew == '' ? this.removeImgBtn = false : this.removeImgBtn = true;

      }
    }
    catch (error) {
      this.service.sweetAlertMsg('error', "Image not selected");
    }
  }

  // reset form deatils
  resetForm() {
    this.submitBtn = true;
    this.resetbtn = true;
    this.getUpdatedProfile();
    this.removeImgBtn = false;
  }


  // use for remove profile image
  removeImage() {
    if (this.removePicValidation != null) {
      let data = {
        user_id: this.userProfileForm.value.user_id,
        user_image: null || ''
      }
      const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,
        {
          data: {
            heading: 'Confirmation',
            title: "Are you sure you want to delete your profile picture, if you press OK the profile picture will be removed",
            buttonName: 'ok'
          },
          width: '400px',
          height: 'auto'
        }
      );
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {  // this condition used for click ok on confirmation box 
          this.service.postAPIMethod('/updateUserProfilePic', data).subscribe((response: any) => {
            if (response?.result[0]?.ERR == 'X' || response.statusCode == 400) {
              this.service.sweetAlertMsg('error', response.result[0].MSG);
            } else {
              this.service.sweetAlertMsg('success', response.result[0].MSG);
              this.submitBtn = true;
              this.removeImgBtn = false;
              this.resetbtn = true;
              this.getUpdatedProfile();
            }
          }
          )
        }
      });

    }
    else {

      if (this.profile.FIRST_NAME != this.userProfileForm.controls['first_name'].value || this.profile.LAST_NAME != this.userProfileForm.controls['last_name'].value || this.profile.USER_CONTACT != this.userProfileForm.controls['user_contact'].value || !this.userProfileForm.dirty) {
        this.submitBtn = false;
        this.resetbtn = false;
      }
      else {
        this.submitBtn = true;
        this.resetbtn = true;
      }
      this.imageUrl = null;
      this.selectedImagenew = null || '';
    }
  }

  /** function start
     * handle double space and numeric chacracter
     * */
  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }
  doubleSpace(evt: any) {
    let willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      let elmInput = evt.currentTarget;
      let content = elmInput.value;
      let posStart = elmInput.selectionStart;
      let posEnd = elmInput.selectionEnd;
      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }

  handle_Num_Val_Double_Space(evt: any) {
    evt = (evt || window.event);
    let charCode = (evt.which || evt.keyCode);
    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122)
    ) || this.doubleSpace(evt)) ? false : true;

  }


}