import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { debounceTime } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from 'src/app/services/socket.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { MonitoringCreationComponent } from '../monitoring-creation/monitoring-creation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-monitoring-listing',
  templateUrl: './monitoring-listing.component.html',
  styleUrls: ['./monitoring-listing.component.scss']
})
export class MonitoringListingComponent implements OnInit {
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

  public jobList: any = [];
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public search: string = '';

  public fileContent: any;

  constructor(public dialog: MatDialog, public route: Router, public service: CommonService, public commonService: CommonHelperService, public ngxLoader: NgxUiLoaderService, private socketService: SocketService) { }

  ngOnInit(): void {
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
  }








  viewStepsMonitoring(id: any) {


    const jobId = id;

    //changeData() {
    this.service.getJobId(jobId);
    // }

    //this.route.navigate(['/MIS/operation/step-monitoring',);


    this.route.navigateByUrl('/MIS/operation/step-monitoring');



    // this.getMonitoringListing(id);

    // this.socketService.jobMonitoring().subscribe((data) => {

    //   this.listingArr = data;

    //   if (this.listingArr?.length > 0) {
    //     this.listingArr?.forEach((item: any) => {

    //       item.INPROGRESS_PROCESS != 0 ? this.noOfprocessCount = true : '';

    //       item.STATUS == 'InProgress' ? this.filePathName = item?.FILE_PATH : '';
    //     })
    //   }
    //   console.log(this.filePathName, "lllllllllllooiuui")
    //   this.getFileRead(this.filePathName)

    // });

    // setTimeout(() => {
    //   this.listingDiv = true;
    //   this.stepsDiv = false;
    //   // this.scrollToBottom();

    // });

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
        //this.getMonitoringListing('');
      }
    });
    //}else{
    //this.service.sweetAlertMsg('error',"Job Process is InProgess State")
    // }
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
              this.jobList = resp.result[0].map((data: any) => {
                return {
                  ...data,
                  checked: false,
                };
              });
            } else {
              this.jobList = [];
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
            this.jobList = [];
          }
        },
          (error) => {
            this.jobList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.jobList = [];
          }
        );
      },

      columns: [
        { orderable: false, data: '' },
        { orderable: true, data: 'JOB_NAME' },
        { orderable: true, data: '' },
        { orderable: true, data: '' },
        { orderable: false, data: '' },
        { orderable: false, data: '' }
      ],
    };
  }


  backToViewPage() {

  }



}
