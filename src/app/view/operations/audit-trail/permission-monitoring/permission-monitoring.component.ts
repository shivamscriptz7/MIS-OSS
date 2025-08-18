import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Subscription, debounceTime, filter } from 'rxjs';
import { MonitoringDialogBoxComponent } from 'src/app/view/dialogbox/monitoring-dialog-box/monitoring-dialog-box.component';
import { ExportSlaExcelService } from 'src/app/services/export-sla-excel.service';
import { MonitoringPermissionDialogboxComponent } from 'src/app/view/dialogbox/monitoring-permission-dialogbox/monitoring-permission-dialogbox.component';
import { MonitoringTypePermissionComponent } from 'src/app/view/dialogbox/monitoring-type-permission/monitoring-type-permission.component';




@Component({
  selector: 'app-permission-monitoring',
  templateUrl: './permission-monitoring.component.html',
  styleUrls: ['./permission-monitoring.component.scss']
})
export class PermissionMonitoringComponent implements OnInit {
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public getPermissionLogDetails: Subscription | any;
  public search: string = '';
  public otherParams: any;
  public permiossionLogList: any = [];
  public logData: any;
  public moduleId: any;
  public oldValue: any;
  public newValue: any;
  public changesData: any = [];
  public listView: any = false;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  columnDefs: any = [
    { orderable: true, targets: 0 },
    { orderable: true, targets: 1 },
    { orderable: true, targets: 2 },
    { orderable: true, targets: 3 },
    { orderable: true, targets: 4 },
    { orderable: true, targets: 5 },
    { orderable: true, targets: '_all' }
  ];
  constructor(public commonService: CommonHelperService,
    public dialog: MatDialog,
    public service: CommonService,
    public slaservice: ExportSlaExcelService,
    public ngxLoader: NgxUiLoaderService,
    public route: Router
  ) { }


  @Output() sendData = new EventEmitter<any>();


