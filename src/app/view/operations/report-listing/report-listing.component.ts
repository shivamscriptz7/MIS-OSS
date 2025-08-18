import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { ReportCreationComponent } from '../report-creation/report-creation.component';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-report-listing',
  templateUrl: './report-listing.component.html',
  styleUrls: ['./report-listing.component.scss']
})
export class ReportListingComponent implements OnInit {
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public getReportListing: Subscription | any;
  public search: string = '';
  public rdering: string = '';
  public otherParams: any;
  public userDetails: any; //kajal code for getting localstorage value
  public permissionKeys: any;
  public module: any;
  public userId: any;
  public assignCount: any;


  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  columnDefs: any = [
    { orderable: false, targets: 3 },
    { orderable: true, targets: '_all' }
  ];
  repoList: any = [];
  constructor(public commonService: CommonHelperService,
    public dialog: MatDialog,
    public service: CommonService,
    public ngxLoader: NgxUiLoaderService,
    public route: Router
  ) { }


  ngOnInit(): void {

    setTimeout(() => {
      let permissionData: any = localStorage.getItem("permission");
      let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      let parsed_data = JSON.parse(permissions)
      this.permissionKeys = JSON.parse(parsed_data.MODULES);
      this.module = this.permissionKeys.filter((item: any) => item.module_id === 19);
    }, 1000);



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
    this.getReportDetails();
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);

    this.userId = this.userDetails.USER_ID;


  }
  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }

  //Purpose: fetch user-report listing
  //public repopath:any;
  getReportDetails() {
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
        this.otherParams = { userId: this.userDetails.USER_ID }
        const defaultOrdering = '-CREATED_DATE';
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
        const url = '/getReportListing';
        this.getReportListing = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.loaderdata = false;
          this.ngxLoader.stop();
          if (resp.result[0]) {
            if (resp.result[0]) {
              this.repoList = resp.result[0].map((data: any) => {

                return {
                  ...data,
                  checked: false,
                };
              });
            } else {
              this.repoList = [];
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
            this.repoList = [];
          }
        },
          (error) => {
            this.repoList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.repoList = [];
          }
        );
      },

      columns: [
        { orderable: false, data: '' },
        { orderable: true, data: 'REPO_NAME' },
        { orderable: true, data: 'EXECUTION_TYPE' },
        { orderable: true, data: 'TYPE_NAME' },
        { orderable: true, data: 'REPO_HEADER' },
        { orderable: true, data: 'QUERY' },
        { orderable: true, data: 'STATUS' },
        { orderable: false, data: '' }
      ],
    };
  }



  // Add-Update Report
  addUpdateReport(list: any) {
    if (((list.REPOID == null || list.REPOID == '') && this.module[0].CREATE_ACCESS == 1) || (!(list.REPOID == null || list.REPOID == '') && this.module[0].EDIT_ACCESS == 1 && list.STATUS != 1)) {
      const dialogRef = this.dialog.open(ReportCreationComponent, {
        disableClose: true,


        data: {
          details: list,
          title: list?.id ? 'Edit Report' : 'Create Report',
          buttonName: 'Submit',
        },
        width: '720px',
        height: 'auto',
      });
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          this.getReportDetails();
        }
      });
    }
    else {
      this.service.sweetAlertMsg('error', ' You do not have the permissions or the report is inactive.');
    }
  }

  public reportId: any;
  // delete report 
  deleteReport(item: any) {
    this.reportId = item.REPOID;
    this.service.getAPIMethod(`getAssignReportCount?REPOID=${this.reportId}`).subscribe((res: any) => {
      this.assignCount = res.result[0]?.ASSIGNED_REPORT;
      let reportName = item.REPO_NAME;
      // let reportName = item.REPO_NAME?.length > 10 ? (item.REPO_NAME) + '...' : item.REPO_NAME;

      let reportNameToolTip = item.REPO_NAME && item.REPO_NAME.length > 20
        ? `${item.REPO_NAME.slice(0, 30)}...`
        : item.REPO_NAME;
      if (this.module[0].DELETE_ACCESS == 1) {
        const dialogRef = this.dialog.open(DeleteDialogBoxComponent, {
          data: {
            heading: 'Delete Report ' + reportName,
            title: 'Are you sure you want to delete the report ' + reportNameToolTip + ' and its details?' + 'This report is assign to ' + this.assignCount + ' permissions.',
            buttonName: 'Yes Delete',
            panelClass: 'custom-modalbox'
          },
          width: '400px',
          height: 'auto'
        });


        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            const delReportrtObj = {
              action_type: 'delete',
              REPOID: JSON.stringify(item.REPOID),
              action: '1',
              delete_reason: closeResult.reason

            }
            this.ngxLoader.start();
            this.service.postAPIMethod('/activeDeleteReport', delReportrtObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsgWarning('error', response.result[0].MSG);
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);
                this.getReportDetails();
              }
            });
          }
        });
      }
      else {
        this.service.sweetAlertMsg('error', 'You do not have the permissions')
      }
    });
  }

  // Purpose to activate or deactivate  report status
  onToggleChangeReport(obj: any, events: any) {

    if (this.module[0].EDIT_ACCESS == 1) {
      events.target.checked = !events.target.checked;
      const isActive = obj.STATUS == '1' ? '0' : '1';
      const delReportObj = {
        action_type: 'active',
        REPOID: JSON.stringify(obj.REPOID),
        action: isActive,
      }
      const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,

        {

          data: {
            heading: 'Confirmation',
            title: obj.STATUS == '1' ? "Do you want to activate the Report?" : "Do you want to deactivate the Report?",
            buttonName: 'Submit'
          },
          width: '400px',
          height: 'auto'
        }
      );

      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          this.ngxLoader.start();
          this.service.postAPIMethod("/activeDeleteReport", delReportObj).subscribe((response: any) => {
            this.ngxLoader.stop();
            if (response.result[0].ERR == 'X') {
              this.service.sweetAlertMsgWarning('error', response.result[0].MSG)
            }
            else {
              this.service.sweetAlertMsg('success', response.result[0].MSG);
              this.getReportDetails();
            }
          })
        }
      });
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have the permissions.')
    }
  }

}





function slice(arg0: number, arg1: number) {
  throw new Error('Function not implemented.');
}

