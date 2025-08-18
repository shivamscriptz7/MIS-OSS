import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IDatePickerConfig } from "ng2-date-picker";
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { CommonService } from 'src/app/services/common.service';
import { MonitoringDialogBoxComponent } from '../../dialogbox/monitoring-dialog-box/monitoring-dialog-box.component';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { UserMonitoringComponent } from './user-monitoring/user-monitoring.component';
import { PermissionMonitoringComponent } from './permission-monitoring/permission-monitoring.component';
import { RoleMonitoringComponent } from './role-monitoring/role-monitoring.component';
import { ScheduleMonitoringComponent } from './schedule-monitoring/schedule-monitoring.component';
import { ReportMonitoringComponent } from './report-monitoring/report-monitoring.component';
import { EmailConfigMonitoringComponent } from './email-config-monitoring/email-config-monitoring.component';
import { ProcessMonitoringComponent } from './process-monitoring/process-monitoring.component';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {

  @ViewChild(UserMonitoringComponent) userChildComponent: any = UserMonitoringComponent;
  @ViewChild(PermissionMonitoringComponent) permissionChildComponent: any = PermissionMonitoringComponent;
  @ViewChild(RoleMonitoringComponent) roleChildComponent: any = RoleMonitoringComponent;
  @ViewChild(ScheduleMonitoringComponent) scheduleChildComponent: any = ScheduleMonitoringComponent;
  @ViewChild(ReportMonitoringComponent) reportChildComponent: any = ReportMonitoringComponent;
  @ViewChild(EmailConfigMonitoringComponent) emailConfigChildComponent: any = EmailConfigMonitoringComponent;
  @ViewChild(ProcessMonitoringComponent) processChildComponent: any = ProcessMonitoringComponent;

  public moduleData: any;
  public logsFiltersForm: FormGroup;
  roleList: any = [];
  public userModuleChecked = 0;



  public maxDate: any = new Date();

  public config: IDatePickerConfig = {
    format: "YYYY-MM-DD",
    firstDayOfWeek: "su",
    monthFormat: "MMM, YYYY",
    yearFormat: "YYYY",
    monthBtnFormat: "MMM",
    // hours24Format: 'HH',
    // showTwentyFourHours: true,
    // timeSeparator: ':',
    hideInputContainer: false,
    // min: this.maxDate[0],
    // min: moment().subtract(1, "month").endOf("day").format('DD:MM:YYYY HH:mm:ss'),
    max: this.getminDate(),
  };

  public configEnd: IDatePickerConfig = {
    format: "YYYY-MM-DD",
    firstDayOfWeek: "su",
    monthFormat: "MMM, YYYY",
    yearFormat: "YYYY",
    monthBtnFormat: "MMM",
    hideInputContainer: false,
    max: this.getminDate(),
  };
  public getRoleDetails: Subscription | any;

  public fetchPDfData: any;
  public userNameData: any

  constructor(public commonService: CommonHelperService,

    public dialog: MatDialog,
    public service: CommonService,
    public ngxLoader: NgxUiLoaderService,
    public route: Router,
    public fb: FormBuilder,
    // private slasevice: ExportSlaExcelService,
  ) {
    this.logsFiltersForm = this.fb.group({
      logFromDt: ["", [Validators.required]],
      logToDt: ["", [Validators.required]],
      logAction: [''],
      userId: [''],
      type: [''],
    })
  }

  ngOnInit(): void {

    this.valueChange();
    this.getLogUserData();
    this.service.getAPIMethod(`/getLogModuleList`).subscribe(res => {
      this.moduleData = res?.result;
      this.moduleData_filter = res?.result;
      this.duplicatefilteredModules = [...this.moduleData_filter];
      this.toggleReportListing(this.moduleData_filter[0], 0)

    });


  }

  getPdfData(data: any) {
  }


  getLogUserData() {
    this.service.getAPIMethod(`/getUserLogList`).subscribe(res => {
      this.userNameData = res.result;
    });

  }

  public classTrue = false;

  // filter click Event 
  filterClick() {
    this.classTrue = true;
  }


  dialogBox(item: any) {
    let oldValue = JSON.parse(item.LOG_OLD_VALUE);
    let newValue = JSON.parse(item.LOG_NEW_VALUE);
    let changesData = this.findChanges(oldValue, newValue);
    const dialogRef = this.dialog.open(MonitoringDialogBoxComponent,
      {
        data: {
          heading: 'Confirmation',
          title: 'User Logs',
          buttonName: 'ok',
          changesData: changesData,
        },
        width: '600px',
        height: 'auto'
      }
    );
    dialogRef.afterClosed().subscribe((customResultData: any) => {
      dialogRef.close();
    });
  }



  public oldValue: any;
  public newValue: any;
  public changesData: any = [];

  findChanges(oldArray: any, newArray: any) {
    let changes = [];
    const oldValue = oldArray ? oldArray[0] : null;
    const newValue = newArray[0];
    for (const key in newValue) {
      if (!oldValue || (oldValue[key] !== newValue[key])) {
        changes.push({
          changeValue: key,
          oldValue: oldValue ? oldValue[key] : '',
          newValue: newValue[key]
        });
      }
    }
    return changes;
  }


  public ModuleNameHeader: any;
  showReportListing: boolean = false;
  public moduleId: any;

  toggleReportListing(item: any, data: any) {
    this.ModuleNameHeader = item.MODULES_NAME
    this.moduleId = item.MODULES_ID;
    this.service.fetchModuleId(this.moduleId);
    this.showReportListing = !this.showReportListing;

    this.logsFiltersForm.controls['logFromDt'].patchValue("");
    this.logsFiltersForm.controls['logToDt'].patchValue("");
    this.logsFiltersForm.controls['logAction'].patchValue("");
    this.logsFiltersForm.controls['userId'].patchValue("");
    this.logsFiltersForm.controls['type'].patchValue("");
  }

  public searchData: any = "";
  public moduleData_filter: any;
  public duplicatefilteredModules: any = [];
  // use this function search from listing
  searchFunction() {
    this.moduleData_filter = [...this.duplicatefilteredModules];

    this.moduleData_filter = this.duplicatefilteredModules.filter((item: any) => {
      return (item.MODULES_NAME.toLowerCase().indexOf(this.searchData.toLowerCase()) >= 0
      );

    });
  }

  dialogClose() {
    this.classTrue = false;
  }

  public logFilterData: any
  public submitFilterForm() {
    let data = this.logsFiltersForm.value;


    // Create a new Date object from the logToDt value

    // Now, data.logToDt is incremented by one day


    //let endDate = new Date(data.logToDt);

    //Increment the date by one day
    //endDate.setDate(endDate.getDate() + 1);

    //If you need the date back in a specific format (e.g., string), convert it
    //let toDate = endDate.toISOString().slice(0, 10);
    if (this.logsFiltersForm.valid) {

      let logFiters = {
        "fromDt": data.logFromDt ? data.logFromDt : '',
        "toDt": data.logToDt ? data.logToDt : '',
        "logAction": data.logAction ? data.logAction : '',
        "userId": data.userId ? data.userId : '',
        "type": data.type ? data.type : ''
      }


      if (this.moduleId == "6") {
        this.userChildComponent.setFilters(logFiters);
      } else if (this.moduleId == "7") {
        this.roleChildComponent.setFilters(logFiters);
      } else if (this.moduleId == "8") {
        this.permissionChildComponent.setFilters(logFiters);
      }
      else if (this.moduleId == "9") {
        this.scheduleChildComponent.setFilters(logFiters);
      }
      else if (this.moduleId == "19") {
        this.reportChildComponent.setFilters(logFiters);
      }
      else if (this.moduleId == "99") {
        this.emailConfigChildComponent.setFilters(logFiters);
      }

      else if (this.moduleId == "10") {
        this.processChildComponent.setFilters(logFiters);
      }


      this.classTrue = false;
    }

  }



  // this is used for close filter 
  filterClose() {
    this.classTrue = false;
    // this.logsFiltersForm.controls['logFromDt'].patchValue("");
    // this.logsFiltersForm.controls['logToDt'].patchValue("");
    // this.logsFiltersForm.controls['logAction'].patchValue("");
  }


  resetFilters() {

    this.logsFiltersForm.controls['logFromDt'].patchValue("");
    this.logsFiltersForm.controls['logToDt'].patchValue("");
    this.logsFiltersForm.controls['logAction'].patchValue("");
    this.logsFiltersForm.controls['userId'].patchValue("");
    this.logsFiltersForm.controls['type'].patchValue("");

    let data = this.logsFiltersForm.value;

    let logFiters = {
      "fromDt": data.logFromDt ? data.logFromDt : '',
      "toDt": data.logToDt ? data.logToDt : '',
      "logAction": data.logAction ? data.logAction : '',
      "userId": data.userId ? data.userId : '',
      "type": data.type ? data.type : ''
    }


    if (this.moduleId == "6") {
      this.userChildComponent.setFilters(logFiters);
    } else if (this.moduleId == "7") {
      this.roleChildComponent.setFilters(logFiters);
    } else if (this.moduleId == "8") {
      this.permissionChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "9") {
      this.scheduleChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "19") {
      this.reportChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "99") {
      this.emailConfigChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "10") {
      this.processChildComponent.setFilters(logFiters);
    }

  }



  public sendPdfData: any = [];
  public object: any;
  downloadPdf() {

    let data = this.logsFiltersForm.value;
    // let endDate = new Date(data.logToDt);
    // Increment the date by one day
    // endDate.setDate(endDate.getDate() + 1);

    // If you need the date back in a specific format (e.g., string), convert it
    // let toDate = endDate.toISOString().slice(0, 10);
    let logFiters = {
      "fromDt": data.logFromDt ? data.logFromDt : '',
      "toDt": data.logToDt ? data.logToDt : '',
      "logAction": data.logAction ? data.logAction : '',
      "userId": data.userId ? data.userId : '',
      "type": data.type ? data.type : ''
    }

    if (this.moduleId == "6") {
      this.userChildComponent.ExportPdfClick(logFiters);
    } else if (this.moduleId == "7") {
      this.roleChildComponent.ExportPdfClick(logFiters);
    } else if (this.moduleId == "8") {
      this.permissionChildComponent.ExportPdfClick(logFiters);
    }
    else if (this.moduleId == "9") {
      this.scheduleChildComponent.ExportPdfClick(logFiters);
    }
    else if (this.moduleId == "19") {
      this.reportChildComponent.ExportPdfClick(logFiters);
    }
    else if (this.moduleId == "99") {
      this.emailConfigChildComponent.ExportPdfClick(logFiters);
      //this.emailConfigChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "10") {
      this.processChildComponent.ExportPdfClick(logFiters);
      //this.processChildComponent.setFilters(logFiters);
    }

  }

  downloadExcel() {

    let data = this.logsFiltersForm.value;
    //let endDate = new Date(data.logToDt);
    // Increment the date by one day
    //endDate.setDate(endDate.getDate() + 1);

    // If you need the date back in a specific format (e.g., string), convert it
    //let toDate = endDate.toISOString().slice(0, 10);
    let logFiters = {
      "fromDt": data.logFromDt ? data.logFromDt : '',
      "toDt": data.logToDt ? data.logToDt : '',
      "logAction": data.logAction ? data.logAction : '',
      "userId": data.userId ? data.userId : '',
      "type": data.type ? data.type : ''
    }


    if (this.moduleId == "6") {
      this.userChildComponent.ExportExcelClick(logFiters);
    } else if (this.moduleId == "7") {
      this.roleChildComponent.ExportExcelClick(logFiters);
    } else if (this.moduleId == "8") {
      this.permissionChildComponent.ExportExcelClick(logFiters);
    }
    else if (this.moduleId == "9") {
      this.scheduleChildComponent.ExportExcelClick(logFiters);
    }
    else if (this.moduleId == "19") {
      this.reportChildComponent.ExportExcelClick(logFiters);
    }
    else if (this.moduleId == "99") {
      this.emailConfigChildComponent.ExportExcelClick(logFiters);
      //this.emailConfigChildComponent.setFilters(logFiters);
    }
    else if (this.moduleId == "10") {
      this.processChildComponent.ExportExcelClick(logFiters);
      //this.processChildComponent.setFilters(logFiters);
    }

  }



  getminDate() {
    const originalDate = new Date();
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with 0 if needed
    const day = String(originalDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }


  public formattedDate: any;
  public selectedMonth: any;
  public currentMonth: any;
  getmaxDateValueToDate() {

    const lastDate = new Date(
      this.logsFiltersForm.controls["fromDt"].value
    );



    // Set the date to the last day of the month
    //lastDate.setDate(lastDate.getDate());
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    const year = lastDate.getFullYear();
    const month = String(lastDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with 0 if needed
    const day = String(lastDate.getDate()).padStart(2, "0");
    this.formattedDate = `${year}-${month}-${day}`;
  }

  getmaxDateValue(date: any) {
    // Example usage:

    const referenceDate = date; // Your reference date

    const lastDate = new Date(referenceDate);

    // Set the date to the last day of the month
    //lastDate.setDate(lastDate.getDate());
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    const year = lastDate.getFullYear();
    const month = String(lastDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with 0 if needed
    const day = String(lastDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }



  valueChange() {
    //this.configEnd.min = '2023-10-01'
    this.logsFiltersForm.controls["logFromDt"].valueChanges.subscribe((item: any) => {
      this.logsFiltersForm.controls["logToDt"].setValue("");
      this.configEnd.min = item;
      const referenceDate = item; // Your reference date
      const lastDate = new Date(referenceDate);
      this.selectedMonth = lastDate?.getMonth() + 1;
      const refCurrentData = new Date();
      this.currentMonth = refCurrentData?.getMonth() + 1;

      // Set the date to the last day of the month
      //lastDate.setDate(lastDate.getDate());
      // lastDate.setMonth(lastDate.getMonth() + 1);
      if (item) {
        if (this.selectedMonth == this.currentMonth) {
          this.configEnd.max = this.getminDate();
        } else {
          this.configEnd.max = this.getmaxDateValue(item);
        }
      }
    });
  }


}