  public differences: any[] = [];
  ngOnInit(): void {
    // use for recieve module id from common service

    this.service.moduleId.subscribe(data => {
      this.moduleId = data; // Subscribe to service's observable to receive data
    });

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
    this.getUserPermissions();
  }
  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }

  public filterData: any = {};
  setFilters(item: any) {
    this.filterData = item;
    this.listView = false;
    setTimeout(() => {
      this.getUserPermissions();
    }, 100)

  }

  public pdfData: any;
  public totalPageShow: any;
  public pageSize: any;
  //Purpose: fetch user-role listing
  getUserPermissions() {
    let filters = { "moduleId": this.moduleId, "fromDate": this.filterData.fromDt, "toDate": this.filterData.toDt, "logAction": this.filterData.logAction, "userId": this.filterData.userId, "type": this.filterData.type };

    this.totalPageShow = this.pageRecordsTotal;
    if (this.filterData.fromDt == "") {
      this.pageRecordsTotal = this.totalPageShow;
    } else {
      this.pageRecordsTotal = this.pageRecordsTotal
    }


    this.listView = true;
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
        const defaultOrdering = '-CREATED_DATE';
        this.commonService.dataTableParams(
          params,
          dataTablesParameters,
          this.page,
          this.size,
          this.pageRecordsTotal,
          this.search,
          defaultOrdering,
          filters,
          this.otherParams = this.moduleId,

        );
        this.ngxLoader.start();
        //const url = '/getLogDetails';
        const url = '/getLogFilterDetails';
        this.getPermissionLogDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.loaderdata = false;
          this.ngxLoader.stop();
          if (resp.result) {
            if (resp.result) {



              this.permiossionLogList = resp.result.map((data: any) => {
                return {
                  ...data,
                  checked: false,
                };
              });

            } else {
              this.permiossionLogList = [];
            }
            if (resp.propertyObj[0].COUNT || resp.propertyObj[0].COUNT == 0) {
              this.pageRecordsTotal = resp.propertyObj[0].COUNT;
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
            this.permiossionLogList = [];
          }
        },
          (error) => {
            this.permiossionLogList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.permiossionLogList = [];
          }
        );
      },

      columns: [
        { orderable: false, data: '' },
        { orderable: true, data: 'LOG_CREATED_BY' },
        { orderable: true, data: 'LOG_ACTION' },
        { orderable: true, data: 'MODULE_NAME' },
        { orderable: true, data: 'LOG_CREATED_DATE' },
        { orderable: false, data: '' }
      ],
    };
  }



  dialogBoxRole(item: any) {
    let oldValue = JSON.parse(item.LOG_OLD_VALUE);

    let newValue = JSON.parse(item.LOG_NEW_VALUE);
    let changesData = this.findChangesChange(oldValue, newValue);
    const dialogRef = this.dialog.open(MonitoringPermissionDialogboxComponent,
      {
        data: {
          heading: 'Confirmation',
          title: 'Permission Logs',
          buttonName: 'ok',
          changesData: changesData,
          moduleName: this.moduleName,
          headerName: this.roleName,
          action_date: item.LOG_CREATED_DATE,
          action_by: item.USER_NAME,
          del_reason: item.LOG_DEL_REASON,
          logAction: item.LOG_ACTION
        },
        width: '667px',
        height: 'auto'
      }
    );
    dialogRef.afterClosed().subscribe((customResultData: any) => {
      dialogRef.close();
    });
  }

  public newTypePermissionLogData: any

  dialogBoxType(item: any) {

    let oldValueData = JSON.parse(item.LOG_OLD_VALUE);
    let newValueData = JSON.parse(item.LOG_NEW_VALUE);
    //getTypePermissionDataLog


    setTimeout(() => {
      const dialogRef = this.dialog.open(MonitoringTypePermissionComponent,
        {
          data: {
            heading: 'Confirmation',
            title: 'Permission Logs',
            buttonName: 'ok',
            oldData: oldValueData,
            newData: newValueData,
            // logName: item.LOG_NAME,
            headerName: item.LOG_NAME,
            action_date: item.LOG_CREATED_DATE,
            action_by: item.USER_NAME,
            del_reason: item.LOG_DEL_REASON,
            logAction: item.LOG_ACTION
          },
          width: '868px',
          height: 'auto'
        }
      );
      dialogRef.afterClosed().subscribe((customResultData: any) => {
        dialogRef.close();
      });
    }, 100);





  }


  public moduleName: any = new Set();
  public roleName: any;
  findChanges(oldArray: any, newArray: any) {
    let changes: any = [];
    // Check if both oldArray and newArray have elements
    if (oldArray?.length === 0 || newArray?.length === 0) {
      return changes; // If any of them is empty, return empty changes
    }
    // Iterate over all elements in newArray (assuming both arrays have the same length)
    for (let i = 0; i < newArray?.length; i++) {
      const oldValue = oldArray[i] ? oldArray[i] : null;
      const newValue = newArray[i];
      // Iterate over keys in newValue object
      for (const key in newValue) {
        if (key != "MODULES NAME" && key != "ROLE NAME") {
          this.moduleName?.add(newArray[i]['MODULES NAME']);
          this.roleName = newArray[i]['ROLE NAME'];
          changes.push({
            changeValue: key,
            // oldValue: oldValue ? oldValue[key] : '',
            // newValue: newValue[key] ? newValue[key] : '',
            oldValue: (oldValue ? oldValue[key] : 'NA') || (oldValue[key] === null ? 'NA' : oldValue[key]),
            newValue: newValue[key] === null ? 'NA' : newValue[key],
            moduleName: newArray[i]['MODULES NAME'],

          });

        }
      }
    }
    return changes;
  }

  findChangesChange(oldArray: any = [], newArray: any = []) {
    let changes: any = [];
    let commonOld = [];
    let commonNew = [];
    for (let i = 0; i < newArray?.length; i++) {
      if (oldArray?.find((e: any) => e['MODULES NAME'] == newArray[i]['MODULES NAME'])) {
        commonOld.push(oldArray?.find((e: any) => e['MODULES NAME'] == newArray[i]['MODULES NAME']));
        commonNew.push(newArray[i]);

      }
    }

    let result = this.findChanges(commonOld, commonNew)

    result ? changes = [...result] : '';
    for (let i = 0; i < commonOld?.length; i++) {
      oldArray.splice(oldArray.indexOf(commonOld[i]), 1);
      newArray.splice(newArray.indexOf(commonNew[i]), 1);
    }
    // Iterate over all elements in newArray (assuming both arrays have the same length)
    for (let i = 0; i < newArray?.length; i++) {
      // Iterate over keys in newValue object
      for (const key in newArray[i]) {
        // Check if oldValue is null or if the value for the current key is different in oldValue and newValue
        if (key != "MODULES NAME" && key != "ROLE NAME") {
          this.moduleName?.add(newArray[i]['MODULES NAME']);
          this.roleName = newArray[i]['ROLE NAME'];
          changes.push({
            changeValue: key,
            //oldValue: '',
            oldValue: 'NA',
            newValue: newArray[i][key] === null ? 'NA' : newArray[i][key],
            //newValue: newArray[i][key],
            moduleName: newArray[i]['MODULES NAME'],

          });
        }

      }

    }


    //used for old array

    for (let i = 0; i < oldArray?.length; i++) {
      // Iterate over keys in newValue object
      for (const key in oldArray[i]) {

        // Check if oldValue is null or if the value for the current key is different in oldValue and newValue
        if (key != "MODULES NAME" && key != "ROLE NAME") {
          this.moduleName?.add(oldArray[i]['MODULES NAME']);
          this.roleName = oldArray[i]['ROLE NAME'];
          changes.push({
            changeValue: key,
            //oldValue: oldArray[i][key],
            //newValue: '',
            oldValue: oldArray[i][key] === null ? 'NA' : oldArray[i][key],
            newValue: 'NA',
            moduleName: oldArray[i]['MODULES NAME']
          });
        }

      }
    }
    return changes;
  }





  public customDataObj: any;
  public customDataObjExel: any;
  public sendCustomData: any = [];
  public sendCustomDataExcel: any = [];
  public listkeys: any
  ExportPdfClick(data: any) {

    this.sendCustomData = [];
    let url = "/getLogFilterDetails?page=1&size=" + this.pageRecordsTotal + "&search=" + this.search + "&ordering=-CREATED_DATE&moduleId="
      + this.moduleId + "&logAction=" + data.logAction + "&fromDate=" + data.fromDt + "&toDate=" + data.toDt + "&userId=" + data.userId + "&type=" + data.type;
    this.service.getAPIMethod(url).subscribe(res => {

      let getResult = res.result;

      getResult.forEach((item: any) => {
        this.customDataObj = {
          "S.no": item['RN'],
          "Action Performed By": item['USER_NAME'],
          "Log Action": item['LOG_ACTION'],
          "Module Name": item['MODULE_NAME'],
          "Action Date": item['LOG_CREATED_DATE']
        }

        this.sendCustomData.push(this.customDataObj)
      });


      if (this.sendCustomData?.length > 0) {
        this.slaservice.exportAsPdfFileLogs(this.sendCustomData, data, "Permission")
      }
      else {
        this.service.sweetAlertMsg('error', 'Data not Found');
        return;
      }

    });
  }

  ExportExcelClick(data: any) {
    this.sendCustomDataExcel = [];
    let url = "/getLogFilterDetails?page=1&size=" + this.pageRecordsTotal + "&search=" + this.search + "&ordering=-CREATED_DATE&moduleId="
      + this.moduleId + "&logAction=" + data.logAction + "&fromDate=" + data.fromDt + "&toDate=" + data.toDt + "&userId=" + data.userId + "&type=" + data.type;
    this.service.getAPIMethod(url).subscribe(res => {
      res.result.forEach((item: any) => {
        this.listkeys = ["S.no", "Action Performed By", "Log Action", "Module Name", "Action Date"];
        Object.keys(item).forEach(key => {
          this.customDataObjExel = {
            "S.no": item['RN'],
            "Action Performed By": item['USER_NAME'],
            "Log Action": item['LOG_ACTION'],
            "Module Name": item['MODULE_NAME'],
            "Action Date": item['LOG_CREATED_DATE']
          }
        });
        this.sendCustomDataExcel.push(this.customDataObjExel)
      });

      if (this.sendCustomDataExcel?.length > 0) {
        this.slaservice.exportExcelFileLogs(this.sendCustomDataExcel, this.listkeys, data, 'Permission')
      }
      else {
        this.service.sweetAlertMsg('error', 'Data not Found');
        return;
      }

      //this.slaservice.exportAsPdfFileLogs(this.sendCustomData, 'User')
    });
  }


  typePermission() {

  }












}

