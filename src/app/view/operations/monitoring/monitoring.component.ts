import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { MonitoringCreationComponent } from '../monitoring-creation/monitoring-creation.component';
import { DataTableDirective } from 'angular-datatables';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { debounceTime, from } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from 'src/app/services/socket.service';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';
import * as CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Regex } from 'src/app/shared/regex';
import { MonitoringGraphViewComponent } from '../monitoring-graph-view/monitoring-graph-view.component';
import * as $ from 'jquery';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  showTooltip = false;
  public buttonName: any;
  public processName: any;
  public filePathName = '';
  public monitoringArray = Array();
  public listingArr: any;
  public listingDiv: boolean = false;
  public stepsDiv: boolean = true;
  public showDiv: boolean = true;
  public noOfprocessCount: boolean = false;
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public search: string = '';
  public sockectSubscription: any;
  public jobSubscription: any;
  public classTrue = false;
  public filterBtn: boolean = true;
  public isShowPassword: boolean = false;
  public popuptitle = 'Job Re-Execute';
  public isFormVisible: boolean = true;
  public is_loader: boolean = false;
  public stepNameStatusArray: any = Array();
  @ViewChild('logContainer') private logContainer!: ElementRef;
  // @ViewChild('logContainer', { static: false }) logContainer!: ElementRef;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  columnDefs: any = [
    { orderable: true, targets: 0 },
    { orderable: true, targets: 1 },
    { orderable: true, targets: 2 },
    { orderable: true, targets: 3 },
    { orderable: true, targets: 4 },
    { orderable: true, targets: '_all' }
  ];
  roleList: any = [];
  singleExecuteForm: FormGroup;
  multipleExecuteForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, public service: CommonService,
    public commonService: CommonHelperService, public ngxLoader: NgxUiLoaderService, private socketService: SocketService) {

    this.singleExecuteForm = this.fb.group({
      hostName: ['', [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/)]],
      userName: ['', [Validators.required, Validators.pattern(Regex.spaceValidations)]],
      userPassword: ['', [Validators.required]]
    });

    this.multipleExecuteForm = this.fb.group({
      hostName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required]],
      path: ['', [Validators.required]]
    });
  }

  // use for get form controls for validations 
  get singleExecuteFormControlls() {
    return this.singleExecuteForm.controls;

  }

  // use to reset form
  // resetform() {
  //   this.singleExecuteForm.reset();
  //   this.singleExecuteForm.markAsUntouched();
  //   this.singleExecuteForm.markAsPristine();
  // }
  /**************/
  openDialogWithMultipleExecute(templateRef: TemplateRef<any>) {

    this.dialog.open(templateRef, {
      disableClose: true,
      //data: this.monitoringArray,
      data: {
        title: 'Re-Execute'
      },
      width: '650px',
      height: 'auto',

    });
  }

  public popupFlag: any;
  public titleHead: any;

  openDialogWithSingleExecute(templateRef: TemplateRef<any>, flag: any, processName: any, fileName: any) {

    if (flag == 1) {
      this.popuptitle = 'Job Re-Execute ';

    } else {
      this.popuptitle = 'Process Re-Execute ';

    }

    this.titleHead = processName

    this.popupFlag = flag;
    // this.isFormVisible = true;
    this.dialog.open(templateRef, {
      disableClose: true,
      //data: this.monitoringArray,
      width: '650px',
      height: 'auto',

    });
  }
  /**************/

  public permissionKeys: any;
  public module: any;
  ngOnInit(): void {
    // get permission keys data from localstorage in encrypt form and decrypted
    //setTimeout(() => {
    let permissionData: any = localStorage.getItem("permission");
    let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    let parsed_data = JSON.parse(permissions)
    this.permissionKeys = JSON.parse(parsed_data.MODULES);
    this.module = this.permissionKeys.filter((item: any) => item.module_id === 10);
    // }, 0);
    this.dtOptions = this.commonService.settingDataTableNew(
      this.columnDefs,
      [],
      true,
      true,
      true, // x scroll
      '55vh',// y scroll
      true, // fixed Columns
      true //scroll Collapse
    );
    this.getJobList();

    // $('[data-toggle="tooltip"]').tooltip();

  }

  filterClick() {
    this.classTrue = true;
  }

  filterClose() {
    this.classTrue = false;
  }


  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.logContainer && this.logContainer.nativeElement) {
          this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
        } else {
          console.warn('logContainer is not available');
        }
      } catch (err) {
        console.error('Scrolling failed:', err);
      }
    }, 100);
  }



  createPopup() {
    // if(this.noOfprocessCount==false){
    const dialogRef = this.dialog.open(MonitoringCreationComponent, {
      disableClose: true,
      //data: this.monitoringArray,
      data: {
        title: 'Create Monitoring'
      },
      width: '767px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((closeResult: any) => {
      if (closeResult) {
        this.getJobList();
      }
    });
    //}else{
    //this.service.sweetAlertMsg('error',"Job Process is InProgess State")
    // }
  }

  public hostName: any;

  getMonitoringListing(id: any) {
    this.service.getAPIMethod(`/getMonitoringListing?jobId=${id}`).subscribe((res: any) => {

      this.monitoringArray = res.result;
      this.hostName = res.result[0]?.HOST_NAME;
      this.processName = res.result[0]?.JOB_NAME;
      this.buttonName = res.result[0]?.PROC_ID;
      this.stepNameStatusArray = [];
      this.statusArray = [{ status: '', stepName: res.result[0]?.JOB_NAME, jobName: res.result[0]?.JOB_NAME, count: 0, jobId: res.result[0]?.JOB_ID }];
      let ulLiSize: any = 3;
      let count = 0;
      this.monitoringArray.forEach((item: any) => {
        count++;
        this.statusArray.push({ status: item.STATUS, stepName: item.STEP_NAME, jobName: item.JOB_NAME, count: count, noOfProcess: item.NO_OF_PROCESS, completeProcess: item.COMPLETE_PROCESS, startTime: item.START_PROCESS_TIME, endTime: item.END_PROCESS_TIME, expectedTime: item.EXPECTED_TIME, jobId: item.JOB_ID });
      });
      for (let i = 0; i < this.statusArray.length; i += ulLiSize) {
        this.stepNameStatusArray.push(this.statusArray.slice(i, i + ulLiSize));
      }
      return this.stepNameStatusArray;
    });
  }

  public fileContent: any;


  getFileRead(fileName: any, hostName: any) {

    if (hostName) {
      this.is_loader = true;
      this.service.getAPIMethod(`/getFilePathOfMonitoring?filePath=${fileName}&&hostName=${hostName}`).subscribe((res: any) => {
        this.fileContent = res.content; // Append the new data to existing content
        this.scrollToBottom();
        this.is_loader = false;
      });
    }

  }


  getFileRead_new(fileName: any, hostName: any) {
    if (hostName) {
      this.is_loader = true; // Start loader
      this.service
        .getAPIMethod(`/getFilePathOfMonitoring?filePath=${fileName}&&hostName=${hostName}`)
        .pipe(
          finalize(() => {
            this.is_loader = false; // Stop loader regardless of success or error
          })
        )
        .subscribe(
          (res: any) => {
            if (res && res.content) {
              this.fileContent = res.content; // Update file content
              this.scrollToBottom();
            } else {
              this.service.sweetAlertMsg('error', 'The file path does not exist.');
            }
          },
          (error) => {
            console.error("Error fetching file:", error);
            this.service.sweetAlertMsg('error', 'An error occurred while fetching the file.');
          }
        );
    }
  }





  ngOnDestroy(): void {
    if (this.jobSubscription) {
      this.jobSubscription.unsubscribe();
    }

    if (this.sockectSubscription) {
      this.sockectSubscription.unsubscribe();
    }
  }


  /*****Togel Code*******/
  sidebarActive = false;
  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  activeButton: any;  // Initially Step 0 is active
  setActive(step: any, file: any, status: any, hostName: any): void {
    if (status !== 'Waiting') {
      //this.ngxLoader.start()
      status != 'Failed' ? this.scriptBtn = true : this.scriptBtn = false;
      this.activeButton = step;
      // Update file path and load the file content
      this.filePathName = file;
      this.getFileRead(file, hostName);
      //this.ngxLoader.stop()

    }
  }

  // Method to copy log content to clipboard
  copyToClipboard() {
    //const content = document.getElementById('logContent')?.textContent;
    const content = $('#logContent').text();
    if (content) {
      navigator.clipboard?.writeText(content).then(() => {
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false;
        }, 1500); // Tooltip will disappear after 1.5 seconds
      });
    }
  }

  hideTooltip() {
    this.showTooltip = false;
  }

  public stepIndex: any;



  public stepStatus: any;
  public refreshJobId: any;
  public stepScript: any;
  public jobScript: any;

  public scriptBtn: boolean = true;
  public stepHostName: any;
  public processNameReExc: any;
  viewStepsMonitoring(id: any) {


    this.getMonitoringListing(id);
    this.refreshJobId = id;

    this.jobSubscription = this.socketService.jobMonitoring().subscribe((data: any) => {

      this.listingArr = data;
      if (this.listingArr?.length > 0) {
        // Find the step that is "InProgress"

        this.stepIndex = this.listingArr.findIndex((item: any) => item.STATUS == "InProgress" || item.STATUS == "Failed");

        if (this.stepIndex != -1) {
          const activeStep = this.listingArr[this.stepIndex];
          this.filePathName = activeStep.FILE_PATH;

        } else {
          // Fallback to the first step if no "InProgress" found
          this.stepIndex = this.listingArr?.length - 1;
          const activeStep = this.listingArr[this.stepIndex];
          this.filePathName = activeStep.FILE_PATH;
        }
        this.stepHostName = this.listingArr[0]?.HOST_NAME;
        this.activeButton = this.stepIndex;
        // Now set the active accordion and load file
        const activeStep = this.listingArr[this.stepIndex];
        if (activeStep.STATUS == 'Failed') {
          this.scriptBtn = false;
          this.processNameReExc = activeStep.STEP_NAME;
        }
        this.stepScript = activeStep.SHELL_SCRIPT;
        this.jobScript = activeStep.JOB_SCRIPT;

        this.getFileRead(this.filePathName, this.stepHostName);
      }

      this.jobSubscription.unsubscribe();
    });

    setTimeout(() => {
      this.listingDiv = true;
      this.stepsDiv = false;
    }, 500);
  }

  editStepsMonitoringPopup(id: any, flag: any) {
    this.getMonitoringListing(id);
    setTimeout(() => {

      const dialogRef = this.dialog.open(MonitoringCreationComponent, {
        disableClose: true,
        data: {
          data: this.monitoringArray,
          title: 'Update Monitoring'
        },
        width: '767px',
        height: 'auto',

      });
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          this.getJobList();
        }
      });

    }, 500);

  }
  backToViewPage() {
    this.ngxLoader.start();
    setTimeout(() => {
      this.refreshBtn = false;
      this.filePathName = '';
      this.fileContent = '';
      this.listingDiv = false;
      this.stepsDiv = true;
      this.activeButton = '';
      this.stepScript = '';
      this.jobScript = '';
      this.hostName = '';
      this.processNameReExc = '';
      this.scriptBtn = true;
      this.ngxLoader.stop();

    }, 200);


  }

  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }

  public jobListing: any;
  public otherParams: any;
  //Purpose: fetch user-role listing
  getJobList() {

    this.loaderdata = true;
    this.reDraw();
    this.dtOptions = {

      ...this.commonService.settingDataTableServer(), ajax: (dataTablesParameters: any, callback, settings) => {
        let params;

        if (this.URLSearchParams) {
          params = new URLSearchParams(this.URLSearchParams.toString());
        } else {
          params = new URLSearchParams();
        }
        const defaultOrdering = '';
        this.commonService.dataTableParams(
          params,
          dataTablesParameters,
          this.page,
          this.size,
          this.pageRecordsTotal,
          this.search,
          defaultOrdering,
          '',
          this.otherParams
        );
        this.ngxLoader.start();
        const url = '/getJobList';
        this.jobListing = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {

          this.loaderdata = false;
          this.ngxLoader.stop();
          if (resp.result[0]) {
            if (resp.result[0]) {
              this.roleList = resp.result[0].map((data: any) => {
                return {
                  ...data,
                  checked: false,
                };
              });
            } else {
              this.roleList = [];
            }
            if (resp.result[1][0].COUNT || resp.result[1][0].COUNT == 0) {
              this.pageRecordsTotal = resp.result[1][0].COUNT;
            }
            callback({
              recordsTotal: this.pageRecordsTotal,
              recordsFiltered: this.pageRecordsTotal,
              data: [],
            });
          } else {
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.roleList = [];
          }
        },
          (error) => {
            this.roleList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.roleList = [];
          }
        );
      },

      columns: [
        { orderable: false, data: '' },
        { orderable: true, data: 'JOB_NAME' },
        { orderable: true, data: 'STATUS' },
        { orderable: true, data: 'USER_NAME' },
        { orderable: true, data: 'CREATED_DATE' },
        { orderable: false, data: '' }
      ],
    };
  }

  public refreshBtn: boolean = false;
  refreshScreen(file: any, id: any) {
    this.getMonitoringListing(id);
    this.getFileRead(this.filePathName, this.stepHostName);
    //this.getMonitoringListing(id);
    this.refreshBtn = true;
    setTimeout(() => {
      this.refreshBtn = false;
    }, 300000);
  }


  // delete job
  deleteJob(item: any) {
    const dialogRef = this.dialog.open(DeleteDialogBoxComponent, {
      data: {
        heading: 'Delete Job ' + item.JOB_NAME,
        title: 'Are you sure you want to delete the Job ' + item.JOB_NAME + ' and its details?',
        buttonName: 'Yes Delete',
        panelClass: 'custom-modalbox'
      },
      width: '400px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe((closeResult: any) => {
      if (closeResult) {
        const deleteJob = {
          JOB_ID: item.JOB_ID,
          deleteReason: closeResult.reason
        }
        this.ngxLoader.start();
        this.service.postAPIMethod('/deleteMonitoring', deleteJob).subscribe((response: any) => {
          this.ngxLoader.stop();
          if (response.result[0].ERR == 'X') {
            this.service.sweetAlertMsgWarning('error', response.result[0].MSG);
          }
          else {
            this.service.sweetAlertMsg('success', response.result[0].MSG);
            this.getJobList();
          }
        });
      }
    });
  }


  onSubmit() {
    if (this.singleExecuteForm.valid) {
      this.ngxLoader.start();
      let formData = this.singleExecuteForm.value;
      let data = {
        'formData': formData,
        'script': this.popupFlag == 1 ? this.jobScript : this.stepScript
      }

      this.service.postAPIMethod('/singleExecute', data).subscribe((res: any) => {
        if (res.success === true) {
          this.service.sweetAlertMsg('success', res.message);
          this.dialog.closeAll();
          this.singleExecuteForm.reset();
        } else if (res.success == false) {
          this.service.sweetAlertMsgMonitoring('error', res.stderr);
        }

        this.ngxLoader.stop();
      });
    } else {
      this.service.sweetAlertMsg('error', "Please enter valid data.")
    }
  }

  onSubmitMultiExecute(): void {
    if (this.multipleExecuteForm.valid) {
      let formData = this.multipleExecuteForm.value;
      this.service.postAPIMethod('/singleExecute', formData).subscribe((res: any) => {
        if (res.result[0].ERR === 'X') {
          this.service.sweetAlertMsg('error', res.result[0].MSG);
          this.isFormVisible = false;
        } else {
          this.service.sweetAlertMsg('success', res.result[0].MSG);
          // this.dialogRef.close(true);
          this.isFormVisible = false;
        }

        this.isFormVisible = false;
      });
    } else {
      this.service.sweetAlertMsg('error', "Please enter valid data.")
    }
  }


  resetValues() {
    this.singleExecuteForm.reset();
  }

  // use to reset form
  resetform() {
    this.singleExecuteForm.reset();
    this.singleExecuteForm.markAsUntouched();
    this.singleExecuteForm.markAsPristine();
  }

  public statusArray: any = Array();
  MonitoringGraphPopup(item: any) {
    this.getMonitoringListing(item.JOB_ID)

    setTimeout(() => {
      const dialogRef = this.dialog.open(MonitoringGraphViewComponent, {
        disableClose: true,
        data: {
          title: 'Monitoring Graph View',
          statusData: this.stepNameStatusArray,
          statusLength: this.statusArray.length,
          jobName: item.JOB_NAME
        },
        minWidth: '740px',
        height: 'auto',
      });

      dialogRef.afterClosed().subscribe((closeResult: any) => {
        this.stepNameStatusArray = [];
      });

    }, 500);

  }

}
