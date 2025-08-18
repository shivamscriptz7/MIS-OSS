import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { MonitoringDialogBoxComponent } from 'src/app/view/dialogbox/monitoring-dialog-box/monitoring-dialog-box.component';
import { ExportSlaExcelService } from 'src/app/services/export-sla-excel.service';

@Component({
  selector: 'app-process-monitoring',
  templateUrl: './process-monitoring.component.html',
  styleUrls: ['./process-monitoring.component.scss']
})
export class ProcessMonitoringComponent implements OnInit {
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public getUserLogDetails: Subscription | any;
  public search: string = '';
  public otherParams: any;
  public moduleId: any;
  public oldValue: any;
  public newValue: any;
  public changesData: any = [];
  public logList: any = [];
  public listView: any = false;

  public filter: any = {}
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


  public dataTosend: any = "Dummy";
  @Output() sendData = new EventEmitter<any>();

  sendDataToParent() {
    this.sendData.emit(this.dataTosend);
  }


  ngOnInit(): void {

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
    this.getUserLogData();
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
      this.getUserLogData();
    }, 100)

  }


  public totalPageShow: any
  //Purpose: fetch user-log listing
  getUserLogData() {

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
          this.otherParams
        );
        this.ngxLoader.start();
        const url = '/getLogFilterDetails';
        this.getUserLogDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {

          this.loaderdata = false;
          this.ngxLoader.stop();
          if (resp.result) {
            if (resp.result) {
              //this.pdfData = resp.result
              //this.service.pdfLogsData(this.pdfData);
              this.logList = resp.result.map((data: any) => {

                return {
                  ...data,
                  checked: false,
                };
              });

            } else {
              this.logList = [];
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
            this.logList = [];
          }
        },
          (error) => {
            this.logList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.logList = [];
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

  public oldLogData: any;
  dialogBox(item: any) {
    if (item.LOG_DEL_REASON == null || item.LOG_DEL_REASON == '') {
      this.oldLogData = JSON.parse(item.LOG_OLD_VALUE);
    }
    else {
      this.oldLogData = JSON.parse(item.LOG_OLD_VALUE);
      const logDelReasonObj = { 'DELETE REASON': item.LOG_DEL_REASON };
      // Add the new key-value pair to the first object in the array
      this.oldLogData[0] = { ... this.oldLogData[0], ...logDelReasonObj };
      // Convert back to JSON string
      item.LOG_OLD_VALUE = JSON.stringify(this.oldLogData);
    }
    let newValue = JSON.parse(item.LOG_NEW_VALUE);
    let changesData = this.findChanges(this.oldLogData, newValue);
    const dialogRef = this.dialog.open(MonitoringDialogBoxComponent,
      {
        data: {
          heading: 'Confirmation',
          title: 'Monitoring Logs',
          buttonName: 'ok',
          changesData: changesData,
          logAction: item.LOG_ACTION,
          logName: item.LOG_NAME,
          logCreatedBy: item.USER_NAME,
          logDate: item.LOG_CREATED_DATE

        },
        width: '667px',
        height: 'auto'
      }
    );
    dialogRef.afterClosed().subscribe((customResultData: any) => {
      dialogRef.close();
    });
  }

  findChanges(oldArray: any = [], newArray: any = []) {
    let changes = [];
    const oldValue = oldArray ? oldArray[0] : null;
    const newValue = newArray ? newArray[0] : null;
    if (newValue) {
      for (const key in newValue) {
        if (!oldValue || (oldValue[key] !== newValue[key])) {
          changes.push({
            changeValue: key,
            oldValue: (oldValue ? oldValue[key] : 'NA') || (oldValue[key] === null ? 'NA' : oldValue[key]),
            newValue: newValue[key] === null ? 'NA' : newValue[key]
          });
        }
      }
    } else {
      for (const key in oldValue) {
        if (!newValue || (oldValue[key] !== newValue[key])) {
          changes.push({
            changeValue: key,
            oldValue: oldValue[key] === null ? 'NA' : oldValue[key],
            newValue: newValue ? newValue[key] : 'NA'
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
          "Job Name": item['LOG_NAME'],
          "Action Date": item['LOG_CREATED_DATE']
        }

        this.sendCustomData.push(this.customDataObj)
      });

      if (this.sendCustomData?.length > 0) {
        this.slaservice.exportAsPdfFileLogs(this.sendCustomData, data, 'Monitoring')
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
        this.listkeys = ["S.no", "Action Performed By", "Log Action", "Job Name", "Action Date"];
        Object.keys(item).forEach(key => {
          this.customDataObjExel = {
            "S.no": item['RN'],
            "Action Performed By": item['USER_NAME'],
            "Log Action": item['LOG_ACTION'],
            "Job Name": item['LOG_NAME'],
            "Action Date": item['LOG_CREATED_DATE']
          }
        });
        this.sendCustomDataExcel.push(this.customDataObjExel)
      });

      if (this.sendCustomDataExcel?.length > 0) {
        this.slaservice.exportExcelFileLogs(this.sendCustomDataExcel, this.listkeys, data, 'Monitoring')
      }
      else {
        this.service.sweetAlertMsg('error', 'Data not Found');
        return;
      }


      //this.slaservice.exportAsPdfFileLogs(this.sendCustomData, 'User')
    });
  }



}

