import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Regex } from 'src/app/shared/regex';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { Regex } from 'src/app/shared/regex';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as CryptoJS from 'crypto-js';

export interface email {
  name: string;
}
@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.scss']
})
export class ScheduleCreateComponent implements OnInit {
  public minutesData: any = [];
  public hourData: any = [];
  public daysWeek: any = [];
  public monthData: any = [];
  public monthDays: any = [];
  public daysData: any = [];
  public reportList: any = [];
  public reportFormat: any = [];
  public userDetails: any;
  public scheduleCreationForm: any = FormGroup;
  public buttonName = 'Submit';
  public title = 'Create Schedule';
  public editSchedularField: boolean = false;
  public filteredReport: any
  public emailList: any = [];
  public btnDisable: boolean = false;
  public selectArray: string[] = [];

  public emailArray: any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedCheck = false;
  selectedID = 0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);
  senderEmailsControl: FormControl = new FormControl([Validators.required]);
  scheduledId: any;
  constructor(public service: CommonService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleCreateComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {

    this.scheduleCreationForm = this.fb.group({
      schedular_name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(Regex.spaceValidations)]],
      report_name: ['', [Validators.required]],
      report_format: ['', [Validators.required]],
      minutes: [null, []],
      hour: [null, []],

      days_week: [[], []],
      days_month: [[], []],
      month_name: [[], []],
      schedular_id: ['', []],
      emailSend: [''],
      sender_emails: this.senderEmailsControl
    })

  }

  // used for check validations in form(at least one field is selected)
  checkselectedfield(id1: any) {
    this.selectedCheck = false;
    this.selectedID = id1;
    const fieldsToCheck = ['minutes', 'hour', 'days_week', 'days_month', 'month_name'];

    for (let i = 0; i < fieldsToCheck.length; i++) {
      let length = this.scheduleCreationForm?.controls[fieldsToCheck[i]]?.value?.length
      if (this.scheduleCreationForm?.controls[fieldsToCheck[i]]?.value && length != 0) {
        this.selectedCheck = true;
        break;
      }

    }
  }
  // used for when user click on email checkbox
  onCheckboxClick(value: any) {
    if (value) {
      this.scheduleCreationForm.controls.sender_emails.value = [];
      this.senderEmailsControl.setValidators([Validators.required]);
    } else {

      this.senderEmailsControl.clearValidators();
      // this.scheduleCreationForm.get('emailSend').setValue('');
      // this.emailArray = [];
    }
    // Trigger validation immediately after updating validators
    this.senderEmailsControl.updateValueAndValidity();
    this.scheduleCreationForm.controls.sender_emails.value = [];
  }
  ngOnInit(): void {
    this.minutesData = this.minuteCounterArray(0, 59);
    this.hourData = this.hourcouterArray(0, 23);
    // this.monthDays = this.monthDaycounterArray4(0, 11);
    this.daysData = this.daycounterArray(1, 31);
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);
    this.getScheduleReportList(this.userDetails.USER_ID);
    this.editViewSchedule();



    this.monthData = [
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'June' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      { id: 9, name: 'September' },
      { id: 10, name: 'October' },
      { id: 11, name: 'November' },
      { id: 12, name: 'December' },
    ];

    this.daysWeek = [
      // { id: 'Sun', name: 'Sunday' },
      { id: 0, name: 'Sunday' },
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
    ];

    this.reportFormat = [
      { id: 'Pdf', name: 'Pdf' },
      { id: 'xlsx', name: 'Excel' },
      { id: 'csv', name: 'CSV' }
    ]
  }

  //this method used for minutes
  minuteCounterArray(s: number, n: number) {
    let arrayToCreate = [];
    for (let i = s; i <= n; i++) {
      let name = i;
      if (s == 0) {
        name = i;
      }
      arrayToCreate.push({ id: i, name: name });
    }
    return arrayToCreate;
  }

  //this method used for hour
  hourcouterArray(s: number, n: number) {
    let arrayToCreate = [];
    for (let i = s; i <= n; i++) {
      let name = i;
      if (s == 0) {
        name = i;
      }
      arrayToCreate.push({ id: i, name: name });
    }
    return arrayToCreate;
  }

  //this method used for day of month
  daycounterArray(s: number, n: any) {
    let arrayToCreate = [];
    for (let i = s; i <= n; i++) {
      let name = i;
      if (s == 0) {
        name = i;
      }
      arrayToCreate.push({ id: i, name: name });
    }
    return arrayToCreate;
  }


  // using form controls
  get scheduleFormcontrol() {
    return this.scheduleCreationForm.controls;
  }

  //this function used for fetch report name
  public getScheduleReportList(userId: any) {
    this.scheduledId = this.data.details.SCHEDULE_ID ? this.data.details.SCHEDULE_ID : 0;
    this.service.getAPIMethod(`/getReportListSchedule?user_id=${userId}&&scheduledId=${this.scheduledId}`).subscribe((res => {
      this.reportList = res.result;

      this.filteredReport = this.reportList.slice();


    }));
  }
  // used for add email mat-chip
  add(event: MatChipInputEvent): void {
    const value = (event.value).trim();
    if (value) {
      if (this.isValidEmail(value)) {
        this.emailArray = this.senderEmailsControl.value;

        // Check for duplicates before adding the new email
        // Add the new email to the array
        this.emailArray.push(value);
        // Update the form control with the modified array
        let removeDuplicacy = Array.from(new Set(this.emailArray));// remove diplicate values from array and create new array
        this.senderEmailsControl.setValue(removeDuplicacy);
        this.scheduleCreationForm.markAsDirty();
      }
    } else {
      // Handle invalid email error here
      console.log('Invalid email:', value);
      this.emailValidLength = 0;
    }
    event.input.value = '';
  }

  isValidEmail(email: string): boolean {
    // Regular expression for email validation
    const emailRegex = Regex.emailDomianRegex;
    return emailRegex.test(email);
  }

  // used for remove email in mat-chip
  removeEmail(emailToRemove: []): void {
    this.emailArray = this.senderEmailsControl.value;
    const indexToRemove = this.emailArray.indexOf(emailToRemove);
    if (indexToRemove !== -1) {
      // Remove the email from the array
      this.emailArray.splice(indexToRemove, 1);
      if (this.emailArray.length == 0) {
        this.senderEmailsControl.setValidators([Validators.required]);
      }
      // Update the form control with the modified array
      this.senderEmailsControl.setValue(this.emailArray);
      this.scheduleCreationForm.markAsDirty();
    }
  }

  //this method used for add & update schedule form.
  // for submit form data
  submitSchedularForm() {
    if (this.data.details.SCHEDULE_NAME != this.scheduleCreationForm.get('schedular_name').value && this.data.details?.SCHEDULE_ID != null) {
      this.service.sweetAlertMsg('error', 'Please enter valid data.');
    }
    else if (this.scheduleCreationForm.valid) {
      if ((this.scheduleFormcontrol['minutes'].value != null || this.scheduleFormcontrol['hour'].value != null) || this.scheduleFormcontrol['days_week'].value != null || this.scheduleFormcontrol['days_month'].value != null || this.scheduleFormcontrol['month_name'].value != null) {
        let userId = this.userDetails.USER_ID;
        const data = this.scheduleCreationForm.value;
        let scheduledTime = 'Every' + ' ' + ((data.hour || data.hour == 0) ? data.hour + ' ' + 'Hour' + ' ' : '') + ((data.minutes || data.minutes == 0) ? data.minutes + ' ' + 'Min' + ' ' : '') + ((data.days_week?.length !== 0 && data.days_week) ? data.days_week + ' ' + 'Week' + ' ' : '') + ((data.days_month?.length !== 0 && data.days_month) ? data.days_month + ' ' + 'Day' + ' ' : '') + ((data.month_name?.length !== 0 && data.month_name) ? data.month_name + ' ' + 'Month' : '');

        if (data.hour === null && !data.days_week?.length && !data.days_month?.length && !data.month_name?.length) {
          this.scheduleCreationForm.value.minutes = '*/' + this.scheduleCreationForm.value.minutes;
          this.scheduleCreationForm.value.hour = '*';
          this.scheduleCreationForm.value.days_week = '*';
          this.scheduleCreationForm.value.days_month = '*';
          this.scheduleCreationForm.value.month_name = '*';

        }
        else if (data.minutes === null && !data.days_week?.length && !data.days_month?.length && !data.month_name?.length) {
          this.scheduleCreationForm.value.hour = '*/' + this.scheduleCreationForm.value.hour;
          this.scheduleCreationForm.value.minutes = '*';
          this.scheduleCreationForm.value.days_week = '*';
          this.scheduleCreationForm.value.days_month = '*';
          this.scheduleCreationForm.value.month_name = '*';
        }

        let scheduleReport = ((data.minutes || data.minutes == 0) ? data.minutes.toString() + ' ' : '* ') + ((data.hour || data.hour == 0) ? data.hour.toString() + ' ' : '* ') + ((data.days_month?.length !== 0 && data.days_month) ? data.days_month.toString() + ' ' : '* ') + ((data.month_name?.length !== 0 && data.month_name) ? data.month_name.toString() + ' ' : '* ') + ((data.days_week?.length !== 0 && data.days_week) ? data.days_week.toString() : '*');
        if (this.scheduleFormcontrol['minutes'].value == null && this.scheduleFormcontrol['hour'].value == 0 && this.scheduleFormcontrol['days_week'].value == null && this.scheduleFormcontrol['days_month'].value == null && this.scheduleFormcontrol['month_name'].value == null) {
          // this.scheduleCreationForm.markAsPristine();
          this.service.sweetAlertMsg('error', "You cannot select a value of 0 hours.");
        } else if (this.scheduleFormcontrol['hour'].value == null && this.scheduleFormcontrol['minutes'].value == 0) {
          this.service.sweetAlertMsg('error', "You cannot select a value of 0 minutes.");

        }
        else if (this.scheduleFormcontrol['minutes'].value == 0 && this.scheduleFormcontrol['hour'].value == 0 && this.scheduleFormcontrol['days_week'].value == null && this.scheduleFormcontrol['days_month'].value == null && this.scheduleFormcontrol['month_name'].value == null) {
          this.service.sweetAlertMsg('error', " You cannot select a value of 0 for minutes or hours.");
          // this.scheduleCreationForm.markAsPristine();
        }

        else {
          let obj = {
            SCHEDULAR_ID: data.schedular_id,
            SCHEDULAR_NAME: data.schedular_name,
            REPOID: data.report_name,
            REPO_FORMAT: data.report_format.toString(),
            SCHEDULE_TIME: scheduleReport,
            SCHEDULED_TIME1: scheduledTime,
            SENDER_EMAIL: this.senderEmailsControl.value,
            MAIL_CHECKBOX: data.emailSend ? true : '',
            // prevData: this.data.details,
          }

          let stringData = JSON.stringify(obj)
          let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();

          this.service.postAPIMethod(`/addUpdateSchedule`, { obj: encryptData }).subscribe(
            (response: any) => {
              if (response?.result[0].ERR == 'X') {
                this.service.sweetAlertMsgWarning('error', response.result[0].MSG);
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);
                this.dialogRef.close(true);
              }
            })
        }
      }
      else {
        this.service.sweetAlertMsg('error', 'Please select valid data');

      }


    } else {
      this.service.sweetAlertMsg('error', 'Please select valid data');
    }
  }


  //this method used for close dialogbox
  closeDialogBox() {
    this.dialogRef.close(true);
  }


  // Update Report form
  editViewSchedule() {


    this.scheduleCreationForm.markAsPristine();
    if (this.data.details.SCHEDULE_ID != null) {
      this.checkselectedfield(0);
      this.selectedCheck = true;
      // this.minutesChange();
      // this.hourChange();
      this.editSchedularField = true;
      this.buttonName = "Update"
      this.title = "Update Schedule"
      // this.typeNameInput = true;
      let data = this.scheduleCreationForm.value;
      let str = this.data.details.SCHEDULE_TIME;
      let strValue = str.split(' ');
      let index1 = strValue[0].toString();
      let IndexValue = index1.split('');
      let minuteIndex;
      let hourStr = strValue[1].toString();
      let hourIndex = hourStr.split('');
      let hourIndexvalue;
      let days_weekVal = strValue[4];
      let daysWeekIndex = [];
      daysWeekIndex.push(...days_weekVal?.split(',')?.map((e: any) => +e));
      let dayMonth = strValue[2];
      let day_monthval = [];
      day_monthval.push(...dayMonth?.split(',')?.map((e: any) => +e));
      let monthName = strValue[3];
      let monthNameVal = [];
      monthNameVal.push(...monthName?.split(',')?.map((e: any) => +e));
      let repoFormat = this.data.details.SCH_REPO_FORMAT;
      let repoFormatVal = [];
      repoFormatVal.push(...repoFormat?.split(','));
      if (IndexValue.length > 3) {
        minuteIndex = IndexValue[2] + IndexValue[3].replace('*/', '');
      } else {
        minuteIndex = index1.replace('*/', '');

      }
      if (days_weekVal == '*') {
        daysWeekIndex = [];

      }

      if (monthName == '*') {
        monthNameVal = [];
      }
      if (dayMonth == '*') {
        day_monthval = [];
      }
      let mailValue = this.data.details.USER_EMAILS?.split(',');
      this.scheduleCreationForm.controls['schedular_name'].patchValue(this.data.details.SCHEDULE_NAME);
      this.scheduleCreationForm.controls['report_name'].patchValue(+this.data.details.REPORT_ID);
      this.scheduleCreationForm.controls['report_format'].patchValue(repoFormatVal);
      this.scheduleCreationForm.controls['minutes'].patchValue(+minuteIndex);
      this.scheduleCreationForm.controls['days_week'].patchValue(daysWeekIndex);
      this.scheduleCreationForm.controls['days_month'].patchValue(day_monthval);
      this.scheduleCreationForm.controls['month_name'].patchValue(monthNameVal);
      this.scheduleCreationForm.controls['schedular_id'].patchValue(this.data.details.SCHEDULE_ID);
      this.scheduleCreationForm.controls['emailSend'].patchValue(this.data.details.MAIL_CHECKBOX_SHOWN);
      this.senderEmailsControl.patchValue(mailValue);

      if (hourIndex.length > 2) {
        hourIndexvalue = hourIndex[2];
        this.scheduleCreationForm.controls['hour'].patchValue(+hourIndexvalue);
      } else if (hourStr == '*') {
        hourIndexvalue = null
        this.scheduleCreationForm.controls['hour'].patchValue(hourIndexvalue);
      } else {
        hourIndexvalue = hourStr;
        this.scheduleCreationForm.controls['hour'].patchValue(+hourIndexvalue);
      }

    } else {
      this.selectedCheck = false;
      this.scheduleCreationForm.reset();
    }
  }

  public emailValidLength: any;
  // use for check email validation
  emailValidation(item: any) {
    this.emailValidLength = item.target.value.length;
    let emailArray = item.target.value.split(';').map((email: any) => email.trim());
    // Filter valid emails based on the domain pattern
    const validEmails = emailArray.filter((email: any) => Regex.emailDomianRegex.test(email));
    // Filter invalid emails
    const invalidEmails = emailArray.filter((email: any) => !validEmails.includes(email));
    if (invalidEmails.length != 0) {
      this.senderEmailsControl.setErrors({ invalidEmail: true });
    } else {
      this.senderEmailsControl.setErrors({ invalidEmail: false });
    }
  }

}
