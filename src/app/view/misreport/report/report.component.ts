import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { map } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ApiService } from "src/app/services/api_service/api.service";
import { CommonService } from "src/app/services/common.service";
import { ExportSlaExcelService } from "src/app/services/export-sla-excel.service";
import { MatCheckboxChange } from "@angular/material/checkbox";

import { IDatePickerConfig } from "ng2-date-picker";

import { NgxUiLoaderService } from "ngx-ui-loader";
import { ChangeDetectorRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LocalshareService } from "src/app/services/localshare.service";
//import { MatOption } from '@angular/material/core';
import { MatSelect } from "@angular/material/select";
import { MatSelectChange } from "@angular/material/select";
//import * as moment from 'moment';
import * as CryptoJS from "crypto-js";
//import fs from 'fs';


@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  @ViewChild("pdfViewer") public pdfViewer: any;
  @ViewChild("externalPdfViewer") public externalPdfViewer: any;
  @ViewChild("select") select: any = MatSelect;
  // @ViewChild('select') select: MatSelect;
  public UserId: any;
  public reportHeading: any;
  // Create Object for getData()
  public mainObject: any = {
    Report_Generate_On: new Date(),
  };
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
    // hours24Format: 'HH',
    // showTwentyFourHours: true,
    // timeSeparator: ':',
    hideInputContainer: false,
    //max:this.getmaxDateValue(new Date())

    //min: this.getmaxDateValue(""),
    //min: moment().subtract(1, "month").endOf("day").format('DD:MM:YYYY'),
  };

  public configbook: IDatePickerConfig = {
    format: "MMM-YYYY",
    firstDayOfWeek: "su",
    monthFormat: "MMM, YYYY",
    yearFormat: "YYYY",
    monthBtnFormat: "MMM",
    hideInputContainer: false,
    max: this.getmaxDateBookConfig(),
  };

  public selectedDevice: any = "export";
  public edited = false; // Export header hide
  public circleData: any = [];
  public searchResult: any;
  public show = false; // loader hide
  public fullScreen = true;
  public classTrue = false;
  public showReportName = false;
  public radioSelected: any;
  public submitBtn: boolean = true;
  public exportBtn: boolean = true;
  public tableShown: boolean = false;
  public filterBtn: boolean = true;
  public loader: boolean = false;
  public pdfReader: boolean = false;
  public hiddenDiv: boolean = false;
  public errorShown: boolean = false;
  public placeHolderShown: boolean = false;
  public repoHeader: any;
  public slrDateFilterForm: any = FormGroup;
  public reportArr: any;
  public selectedTypeId: any;
  public baSelectBox: boolean = false;
  public filters: any = {
    from_dt: false,
    to_dt: false,
    book_period: false,
    mkt_code: false,
    ba: false,
    sugarcane: false,
    consolidate: true,
  };
  public filters_required: any = {
    from_required: false,
    to_required: false,
    book_required: false,
    mkt_required: false,
    ba_required: false,
    sugarcane_required: false,
    consolidate_required: false,
  };
  public fltr: any = [];
  public commonValues: any = [];
  public commonValues_required: any = [];
  public filterkeys: any;
  public filters_required_keys: any;
  public fltr_is_required: any = [];
  public fltr_req = [];
  public resultData: any;
  public cirleArr: any;
  public ssaListData: any;
  public circleSelectbox: boolean = false;
  public sugarcaneChkBox: boolean = false;
  public filteredCircle: any;
  public filteredSSA: any;
  public newResetForm: any = FormGroup;
  public duplicateResultData: any = [];

  public reportId: any;
  public endAPI_Point: any;
  public filterLength: any;
  public extraInputfilters: any = [];
  public fltrKeysData: any = [];
  public extraReqInputfilters: any = [];
  public fltrKeysRequiredData: any = [];
  public circlesName: any = "";
  public ssaNames: any = "";
  public extParamHtml = "PDF";
  public repoProc: any;
  public userDetails: any;
  public userID: any;
  public bredCrumParentName: any = [];
  public bredCrumTypeName: any;
  public repoPathtt: any;
  public reportName: any;
  public formData: any = [];
  public allZoneCheck: any;
  public zoneCheck: any;
  public zoneArr: any = [];
  public dataCircleVal: any = [];
  public zoneDropDownList: any;
  public zonelength: any;
  public circleDropDownList: any;

  // public ssaCheck: boolean = false;
  // public allssaCheck: boolean = false;
  // allSelected = false;

  public dynamicFilterForm: any = [];
  constructor(
    private http: HttpClient,
    public fb: FormBuilder,
    private slasevice: ExportSlaExcelService,
    private apiservice: ApiService,
    public ngxLoader: NgxUiLoaderService,
    private service: CommonService,
    private cdr: ChangeDetectorRef,

    public localShareService: LocalshareService
  ) {
    this.slrDateFilterForm = this.fb.group({
      FromDate: [""],
      ToDate: [""],
      Sugarcane: [""],
      BookingPeriod: [""],
      Circle: [[]],
      SSA: [[]],
    });
    //replica of form group
    this.newResetForm = this.slrDateFilterForm;
  }

  getminDate() {
    const originalDate = new Date();
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with 0 if needed
    const day = String(originalDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }



  getmaxDateBookConfig() {
    const originalDate = new Date();
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with 0 if needed
    const formattedDate = `${year}-${month}`;
    return formattedDate;
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
  public formattedDate: any;
  getmaxDateValueToDate() {
    // Example usage:
    // Your reference date
    // const lastDateOfThisMonth = this.getLastDateOfMonth(referenceDate);
    const lastDate = new Date(
      this.slrDateFilterForm.controls["FromDate"].value
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



  ngOnInit(): void {
    this.getCircleData();
    this.getTypeId();
    this.getReportsData();
    this.valueChange();

    this.userDetails = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(
      this.userDetails,
      "Rw7]HwL5cXH$zkh"
    ).toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);
    this.userID = this.userDetails.USER_ID;

    let bredcrumData: any = localStorage.getItem("selectedparentName");
    let decryptBredCurmData = CryptoJS.AES.decrypt(
      bredcrumData,
      "Rw7]HwL5cXH$zkh"
    ).toString(CryptoJS.enc.Utf8);
    let bredcrumObj = JSON.parse(decryptBredCurmData);
    this.bredCrumParentName.push(bredcrumObj);
  }

  // using form controls
  get scheduleFormcontrol() {
    return this.slrDateFilterForm.controls;
  }

  public selectedMonth: any;
  public currentMonth: any;

  valueChange() {
    this.slrDateFilterForm
      .get("FromDate")
      .valueChanges.subscribe((item: any) => {
        this.slrDateFilterForm.controls.ToDate.setValue("");
        this.configEnd.min = item;

        const referenceDate = item; // Your reference date
        const lastDate = new Date(referenceDate);
        this.selectedMonth = lastDate?.getMonth() + 1;
        const refCurrentData = new Date();
        this.currentMonth = refCurrentData?.getMonth() + 1;
        if (item) {
          if (this.selectedMonth == this.currentMonth) {
            this.configEnd.max = this.getminDate();
          } else {
            this.configEnd.max = this.getmaxDateValue(item);
          }
        }
      });
  }

  //method used for get Type Id for slr reports
  getTypeId() {
    this.ngxLoader.start();
    this.localShareService.selectedTypeId.subscribe((msg: any) => {
      this.selectedTypeId = msg;
      this.ngxLoader.stop();
    });
  }

  //method used for get reports data for slr reports
  getReportsData() {
    this.service
      .getAPIMethod(`/fetchReportList?typeId=${this.selectedTypeId}`)
      .subscribe((res) => {
        this.reportArr = res.result;
        this.duplicatefilteredReports = [...this.reportArr];
      });
  }

  viewPdf(params: any) {
    //cal postApiMethod in common service
    this.service.getAPIMethod("/fetchRepoData").subscribe((res) => {
      if (res.statusCode == 400) {
        this.service.sweetAlertMsg("error", res.msg);
      } else {
        this.slasevice.exportPlanWiseRevenue(res, params, "");
      }
    });
  }


  viewPdfOnload(data: any, extParam: any, excelParam: any, clickEvent: any) {
    let objData = JSON.stringify(data);

    const excelParamData = JSON.stringify(excelParam);
    let HeaderName = this.radioSelected;
    let token = localStorage.getItem("access-token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });


    /*
     Used for Mannual create EXCEL
    */

    // if (extParam == "EXCEL") {
    //this api used for excel
    // this.http
    //   .post("/SLR_PostApi_MethodExcel", objData, { headers: headers, })
    //   .subscribe((res: any) => {
    //     if (res.statusCode == 400) {
    //       //this.service.sweetAlertMsg("error", res.msg);
    //       this.service.sweetAlertMsg("error", "No Record Found.");

    //     } else {
    //       this.slasevice.exportPlanWiseRevenue(res, excelParamData, HeaderName);
    //     }
    //   });
    //}

    /*
     Used for Mannual create CSV
    */

    // if (extParam == "CSV") {
    //   //this api used for excel
    //   this.http
    //     .post("/SLR_PostApi_MethodExcel", objData, { headers: headers, })
    //     .subscribe((res: any) => {
    //       if (res.statusCode == 400) {
    //         // this.service.sweetAlertMsg("error", res.msg);
    //         this.service.sweetAlertMsg("error", "No Record Found.");
    //       } else {
    //         this.slasevice.SLRexportAsCsvFile(res.result, HeaderName);
    //       }
    //     });
    // }

    //this api used for pdf and html
    this.http
      .post("/SLR_PostApi_Method", objData, {
        headers: headers,
        responseType: "blob",
        observe: "response",
      })
      .subscribe((res: any) => {


        let disposition = res.headers.get.hasOwnProperty("Content-Disposition")
          ? "Content-Disposition"
          : "Content-disposition";
        var filename = "";
        let headersFileName = res.headers.get(disposition);
        //console.log
        if (disposition && headersFileName?.indexOf("attachment") !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(headersFileName);
          if (matches != null && matches[1])
            filename = matches[1].replace(/['"]/g, "");

        }

        /**
         * this condition used pdfviewer load and download pdf
         */
        if (extParam == "PDF") {
          this.pdfViewer.pdfSrc = `/uploads/SLR_REPORTS/${filename}`; // pdfSrc can be Blob or Uint8Array
          this.pdfViewer.refresh(); //  Ask pdf viewer to load/refresh pdf
        }

        //user click on pdf or html/excel/csv in export button
        if (clickEvent == "HTML" || clickEvent == "PDFDATA" || clickEvent == "EXCEL" || clickEvent == 'CSV') {
          const anchorTag = document.createElement("a");
          anchorTag.target = "_blank";
          anchorTag.href = `/uploads/SLR_REPORTS/${filename}`;
          let path = anchorTag.href;
          setTimeout(() => {
            this.slasevice.slaPdfDownload(clickEvent, path, filename);
          }, 1500);
        }
        // } else if (clickEvent == 'EXCEL') {
        //   const anchorTag = document.createElement("a");
        //   anchorTag.target = "_blank";
        //   anchorTag.href = `/uploads/SLR_REPORTS/${filename}`;
        //   let path = anchorTag.href;
        //   setTimeout(() => {
        //     this.slasevice.slaPdfDownload(clickEvent, path, filename);
        //   }, 1500);
        // } else if (clickEvent == 'CSV') {
        //   const anchorTag = document.createElement("a");
        //   anchorTag.target = "_blank";
        //   anchorTag.href = `/uploads/SLR_REPORTS/${filename}`;
        //   let path = anchorTag.href;
        //   setTimeout(() => {
        //     this.slasevice.slaPdfDownload(clickEvent, path, filename);
        //   }, 1500);
        // }



        // unlink file from upload/slr repot folder when get response  
        setTimeout(() => {
          this.unlinkSLR_file(filename);
        }, 10000)

      });


    this.placeHolderShown = true;
    this.tableShown = true;
    this.errorShown = false;
    this.exportBtn = false;
    this.filters_required.ba_required = false;
  }



  public unlinkSLR_file(filename: any) {
    this.service.getAPIMethod(`/UNLINK_SLR_REPORT?filename=${filename}`).subscribe((res) => {

    });
  }

  public getReportName(reportData: any) {
    // this.slrDateFilterForm.reset();
    this.slrDateFilterForm.patchValue({
      FromDate: "",
      ToDate: "",
      Sugarcane: "",
      BookingPeriod: "",
      Circle: [],
      SSA: []

    });

    this.reportName = "";
    this.repoProc = "";
    this.ssaNames = [];

    //this.slrDateFilterForm = this.newResetForm;


    this.slrDateFilterForm.enable();
    this.ssaListData = [];
    this.extraInputfilters = [];
    this.fltrKeysData = [];
    this.endAPI_Point = reportData.API_END_POINT;
    this.reportId = reportData.REPOID;
    this.reportName = reportData.REPO_NAME;
    this.repoProc = reportData.REPO_PROC;

    let fltrValue = Object.keys(this.filters);
    let fltrValueRequired = Object.keys(this.filters_required);
    this.fltr = JSON.parse(reportData.FILTERS);// db filters
    this.fltr_is_required = JSON.parse(reportData.IS_REQUIRED);//db filters required
    this.fltr == null || this.fltr == undefined ? (this.fltr = []) : this.fltr;
    /************************************** */
    // set false filters_required keys when we click report on report listing
    fltrValueRequired?.forEach((item: any) => {
      this.filters_required[item] = false;
    });


    // set false filters keys when we click report on report listing
    fltrValue?.forEach((item: any) => {
      this.filters[item] = false;
    });

    /***************************************** */

    // Filters code
    this.filterkeys = Object?.keys(this.filters);
    this.filterkeys.filter((value: any) => {
      this.fltr?.forEach((ele: any) => {
        if (ele.toLowerCase() === value.toLowerCase()) {
          this.filters[value] = true;
        }
      });
    });

    //convert into lower case of database filters
    let dbfilters = Object?.values(this.fltr);
    dbfilters?.forEach((item: any) => {
      let lowerValues = item.toLowerCase();
      this.fltrKeysData.push(lowerValues);
    });

    // get filter who not matched with filterkeys
    this.fltrKeysData?.forEach((value: any) => {
      if (this.filterkeys?.indexOf(value) == -1) {
        this.extraInputfilters.push(value);
        //add new formcontrols in formgroup
        if (this.extraInputfilters?.length > 0) {
          this.slrDateFilterForm.addControl(
            value,
            new FormControl<string | "">("")
          );
        }
      }
    });

    //IS_Required Code
    this.filters_required_keys = Object.keys(this.filters_required);
    this.filters_required_keys?.filter((value: any) => {
      this.fltr_is_required?.forEach((ele: any) => {
        if (ele.toLowerCase() === value.toLowerCase()) {
          this.filters_required[value] = true;
        }
      });
    });



    // this.slrDateFilterForm.reset();
    this.showReportName = true;
    this.classTrue = true;
    this.tableShown = false;
    this.placeHolderShown = false;
    this.errorShown = false;
    this.filterBtn = false;
    this.exportBtn = true;
    this.reportHeading = event;
    this.slrDateFilterForm.patchValue({
      FromDate: "",
      ToDate: "",
    });
    this.slrDateFilterForm.markAsDirty();
    this.cdr.detectChanges();
  }



  public loadPdfViewer(endPointAPI: any, extParam: any) {

    if (this.radioSelected != undefined) {
      let formControlkeys = Object.keys(this.slrDateFilterForm.controls);
      let obj: any = {}; // PDF parameter
      let obj2: any = {};//Excel Paramenter
      let filterObject: any = {};// Procedure Sequece

      let clickEvent = extParam;
      let pdfUrl = endPointAPI;

      if (extParam == "PDFDATA") {
        extParam = "PDF";
      }
      for (let i = 0; i < formControlkeys?.length; i++) {
        obj[formControlkeys[i]] =
          this.slrDateFilterForm.controls[formControlkeys[i]].value;

        obj2[formControlkeys[i]] =
          this.slrDateFilterForm.controls[formControlkeys[i]].value;



        filterObject[formControlkeys[i]] =
          this.slrDateFilterForm.controls[formControlkeys[i]].value

      }


      Object.keys(obj2).forEach(key => {
        if (obj2[key] === null || obj2[key] === "" || obj2[key]?.length === 0) {
          delete obj2[key];

        }
      });


      //remove keys when value is null and blank in filterObj
      Object.keys(filterObject).forEach(key => {
        if (filterObject[key] === null || filterObject[key] === "" || filterObject[key]?.length === 0) {
          delete filterObject[key];
        }
      });


      obj["FromDate"] == null
        ? (obj["FromDate"] = "")
        : (obj["FromDate"] = obj["FromDate"]);
      obj["ToDate"] == null
        ? (obj["ToDate"] = "")
        : (obj["ToDate"] = obj["ToDate"]);
      obj["Sugarcane"] == null
        ? (obj["Sugarcane"] = "N")
        : (obj["Sugarcane"] = obj["Sugarcane"]);
      obj["Circle"]?.length > 0
        ? (obj["Circle"] = obj["Circle"].toString())
        : (obj["Circle"] = "");
      obj["SSA"]?.length == 0 || obj["SSA"] == null
        ? (obj["SSA"] = "")
        : (obj["SSA"] = obj["SSA"].toString());
      obj["BookingPeriod"] == null
        ? (obj["BookingPeriod"] = "")
        : (obj["BookingPeriod"] = obj["BookingPeriod"]);

      obj["RepoId"] = this.reportId.toString();
      obj["RepoType"] = "PDF";
      obj["MarketCode"] = "";
      obj["P_MKT_CODE"] = "";
      obj["CircleName"] = this.circlesName.toString();
      obj["SSAName"] = this.ssaNames.toString();
      obj["url"] = pdfUrl;
      obj["userId"] = this.userID;
      obj["repoName"] = this.reportName;
      obj["extParam"] = extParam;
      obj["REPO_PROC"] = this.repoProc;

      obj2["typeof"] = 'EXCEL';
      obj2["RepoId"] = this.reportId.toString();
      obj2["CIRCLE"] = this.circlesName.toString();
      obj2["BA"] = this.ssaNames.toString();

      filterObject['CircleName'] = obj["Circle"];
      filterObject['SSAName'] = obj["SSA"];
      filterObject["RepoId"] = this.reportId.toString();
      filterObject["RepoType"] = "EXCEL";


      const sugarCaneExists = this.fltr.includes('sugarcane');
      //If sugarcane Yes than BA kay will be deleted
      if (obj2['Sugarcane'] === 'Y') {
        delete obj2['BA'];
      }


      const baExist = obj2.hasOwnProperty('BA');

      //if sugarcane exist in filters
      if (sugarCaneExists) {

        //if ba exist 
        if (baExist) {
          obj2["Sugarcane"] = 'N';
          filterObject["Sugarcane"] = "N";
        }

      }


      // send filters param 
      obj["filterParam"] = filterObject;
      this.tableShown = true;
      this.classTrue = false;
      this.ngxLoader.start();
      this.formData = obj;
      this.viewPdfOnload(obj, extParam, obj2, clickEvent);
      this.ngxLoader.stop();
    }
  }

  downloadPDF(param: any) {
    this.loadPdfViewer(this.endAPI_Point, param);
  }

  resetFilters() {
    this.slrDateFilterForm.patchValue({
      FromDate: "",
      ToDate: "",
      Sugarcane: "",
      BookingPeriod: "",
      Circle: [],
      SSA: []

    });
    this.ssaListData = [];
  }

  getToday(): string {
    return new Date().toISOString().split("T")[0];
  }

  checkValueSugarcane(checked: boolean) {
    if (checked) {
      this.slrDateFilterForm?.get("SSA").disable();
      this.slrDateFilterForm.controls["SSA"].patchValue("");
      this.slrDateFilterForm.controls["Sugarcane"].patchValue("Y");
      this.filters_required.ba_required = false;

      // Perform actions if the checkbox is checked
    } else {

      this.slrDateFilterForm?.get("SSA").enable();
    }
  }

  getCircleData() {
    this.service.getAPIMethod("/getFilterCircleData").subscribe((res) => {
      this.resultData = res.result;
      this.duplicateResultData = [...this.resultData];
      this.filteredCircle = this.resultData.slice();
    });
  }

  // display circleName in Html
  displayCircleName(item: any) {
    let name = "";
    this.resultData?.forEach((element: any) => {
      if (element.CIRCLE_ID === item) {
        name = element.CIRCLE_NAME;
      }
    });
    return name;
  }

  displayBaName(item: any) {
    let name = "";
    this.ssaListData?.forEach((element: any) => {
      if (element.SSA_CODE === item) {
        name = element.SC_DESC;
      }
    });
    return name;
  }

  /**
   *
   * @param circleId is used for circles id
   * @param event is used for get circle names
   * @param flag is used for when we select all case only
   */
  public selectedZone: any;
  public duplicateCircle: any = [];
  public onItemSelectCircle(circleId: any, event: MatSelectChange, flag: any) {
    flag == "All"
      ? (this.circlesName = event)
      : (this.circlesName = event.source.triggerValue);

    circleId = circleId ? circleId : [];
    // this.cirleArr = [...this.duplicateCircle];
    this.cirleArr = [...circleId];
    this.service
      .getAPIMethod(`/getFilterBaData?circle_id=${this.cirleArr}`)
      .subscribe((res) => {
        this.ssaListData = res.result;
        this.selectedZone = res.result;
        //this.ssaNames = res.result;
        this.filteredSSA = this.ssaListData.slice();
      });
  }

  onItemSelectBa(ssaId: any, event: MatSelectChange, flag: any) {
    flag == "All"
      ? (this.ssaNames = event)
      : (this.ssaNames = event.source.triggerValue);
    if (this.ssaNames?.length > 0) {
      this.filters_required.sugarcane_required = false;
    } else {
      this.filters_required.sugarcane_required = true;
    }
  }

  filterClick() {
    this.slrDateFilterForm?.get("SSA").enable();
    this.classTrue = true;
    this.slrDateFilterForm.patchValue({
      FromDate: "",
      ToDate: "",
      Sugarcane: "",
      BookingPeriod: "",
      Circle: [],
      SSA: []

    });
    //this.slrDateFilterForm.reset();
    this.ssaListData = [];
  }

  filterClose() {
    this.filters_required.book_required = false;
    this.filters_required.ba_required = false;
    this.filters_required.from_required = false;
    this.filters_required.to_required = false;
    this.slrDateFilterForm.enable();
    this.classTrue = false;
    this.ssaListData = [];
    this.circlesName = [];
    this.ssaNames = [];
    this.extraInputfilters = [];
    this.slrDateFilterForm.patchValue({
      FromDate: "",
      ToDate: "",
      Sugarcane: "",
      BookingPeriod: "",
      Circle: [],
      SSA: []
    });
  }

  //Circle Dropdown mat-select functions
  isCheckedCircle(): boolean {
    return (
      this.slrDateFilterForm.controls["Circle"].value &&
      this.resultData?.length &&
      this.slrDateFilterForm.controls["Circle"].value?.length ===
      this.resultData?.length
    );
  }

  isIndeterminateCircle(): boolean {
    return (
      this.slrDateFilterForm.controls["Circle"].value &&
      this.slrDateFilterForm.controls["Circle"].value?.length &&
      this.resultData?.length &&
      this.slrDateFilterForm.controls["Circle"].value?.length <
      this.resultData?.length
    );
  }

  toggleSelectionCircle(change: MatCheckboxChange): void {
    let flag = "All";
    var setDataCircle: any = [];
    var setCirclesName: any = [];
    if (change.checked) {
      this.resultData.forEach((item: any) => {
        setDataCircle.push(item["CIRCLE_ID"]);
        setCirclesName.push(item["CIRCLE_NAME"]);
      });
      this.slrDateFilterForm.controls["Circle"].setValue(setDataCircle);
    } else {
      this.slrDateFilterForm.controls["Circle"].setValue([]);
      setCirclesName = [];
    }
    this.onItemSelectCircle(setDataCircle, setCirclesName, flag);
  }

  //End Circle Dropdown mat-select functions

  //Ba Dropdown mat-select functions
  isChecked(): boolean {
    return (
      this.slrDateFilterForm.controls["SSA"].value &&
      this.ssaListData?.length &&
      this.slrDateFilterForm.controls["SSA"].value?.length ===
      this.ssaListData?.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.slrDateFilterForm.controls["SSA"].value &&
      this.slrDateFilterForm.controls["SSA"].value?.length &&
      this.ssaListData?.length &&
      this.slrDateFilterForm.controls["SSA"].value?.length <
      this.ssaListData?.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    let flag = "All";
    var setDataSSA: any = [];
    var setDataSSAName: any = [];
    if (change.checked) {
      this.ssaListData.forEach((item: any) => {
        setDataSSA.push(item["SSA_CODE"]);
        setDataSSAName.push(item["SC_DESC"]);
      });
      this.slrDateFilterForm.controls["SSA"].setValue(setDataSSA);
    } else {
      this.slrDateFilterForm.controls["SSA"].setValue([]);
      setDataSSAName = [];
    }
    this.onItemSelectBa(setDataSSA, setDataSSAName, flag);
  }
  //End Dropdown mat-select functions

  onSearchResult() {
    let selected: any = [];
    selected.push(this.slrDateFilterForm.controls["Circle"].value);
    if (this.searchResult) {
      const filteredList: any = [];
      this.filteredCircle.filter((elem: any) => {
        if (
          elem.CIRCLE_NAME.toLowerCase().includes(
            this.searchResult.toLowerCase()
          ) == true
        ) {
          filteredList.push(elem);
        }
      });

      this.filteredCircle = filteredList;
    } else {
      this.filteredCircle = this.resultData;
    }
    this.slrDateFilterForm.controls["Circle"].setValue(selected);
    selected = [];
  }

  checkCircle(obj: any) {
    let index = this.duplicateCircle.indexOf(obj.CIRCLE_ID);
    if (index > -1) {
      this.duplicateCircle.splice(index, 1);
    } else {
      this.duplicateCircle.push(obj.CIRCLE_ID);
    }
    this.slrDateFilterForm.controls["Circle"].patchValue([
      ...this.duplicateCircle,
    ]);
  }

  searchFun(e: any) {
    this.resultData = [...this.duplicateResultData];
    if (e.target.value) {
      this.resultData = this.resultData.filter((element: any) => {
        return element.CIRCLE_NAME.toUpperCase().includes(
          e.target.value.toUpperCase()
        );
      });
    } else {
      this.resultData = [...this.duplicateResultData];
    }
  }




  // onselection function zone

  onItemSelectZone(zoneId: any, flag: any) {
    this.allZoneCheck = false;
    this.zoneCheck = false;
    zoneId = zoneId ? zoneId : [];
    this.zoneArr = [...zoneId];
    if (zoneId[0] == "-1") {
      //if Zone set to all
      this.zoneCheck = true;

      this.slrDateFilterForm.controls["Circle"].patchValue(["-1"]);
      this.zoneDropDownList.forEach((ele: any) => {
        this.zoneArr.push(ele.ZONE_ID);
      });
    } else if (zoneId[0] != "-1" && zoneId?.length == this.zonelength) {
      this.slrDateFilterForm.controls["zone"].patchValue(["-1"]);
      this.zoneCheck = true;
    } else if (zoneId[0] != "-1" && zoneId?.length > 0) {
      this.allZoneCheck = true;
    } else {
      this.zoneCheck = false;
      this.allZoneCheck = false;
    }

    this.selectedZone = this.zoneArr;
    this.ngxLoader.start();
    this.service
      .getAPIMethod(`/getCircleList?zone_id=${this.zoneArr}`)
      .subscribe((res) => {
        this.circleDropDownList = [];
        this.circleDropDownList = res.result.ERR != "X" ? res.result : [];
        //onChnage zone onItemSelectCircle called
        let circleArray = this.circleDropDownList?.map((e: any) => {
          return +e.CIRCLE_ID;
        });

        let valData: any = [];

        zoneId[0] == "-1" ? (valData = ["-1"]) : valData;

        //used for search circle
        this.filteredCircle = this.circleDropDownList.slice();
        this.ngxLoader.stop();
      });
  }

  public searchData: any = "";
  public duplicatefilteredReports: any = [];
  // use this function search from listing
  searchFunction() {
    this.reportArr = [...this.duplicatefilteredReports];

    this.reportArr = this.duplicatefilteredReports.filter((item: any) => {
      return (
        item.REPO_NAME.toLowerCase().indexOf(this.searchData.toLowerCase()) >= 0
      );
    });
  }
}
