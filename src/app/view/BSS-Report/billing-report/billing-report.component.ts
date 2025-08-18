import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IDatePickerConfig } from 'ng2-date-picker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/services/common.service';
import { ExportSlaExcelService } from 'src/app/services/export-sla-excel.service';
import { LocalshareService } from 'src/app/services/localshare.service';
import * as CryptoJS from 'crypto-js';
import { ElementRef } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { CustomPdfDownloadBoxComponent } from '../../dialogbox/custom-pdf-download-box/custom-pdf-download-box.component';
import { data } from 'jquery';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';


@Component({
  selector: 'app-billing-report',
  templateUrl: './billing-report.component.html',
  styleUrls: ['./billing-report.component.scss'],

})
export class BillingReportComponent implements OnInit {
  @ViewChild('pdfViewer') public pdfViewer: any;

  @ViewChild('externalPdfViewer') public externalPdfViewer: any;
  @ViewChild('reportForm') reportForm: any;
  public selectedReportQuery: any;
  public listKeys: any = [];
  public headerList: any = [];
  public dataList: any = [];
  public tableShown: boolean = false;
  public selectedQueryResult: any;
  public selectedReportName: any;
  public top50Data: any = [];
  public classTrue: boolean = false;
  public filterBtn: boolean = true;
  public exportButtonEnable: boolean = false;
  public errorShown: boolean = false;
  public selectedTypeId: any;
  public selectedRepoFilter: any;
  public selectedRepoCircle: any;
  public selectedRepoBA: any;
  public filterKeys: any = [];
  public filterKeyForm: FormGroup;
  public isFormValid = true;
  public requiredFiled = false;
  public requiredBAFiled = false;
  public exportScheduleButton = false;
  public reportArr: any = [];
  // Create Object for getData()
  public mainObject: any = {
    Report_Generate_On: new Date()
  };
  public filterkeys: any = {
    circleField: '',
    baField: ''
  }
  filterCircleBaName = {
    Circle: '',
    BA: ''
  }
  public config: IDatePickerConfig = {
    format: 'YYYY-MM-DD',
    firstDayOfWeek: 'su',
    monthFormat: 'MMM, YYYY',
    yearFormat: 'YYYY',
    monthBtnFormat: 'MMM',
    hideInputContainer: false,
  };

  public selectedDevice: any = 'export';
  public edited = false;  // Export header hide
  public circleData: any = [];
  show = false;  // loader hide
  fullScreen = true;
  public isFilterShown: boolean = false;
  selectedReportHeader: any;
  errorMsg: any;
  public cirleArr: any = [];
  public ssaListData: any;
  selectedRepoFormat: any;
  selectedRepoLink: any;
  filePath: any;
  selectedRepoId: any;
  repoNameFormat: any;
  repoScheduleFormat: any;
  repoStatus: any;
  currentRepoName: any;
  selectedReport: any = [];
  selectedFormat: any;
  selectedTypeName: any;
  filteredReports: any = [];
  bredCrumParentName: any = [];
  public bredcrumObj: any;


  constructor(

    // public dialogRef: MatDialogRef<BillingReportComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialog: MatDialog) {
    //   dialogRef.disableClose = true,

    public dialog: MatDialog,
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private excelService: ExportSlaExcelService, public fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private service: CommonService, public localShareService: LocalshareService, public ngxLoader: NgxUiLoaderService) {
    this.filterKeyForm = this.fb.group({

    })
  }

