import { Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Regex } from 'src/app/shared/regex';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-monitoring-creation',
  templateUrl: './monitoring-creation.component.html',
  styleUrls: ['./monitoring-creation.component.scss']
})
export class MonitoringCreationComponent implements OnInit {
  monitoringForm: FormGroup;

  // ViewChild to access the container
  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(private fb: FormBuilder, public service: CommonService,
    public dialogRef: MatDialogRef<MonitoringCreationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.monitoringForm = this.fb.group({
      jobName: ['', [Validators.required, Validators.pattern(Regex.jobValidations)]],
      jobScript: ['', [Validators.pattern('^(/[^/ ]*)+/?([^/ ]+\.([a-zA-Z0-9]+))?$')]],
      hostName: ['', [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/)]],
      jobId: ['', []],
      stepArray: this.fb.array([this.createRow()])  // Initialize with one row
    });
  }

  ngOnInit(): void {

    if (this.data.data) {
      this.getMonitoringListing();
    }


  }

  // using form controls
  get monitoringFormcontrol() {
    return this.monitoringForm.controls;
  }

  // Function to create a new row (FormGroup for a row)
  createRow(): FormGroup {
    return this.fb.group({
      stepName: ['', [Validators.required, Validators.pattern(Regex.spaceValidations)]],
      stepDescription: ['', [Validators.pattern(Regex.descSpaceValidations)]],
      filePath: ['', [Validators.required, Validators.pattern('^(/[^/ ]*)+/?([^/ ]+\.([a-zA-Z0-9]+))?$')]],
      shellScript: ['', [Validators.pattern('^(/[^/ ]*)+/?([^/ ]+\.([a-zA-Z0-9]+))?$')]],
      noOfProcess: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]], // Numeric validation
      completeProcess: [],
      inprogress: [],
      errorProcess: [],
      logTime: [],
      startProcessTime: [],
      endProcessTime: [],
      expectedTime: [],
      status: [],
      createdBy: [],
      createdDate: [],
      processId: []
    });
  }

  // Getter to easily access the rows FormArray
  get stepArray(): FormArray {
    return this.monitoringForm.get('stepArray') as FormArray;
  }

  // Add a new row and apply a fade-in effect using jQuery  
  addRow(): void {
    const newRow = this.createRow();
    this.stepArray.push(newRow);
    setTimeout(() => {
      const lastRow = this.formContainer.nativeElement.querySelectorAll('.form-row')[this.stepArray.length - 1];
      // Apply fade-in with left effect
      $(lastRow).hide().fadeIn(600).addClass('fade-left-effect');
    }, 0);

    // Scroll to the bottom after adding a new row
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }



  // Scroll to the bottom of the container
  scrollToBottom(): void {
    this.formContainer.nativeElement.scroll({
      top: this.formContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Clone an existing row
  cloneRow(index: number): void {
    const rowToClone = this.stepArray.at(index).value;
    this.stepArray.push(this.fb.group(rowToClone));
  }

  public resetButton = true;

  // Remove a row and apply a fade-out effect using jQuery
  removeRow(index: number): void {
    let rowToRemove
    this.monitoringForm.markAsDirty();
    if (this.stepArray.length > 1) {
      rowToRemove = this.formContainer.nativeElement.querySelectorAll('.form-row')[index];
    }

    $(rowToRemove).fadeOut(600, () => {
      if (this.stepArray.length > 1) {
        this.stepArray.removeAt(index);
      }
    });
  }

  onSubmit(): void {
    if (this.monitoringForm.valid) {
      let formData = this.monitoringForm.value;
      let stringData = JSON.stringify(formData)

      let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();
      this.service.postAPIMethod('/addUpdateMonitoring', { obj: encryptData }).subscribe((res: any) => {
        if (res.result[0].ERR === 'X') {
          this.service.sweetAlertMsgMonitoring('error', res.result[0].MSG);
        } else {
          this.service.sweetAlertMsg('success', res.result[0].MSG);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.service.sweetAlertMsg('error', "Please enter valid data.")
    }
  }

  getMonitoringListing() {
    let monitoringArray = this.data.data;
    // Clear the form array before adding new entries
    // const formArray = this.monitoringForm.get('stepArray') as FormArray;
    const formArray = this.monitoringForm.get('stepArray') as FormArray;
    formArray.clear();
    // Iterate over the API result
    if (monitoringArray?.length) {
      monitoringArray.forEach((item: any) => {
        this.monitoringForm.patchValue({ jobName: item.JOB_NAME, jobId: item.JOB_ID, jobScript: item.JOB_SCRIPT, hostName: item.HOST_NAME });
        const stepGroup = this.createRow();
        stepGroup.patchValue({
          stepName: item.STEP_NAME,
          stepDescription: item.STEP_DESCRIPTION,
          filePath: item.FILE_PATH,
          shellScript: item.SHELL_SCRIPT || '', // Handle empty or missing shellScript
          noOfProcess: Number(item.NO_OF_PROCESS),
          completeProcess: item.COMPLETE_PROCESS,
          inprogress: item.INPROGRESS_PROCESS,
          errorProcess: item.ERROR_PROCESS,
          logTime: item.LOG_TIME,
          startProcessTime: item.START_PROCESS_TIME,
          endProcessTime: item.END_PROCESS_TIME,
          expectedTime: item.EXPECTED_TIME,
          status: item.STATUS,
          createdBy: item.CREATED_BY,
          createdDate: item.CREATED_DATE,
          processId: item.PROCESS_ID
        });
        // Push the new form group to the FormArray
        formArray.push(stepGroup);
      });
    }
  }

  // use to reset form
  resetform() {
    if (this.data.data) {
      this.getMonitoringListing();
    } else {
      this.monitoringForm.reset();
      for (let i = 0; this.stepArray.length > 1; i++) {
        this.stepArray.removeAt(1);
      }
    }
    this.monitoringForm.markAsUntouched();
    this.monitoringForm.markAsPristine();
  }
}