  ngOnInit(): void {
    this.getTypeId();
    this.getReportsData();
    this.getCircleData();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        location.reload();
        this.selectedReport = [];
        this.errorShown = false;
        this.tableShown = false;
        this.selectedFormat = '';
        this.isFilterShown = false;
        this.selectedRepoFilter = '';
        this.selectedRepoBA = '';
        this.selectedRepoCircle = '';
        this.selectedRepoFormat = '';
        this.selectedReportName = '';

        //this.bredCrumParentName=[];
        //this.bredcrumObj='';
      }



    });

    let bredcrumData: any = localStorage.getItem('selectedparentName');
    let decryptBredCurmData = CryptoJS.AES.decrypt(bredcrumData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.bredcrumObj = JSON.parse(decryptBredCurmData)
    this.bredCrumParentName.push(this.bredcrumObj);
  }





  getTypeId() {
    this.ngxLoader.start();
    this.localShareService.selectedTypeId.subscribe((msg: any) => {
      this.errorShown = false;
      this.selectedTypeId = msg;
      this.getReportsData();
      this.ngxLoader.stop();
    })

    this.localShareService.sharedData.subscribe((msg: any) => {
      this.selectedTypeName = msg;

    })


  }


  // display circleName in Html
  displayCircleName(item: any) {
    let name = '';
    this.circleData.forEach((element: any) => {

      if (element.CIRCLE_ID === item) {
        name = element.CIRCLE_NAME;
      }
    });
    return name;
  }
  displayBaName(item: any) {
    let name = '';
    this.ssaListData.forEach((element: any) => {
      if (element.SSA_CODE === item) {
        name = element.SC_DESC;
      }
    });

    return name;
  }

  // get all reports based on type
  getReportsData() {
    this.service.getAPIMethod(`/fetchReportListData?type_id=${this.selectedTypeId}`).subscribe((res => {
      this.reportArr = res.result;

      this.getRepoFilter('All');
    }));

  }

  formatDate(date: any) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  public searchData: any = "";
  public duplicatefilteredReports: any = [];
  public repofilterStringDate: any = [];
  public repofilterCirclrBa: any = [];
  // use this function search from listing 
  searchFunction() {
    this.filteredReports = [...this.duplicatefilteredReports]
    this.filteredReports = this.duplicatefilteredReports.filter((item: any) => {
      return item.REPO_NAME.toLowerCase().indexOf(this.searchData.toLowerCase()) >= 0;
    })


  }

  public duplicateSelectedReportQuery: any = '';
  public repoFolder: any;
  // on report click 
  getReportQuery(event: any) {



    this.ssaListData = [];
    this.repofilterStringDate = [];
    this.filterCircleBaName.BA = ''
    this.filterCircleBaName.Circle = ''
    //this.repofilterCirclrBa.baField = [];
    // this.filterkeys.circleField = '';
    // this.filterkeys.baField = '';
    this.tableShown = false;
    this.exportButtonEnable = false;
    this.exportScheduleButton = false;
    this.errorShown = false;
    this.filterBtn = false;
    this.classTrue = true;
    this.isFilterShown = true;
    this.selectedReportName = event.REPO_NAME;
    this.selectedRepoId = event.REPOID;
    this.selectedReportQuery = event.QUERY.toLowerCase();
    this.duplicateSelectedReportQuery = event.QUERY.toLowerCase();
    this.selectedReportHeader = event.REPO_HEADER;
    this.selectedRepoFilter = JSON.parse(event.REPORT_FORMAT);
    this.selectedRepoFormat = event.PROCESS_TYPE;
    this.selectedFormat = event.EXECUTION_TYPE;

    if (this.selectedFormat == '1') {
      this.exportScheduleButton = true;
      this.service.getAPIMethod(`/getSelectedRepoLink?selectedRepoId=${this.selectedRepoId}`).subscribe((res) => {
        this.repoNameFormat = res.result;
        this.selectedReport = res.result;



        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Pad month with leading zero if necessary
        const monthYearDir = `${month}_${year}`;

        this.repoFolder = monthYearDir;




        this.currentRepoName = this.selectedReport.REPORT_NAME?.split(',');
        this.repoStatus = this.selectedReport.RECENT_STATUS;
        this.repoScheduleFormat = this.selectedReport?.map((e: any) => {
          return e.REPO_FORMATS;
        });
      });


    }
    this.selectedRepoLink = event.CURRENT_REPO_PATH;

    //console.log(this.selectedRepoLink, "selectedRepoLinkselectedRepoLink")
    this.selectedRepoFilter?.forEach((e: any) => {
      e.isRequired = true;
    })
    this.selectedRepoBA = event.REPORT_BA;
    if (this.selectedRepoBA) {
      this.requiredBAFiled = true;
    }
    this.selectedRepoCircle = event.REPORT_CIRCLE;
    if (this.selectedRepoCircle) {
      this.requiredFiled = true;
    }

  }


  onItemSelectCircle(circleId: any) {
    this.cirleArr = circleId;
    this.service.getAPIMethod(`/getFilterBaData?circle_id=${this.cirleArr}`).subscribe((res => {
      this.ssaListData = res.result;
    }));

  }


  public lastDisplayedIndex = 0;

  // for execute Billing query
  executeBillingQuery() {

    this.tableShown = true;
    this.errorShown = false;
    this.top50Data = [];
    this.listKeys = [];
    let param = {
      'selectedQuery': this.selectedReportQuery.toString().replace(';', '').trim(),
      'type': this.selectedRepoFormat
    }
    this.ngxLoader.start();
    this.service.getAPIMethod(`/executeBillingQuery?dataSet=${encodeURIComponent(JSON.stringify(param))}`).subscribe((res) => {
      if (res.result[0]?.ERR) {
        this.top50Data = [];
        this.listKeys = [];
        this.errorShown = true;
        this.ngxLoader.stop();
        this.errorMsg = res.result[0].ERR;
        this.exportButtonEnable = false;
        // this.sweetAlertMsg('error', res.result[0].ERR);
      } else {
        this.exportButtonEnable = true;
        this.selectedQueryResult = res?.result;
        if (this.selectedQueryResult.errorNum) {
          this.errorShown = true;
          this.exportButtonEnable = false;
          this.ngxLoader.stop();
        }

        if (this.selectedQueryResult?.length == 0) {
          this.tableShown = false;
          this.exportButtonEnable = false;
        }

        this.top50Data = this.selectedQueryResult?.slice(0, 20);
        this.ngxLoader.stop();
        this.selectedQueryResult.forEach((element: any) => {
          this.listKeys = Object.keys((element));
        });
      }
    })



  }

  public scrollData = [];
  public index = 20;
  public limit = 20;
  onScroll(ev: any) {
    const scrollContainer = ev.target;
    // Check if the scroll position is at the bottom
    if (scrollContainer.scrollHeight - parseInt(scrollContainer.scrollTop) - 30 <= scrollContainer.clientHeight) {
      // Load more data when scrolled to the bottom
      this.scrollData = this.selectedQueryResult.splice(this.index, this.limit);
      if (this.scrollData.length > 0) {
        this.top50Data = this.top50Data.concat(this.scrollData);
        this.index += this.limit;
      }
    }
  }



  getCircleData() {
    this.service.getAPIMethod('/getFilterCircleData').subscribe((res => {
      this.circleData = res.result
    }));
  }
  // download excel
  downloadExcel() {
    this.excelService.exportExcelFile(this.selectedQueryResult, this.listKeys, this.selectedReportName, this.selectedReportHeader, this.repofilterStringDate, this.filterCircleBaName)
  }
  public array: any;

  // download pdf 
  downloadPDF() {
    if (this.listKeys.length < 11) {
      this.excelService.exportAsPdfFile(this.selectedQueryResult, this.selectedReportName, this.selectedReportHeader, this.repofilterStringDate, this.filterCircleBaName);
    }
    else {
      // we are using this pop up for selecting default or custom.
      const dialogRef = this.dialog.open(CustomPdfDownloadBoxComponent,
        {
          data: {
            heading: 'Confirmation',
            title: 'Download report as custom or default',
            buttonName: 'ok',
            customData: this.listKeys,
            queryData: this.top50Data,
            selectedReport: this.selectedReportName
          },
          width: '600px',
          height: 'auto'
        }
      );
      dialogRef.afterClosed().subscribe((customResultData: any) => {
        // defaultDataFlag it is used for selecting download default report.
        if ((customResultData.defaultKeys?.length == 0 && customResultData.defaultDataFlag == 1) || (customResultData.defaultKeys?.length != 0 && customResultData.defaultDataFlag == 1)) {
          this.excelService.exportAsPdfFile(this.selectedQueryResult, this.selectedReportName, this.selectedReportHeader, this.repofilterStringDate, this.filterCircleBaName);
        }
        else {
          // customDataFlag it is used for selecting download default report and we store custom data in this variable  customResultData.customData
          if (customResultData.customData != 0 && customResultData.customDataFlag != 1) {
            this.excelService.exportAsPdfFile(customResultData.customData, this.selectedReportName, this.selectedReportHeader, this.repofilterStringDate, this.filterCircleBaName);
          } else {
            dialogRef.close();
          }
        }
      });
    }
  }
  // download CSV
  downloadCSV() {
    this.excelService.exportAsCsvFile(this.selectedQueryResult, this.selectedReportName, this.selectedReportHeader);
  }



  submitForm(reportForm: any) {
    this.filterCircleBaName.BA = ''
    this.filterCircleBaName.Circle = ''


    this.selectedReportQuery = this.duplicateSelectedReportQuery;
    let count = 0;
    let a = this.selectedReportQuery.split('');
    let a1 = [];
    for (let i = 0; i < a.length; i++) {
      if (a1.length == 0 && a[i] == "'") {

        a1.push(a[i]);
      } else {
        if (a[i] == "'") {
          a1.pop();
        }
      }
      if (a1.length > 0 && a[i] == "#") {
        a[i] = '@'
      }
    }
    this.selectedReportQuery = a.join('');
    this.selectedRepoFilter?.forEach((element: any, i: any) => {
      let currentdate = this.formatDate(new Date(element.dyncdate))
      this.selectedRepoFilter[i].dyncdate = currentdate;
      let value = element.type === 'Date' ? `'${currentdate}'` : `'${element.inputField?.toString()}'`;
      this.selectedReportQuery = this.selectedReportQuery.replaceAll(`#${element.input.toLowerCase()}`, value);
      this.selectedReportQuery = this.selectedReportQuery.replaceAll(`@${element.input.toLowerCase()}`, element.inputField?.toString());
    });

    Object.keys(this.filterkeys).forEach((ele: any) => {
      if (ele === 'circleField') {
        this.selectedReportQuery = this.selectedReportQuery.replaceAll('#circle', `${this.filterkeys[ele]}`);
      } else {
        if (this.reportForm.controls['baField']?.value[0] == '-1') {
          this.selectedReportQuery = this.selectedReportQuery.replaceAll(`#ba`, `${this.baArr}`);
        } else {
          this.selectedReportQuery = this.selectedReportQuery.replaceAll(`#ba`, `${this.filterkeys[ele]}`);
        }
      }
    });

    let keyData = JSON.stringify(this.filterkeys);
    let dateStingValue = JSON.stringify(this.selectedRepoFilter)
    this.repofilterCirclrBa = JSON.parse(keyData);
    this.repofilterStringDate = JSON.parse(dateStingValue);
    this.filterCircleBaName.Circle = this.circleData.find((e: any) => e.CIRCLE_ID == this.repofilterCirclrBa.circleField)?.CIRCLE_NAME;
    let baName = '';
    let baArrayName = '';

    if (this.reportForm.controls['baField']?.value[0] == '-1') {
      baArrayName = this.baArr;
    } else {
      baArrayName = this.repofilterCirclrBa.baField
    }

    for (let i = 0; i < baArrayName?.length - 1; i++) {
      baName += this.ssaListData.find((e: any) => e.SSA_CODE == baArrayName[i])?.SC_DESC + ', '
    }


    baName += this.ssaListData.find((e: any) => e.SSA_CODE == baArrayName[baArrayName?.length - 1])?.SC_DESC
    this.filterCircleBaName['BA'] = baName;
    this.executeBillingQuery();
    reportForm.form.reset();
    this.allSSACheck = false;
    this.ssaCheck = false;
    this.ssaListData = [];
    //this.filterkeys.circleField = '';
    //this.filterkeys.baField = '';
  }



  resetForm(reportForm: any) {
    this.filterkeys.circleField = [];
    this.filterkeys.baField = [];
    reportForm.form.reset();
    this.ssaListData = [];
    this.baArr = [];
    this.allSSACheck = false;
    this.ssaCheck = false;
  }

  public isActiveClass: any;
  getRepoFilter(value: any) {
    this.isActiveClass = value;
    this.filteredReports = this.reportArr?.filter((report: any) => {
      if (value === 'All') {
        return true; // Include all reports when 'All' is selected
      } else {
        return report.EXECUTION_TYPE === value; // Adjust this condition based on your data structure
      }
    });
    this.duplicatefilteredReports = [...this.filteredReports]
  }


  public baArr: any = [];
  public ssaCheck: boolean = false;
  public allSSACheck: boolean = false;
  onItemSelectBA(ssaId: any) {
    this.baArr = [];
    if (ssaId[0] == "-1") { //if ssa set to all
      this.ssaCheck = true;
      this.reportForm.controls['baField'].patchValue(['-1']);
      this.ssaListData.forEach((ele: any) => {
        this.baArr.push(ele.SSA_CODE);
      })

    }
    // else if (zoneId[0] != '-1' && zoneId.length == this.zonelength) {
    //   this.reportForm.controls['baField'].patchValue(['-1']);

    // }
    else if (ssaId[0] != '-1' && ssaId.length > 0) {
      this.allSSACheck = true;
    } else {
      this.allSSACheck = false;
      this.ssaCheck = false;
    }

  }
}

