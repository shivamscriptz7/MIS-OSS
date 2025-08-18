import { Component, OnInit, ViewChild, Injectable, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupName, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
//import { CommonService } from 'src/app/services/common.service';
import { ScheduleCreateComponent } from '../schedule-create/schedule-create.component';
import { DataTableDirective } from 'angular-datatables';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { Subscription, debounceTime } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import * as CryptoJS from 'crypto-js';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';

import { BehaviorSubject, elementAt, ignoreElements } from "rxjs";
import { MatTree } from '@angular/material/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { event } from 'jquery';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { EmailConfigViewComponent } from '../email-config-view/email-config-view.component';
import { MatSelect } from '@angular/material/select';

import { Regex } from 'src/app/shared/regex';
import * as $ from 'jquery';
// dropdown 
export class ParentDropdown {
  children?: ParentDropdown[];
  display: string = '';
  parent_Id: any;
  report_Id: any;
  value: any;

}

/** Flat to-do item node with expandable and level information */
// child is in object - object & children dropdown 
export class ExpandDrpoDown {
  display: string = '';
  children?: any;
  level: any;
  parent_Id: any;
  report_Id: any;
  value: any;
  expandable: boolean = false;
}
@Injectable({ providedIn: "root" })
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ParentDropdown[]>([]);
  treeData: any = [];
  get data(): ParentDropdown[] {
    return this.dataChange.value;
  }
}


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('mySelect') mySelect!: MatSelect;
  @ViewChild('input1') input1!: ElementRef;


  // chips
  public emailConfigForm: FormGroup;
  senderEmailsControl: FormControl = new FormControl([]);
  public emailCofigRptList: any;
  public childIsSelectedList = new Array();
  public selections = new Array();
  public groupName: any = '';
  public submitFlag = 0;
  public typeName: any = 'Select Report Type';
  public typeRequired: any;
  public parentId: any;
  public typeId: any;
  public typeDataArr: any = [];
  public permissionKeys: any;
  public module: any;
  public userDetails: any;
  public interval: any;
  public tabFlag: any;
  public editAtreBlur: boolean = false;
  public emailArray: any = [];
  public resetBtn: boolean = true;
  public editbuttons: boolean = false;




  childNodeMap = new Map<ExpandDrpoDown, ParentDropdown>();
  @ViewChild(MatTree) tree!: MatTree<any>;// use this function collapse all nodes of mat tree dropdown 
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ParentDropdown, ExpandDrpoDown>();
  /** A selected parent node to be inserted */
  selectedParent: ExpandDrpoDown | null = null;
  /** The new item's name */
  treeControl: FlatTreeControl<ExpandDrpoDown>;
  treeFlattener: MatTreeFlattener<ParentDropdown, ExpandDrpoDown>;
  dataSource: MatTreeFlatDataSource<ParentDropdown, ExpandDrpoDown>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<ExpandDrpoDown>(true /* multiple */);



  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public service: CommonService,
    public ngxLoader: NgxUiLoaderService,
    public commonService: CommonHelperService,
    public router: Router) {

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ExpandDrpoDown>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.emailConfigForm = this.fb.group({
      TYPEID: [, []],
      REPORT_ID: ['', []]
      //  sender_emails: this.senderEmailsControl

    })


  }




  // tree


  getLevel = (node: ExpandDrpoDown) => node.level;
  isExpandable = (node: ExpandDrpoDown) => node.expandable;
  getChildren = (node: ParentDropdown): ParentDropdown[] | undefined => node.children;
  hasChild = (_: number, _nodeData: ExpandDrpoDown) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: ExpandDrpoDown) => _nodeData.display === "";



  //  Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  transformer = (node: ParentDropdown, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const childdropDownNode =
      existingNode && existingNode.display === node.display
        ? existingNode
        : new ExpandDrpoDown();
    childdropDownNode.display = node.display;
    childdropDownNode.level = level;
    childdropDownNode.parent_Id = node.parent_Id;
    childdropDownNode.expandable = !!node.children;
    childdropDownNode.children = node.children;
    childdropDownNode.report_Id = node.report_Id;
    childdropDownNode.value = node.value;
    this.childNodeMap.set(childdropDownNode, node);
    this.nestedNodeMap.set(node, childdropDownNode);
    return childdropDownNode;
  };




  selectDropDownValue(node: ExpandDrpoDown): void {
    this.parentId = node.parent_Id;
    this.typeId = node.report_Id;
    // this.dataSets = node.display;
    this.typeName = node.display;
    this.checklistSelection.toggle(node);
    this.typeRequired = false;
  }

  // to show name on top when we select dropdown val It is used for placeholder
  getSelectedReportType() {

    if (this.typeDataArr?.length == 0) {
      return 'Select Report Type';
    }
    if (this.typeDataArr.length == 1) {
      return this.typeDataArr[0].display;
    } else if (this.typeDataArr.length == 2) {
      return this.typeDataArr[0].display + `(+${(this.typeDataArr.length) - 1}other)`;
    } else if (this.typeDataArr.length >= 3) {
      return this.typeDataArr[0].display + `(+${(this.typeDataArr.length) - 1}others)`;
    }

  }



  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  emailconfigdtOptions: DataTables.Settings = {};
  columnDefs: any = [
    { orderable: false, targets: 0 },
    { orderable: true, targets: 1 },
    { orderable: true, targets: 2 },
    { orderable: true, targets: 3 },
    { orderable: true, targets: 4 },
    { orderable: true, targets: 5 },
    { orderable: true, targets: 6 },
    { orderable: true, targets: 7 },
    { orderable: false, targets: 8 },
    { orderable: true, targets: '_all' }
  ];

  public columns = [
    { orderable: false, data: '' },
    { orderable: true, data: 'SCHEDULE_NAME' },
    { orderable: true, data: 'TYPE_NAME' },
    { orderable: true, data: 'REPO_NAME' },
    { orderable: true, data: 'SCHEDULE_TIME_SHOWN' },
    { orderable: true, data: 'SCH_REPO_FORMAT' },
    { orderable: true, data: 'STATUS' },
    { orderable: true, data: 'RUN_TIME_SCHEDULED' },
    { orderable: false, data: 'EXECUTION_STATUS' },
    { orderable: false, data: '' }
  ];
  public columnEmail = [
    { orderable: true, data: '' },
    { orderable: true, data: 'GROUP_NAME' },
    { orderable: true, data: 'REPORT_NAME' },
    { orderable: true, data: 'EMAIL' },
    { orderable: true, data: 'CREATED_BY' },
    { orderable: false, data: '' },
  ];

  ngOnInit(): void {

    this.tabFlag = 'Schedule';

    setTimeout(() => {
      let permissionData: any = localStorage.getItem('permission');
      let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      let parsed_data = JSON.parse(permissions)
      this.permissionKeys = JSON.parse(parsed_data.MODULES);
      this.module = this.permissionKeys.filter((item: any) => item.module_id === 9);
    }, 500);

    this.getReportDetails();
    //$(".email_mailchamp").removeClass("mat-form-field-invalid");
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);





    setTimeout(() => {
      this.dashboardRefresh()
    }, 1000);

  }

  ngDestory() {
    clearInterval(this.interval)

  }


  public repoList: any = [];
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public Email_URLSearchParams: any;
  public page: number | any;
  public email_page: number | any;
  public size: any;
  public email_size: any;
  public pageRecordsTotal: number | any;
  public email_pageRecordsTotal: number | any;
  public getScheduleListing: Subscription | any;
  public email_getScheduleListing: Subscription | any;
  public search: string = '';
  public email_search: string = '';
  public rdering: string = '';
  public otherParams: any;
  public email_otherParams: any;

  public reportIdArr: any = [];
  public submitBtn: boolean = true;

  public allEmailReport: any = Array();
  public emailValidDsblBtn: any; //use for disable submit button if (user input wrong email in input box)


  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }
  public userId: any;

  public scheduleData: any;
  //Purpose: fetch schedule listing
  getReportDetails() {


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
        const defaultOrdering = 'CREATED_DATE';
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

        const url = this.tabFlag == 'Schedule' ? `/getScheduleListing` : 'getEmailConfigListDetails';
        this.getScheduleListing = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.scheduleData = resp.result[0];
          this.ngxLoader.stop();
          if (resp.result[0]) {
            if (resp.result[0]) {
              this.repoList = resp.result[0].map((data: any) => {

                return {
                  ...data,
                  checked: false
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

      columns: this.tabFlag == 'Schedule' ? this.columns : this.columnEmail,
    };
  }





  onClickTabs(value: any) {
    //this.submitBtn = true;
    this.tabFlag = value
    if (value == 'emailConfig') {
      this.closeEditMode();
    }
    this.loaderdata = false
    setTimeout(() => {
      this.loaderdata = true
      this.getReportDetails();
    }, 100);

  }

  // execute schedule manually
  executeScheduleManually(data: any) {
    if (this.module[0].EDIT_ACCESS == 1 && data.STATUS == 0) {
      this.ngxLoader.start();
      this.service.postAPIMethod('/exceuteScheduleManually', data).subscribe((res: any) => {
        // this.service.sweetAlertMsg('success', 'Schdeule Execute Manual Successfully');
        this.getReportDetails();
        if (res.result?.ERR == 'X') {
          this.service.sweetAlertMsg('error', res.result?.MSG)
        }
        else {
          this.service.sweetAlertMsg('success', res.result.MSG);
        }
        this.ngxLoader.stop();
      })
    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }
  }

  // Add-Update Schedule
  addUpdateSchedule(list: any, status: any) {
    if (((list.SCHEDULE_ID == null || list.SCHEDULE_ID == '') && this.module[0].CREATE_ACCESS == 1) || (!(list.SCHEDULE_ID == null || list.SCHEDULE_ID == '') && this.module[0].EDIT_ACCESS == 1)) {
      if (list?.STATUS == 1 || status == 'add') {
        const dialogRef = this.dialog.open(ScheduleCreateComponent, {
          disableClose: true,
          data: {
            details: list,
            title: list?.id ? 'Edit Report' : 'Create Report',
            buttonName: 'Submit',
          },
          width: '680px',
          height: 'auto',
        });

        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            this.getReportDetails();
            this.input1.nativeElement.value = '';
          }
        });



      } else {
        this.service.sweetAlertMsg('error', 'Please deactive scheduler first then edit');
      }

    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }

  }


  // delete schedule
  deleteSchdule(obj: any) {

    if (this.module[0].DELETE_ACCESS == 1) {
      let scheduleName = obj.SCHEDULE_NAME && obj.SCHEDULE_NAME.length > 20
        ? `${obj.SCHEDULE_NAME.slice(0, 30)}...`
        : obj.SCHEDULE_NAME;
      const dialogRef = this.dialog.open(DeleteDialogBoxComponent, {

        data: {
          heading: 'Delete Schedule ' + obj.SCHEDULE_NAME,
          title: 'Are you sure want to delete Schedule ' + scheduleName + ' and its details',
          buttonName: 'Yes Delete',
          panelClass: 'custom-modalbox'
        },
        width: '400px',
        height: 'auto'
      });
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          const delSchduleObj = {
            action_type: 'delete',
            report_id: obj.REPORT_ID,
            action: '1',
            delete_reason: closeResult.reason,
            SCHEDULER_ID: obj.SCHEDULE_ID

          }
          this.ngxLoader.start();
          if (obj.STATUS == 1) {
            this.service.postAPIMethod('/DeleteScheduler', delSchduleObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', response.result[0].MSG);
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);

                this.getReportDetails();
              }
            });
          }
          else {
            this.ngxLoader.stop();
            this.service.sweetAlertMsg('error', 'you cannot delete this scheduler this scheduler is in running state');
          }
        }
      });


    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions')
    }
  }


  // Purpose to activate or deactivate  schedule
  onToggleChangeSchedule(obj: any, events: any) {
    if (this.module[0].EDIT_ACCESS == 1) {
      events.target.checked = !events.target.checked;
      const isActive = obj.STATUS == '1' ? '0' : '1';
      const delReportObj = {
        action_type: 'active',
        SCHEDULER_ID: obj.SCHEDULE_ID,
        action: isActive,
        report_id: obj.REPORT_ID
      }
      const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,

        {
          data: {
            heading: 'Confirmation',
            title: obj.STATUS == '1' ? "Do you want to activate the scheduler?" : "Do you want to deactivate the scheduler?",

            buttonName: 'Submit'
          },
          width: '400px',
          height: 'auto'
        }
      );
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (obj.EXECUTION_TYPE != '2') {
          if (obj.RECENT_STATUS?.split(',')[4] == 'In Progress' || obj.RECENT_STATUS?.split(',')[0] == 'In Progress' || obj.RECENT_STATUS?.split(',')[1] == 'In Progress' || obj.RECENT_STATUS?.split(',')[2] == 'In Progress' || obj.RECENT_STATUS?.split(',')[3] == 'In Progress') {// i am using this for show toster message if scheduler is in execution state
            this.service.sweetAlertMsg('error', ' Scheduler is In Progress state, You can not off this scheduler.');
          }
          else {

            // this.service.sweetAlertMsg('error', ' Scheduler is In Progress state, You can not off this scheduler.');

            if (closeResult) {
              this.ngxLoader.start();
              this.service.postAPIMethod("/activeScheduler", delReportObj).subscribe((response: any) => {
                this.ngxLoader.stop();
                if (response.result[0].ERR == 'X') {
                  this.service.sweetAlertMsg('error', response.result[0].MSG)
                }
                else {
                  this.service.sweetAlertMsg('success', response.result[0].MSG);
                  this.getReportDetails();
                }
              })
            }

          }

        }
        else {
          this.service.sweetAlertMsg('error', 'Execution type can not be change in report,it must be scheduler');
        }
      });
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions Or In progress Scheduler');
    }
  }


  dashboardRefresh() {
    this.interval =
      setInterval(() => {
        this.getReportDetails();
      }, 100000);
  }



  public emailValidation: boolean = true;
  // used for add email mat-chip
  add(event: MatChipInputEvent): void {

    const value = (event.value.toLowerCase()).trim();
    if (value) {
      if (this.typeDataArr?.length > 0 && this.senderEmailsControl.value.length > 0) {
        this.emailValidDsblBtn = '';
        this.submitBtn = false;
      } else {
        this.submitBtn = true;
        this.resetBtn = true;
      }

      if (this.isValidEmail(value)) {
        this.emailArray = this.senderEmailsControl.value;
        // Check for duplicates before adding the new email
        // Add the new email to the array
        this.emailArray.push(value);
        // Update the form control with the modified array
        let removeDuplicacy = Array.from(new Set(this.emailArray));// remove diplicate values from array and create new array
        this.senderEmailsControl.setValue(removeDuplicacy);
        event.input.value = '';
        this.emailValidDsblBtn = '';//use for disable submit button if (user input wrong email in input box)
      }
    } else {
      // Handle invalid email error here

      console.log('Invalid email:', value);


      this.emailValidation = false;
    }



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
      // Update the form control with the modified array
      this.senderEmailsControl.setValue(this.emailArray);
      this.mySelect['_value'] = "";
      this.input1.nativeElement.value = '';

    }


    if (this.selections?.length > 0 && this.senderEmailsControl.value?.length > 0) {
      this.submitBtn = false;
      this.resetBtn = false;
    } else {
      this.submitBtn = true;
      this.selections?.length > 0 ? this.resetBtn = false : this.resetBtn = true;
    }

  }
  public repoArr: any = [];
  getEmailConfigReportList(data: any) {
    let repoIds;
    let flag = '';
    if (data != '') {
      repoIds = data;
      flag = 'edit';
    } else {
      repoIds = '';
      flag = '';
    }

    this.service.getAPIMethod(`/getScheduledReportList?reportId=${data}`).subscribe((res: any) => {

      this.emailCofigRptList = res.result;
      this.dataSource.data = this.emailCofigRptList;
      this.repoArr = data.split(',').map((e: any) => +e);
      this.dataSource.data.forEach((node: any) => {
        if (data) {
          this.selectionToggle(true, node, 'edit');
          this.submitBtn = true;
          this.resetBtn = true;
        }
      })

    })
  }

  /**used for checked functionality */
  // descendantsAllSelected(node: any) {
  //   let childIsSelectedList: any = [];

  //   if (this.repoArr?.length > 0 && this.repoArr?.indexOf(node.report_Id) > -1) {
  //     return true;
  //   }

  //   if (node.children && node.children?.length) {
  //     node.children.forEach((child: any) => {
  //       childIsSelectedList.push(child.isSelected);
  //     });
  //   }

  //   // scans to see if children are all true
  //   if (childIsSelectedList?.length && childIsSelectedList.every((item: any) => {
  //     return item;
  //   })) {
  //     if (!this.selections.includes(node)) {
  //       this.selections.push(node);
  //     }
  //     return true;
  //   }

  //   /**used for recursion */
  //   if (node.children && node.children?.length) {
  //     node.children.forEach((child: any) => {
  //       this.descendantsAllSelected(child);
  //     });
  //   }
  // }

  descendantsAllSelected(node: any) {
    // If the node has a report_Id that should always be selected, return true
    if (this.repoArr?.length > 0 && this.repoArr.includes(node.report_Id)) {
      return true;
    }
    // If the node has children, we need to check their selection states
    if (node.children && node.children.length > 0) {
      // Check if all children are selected
      const allChildrenSelected = node.children.every((child: any) => {
        return this.descendantsAllSelected(child);
      });

      // Add the node to selections if all its children are selected
      if (allChildrenSelected && !this.selections.includes(node)) {
        this.selections.push(node);
      }

      return allChildrenSelected;
    } else {
      // If the node has no children, return its own selected state
      return node.isSelected;
    }
  }



  addChildSelection(node: any) {
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        this.childIsSelectedList.push(child.isSelected);
        this.addChildSelection(child)
      });
    }
  }







  /** used for parents selection not for last childs */

  selectionToggle(isChecked: any, node: any, flag: any = '') {
    this.typeName = node.display;
    /**used condition for back tracking as eg. last childs to grand parents */
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        this.selectionToggle(isChecked, child, flag);
      });
    } else {
      if (this.repoArr?.length > 0 && this.repoArr?.indexOf(node.report_Id) > -1 && flag == 'edit') {
        node.isSelected = isChecked;
        if (node.isSelected && !this.typeDataArr.includes(node)) {
          this.typeDataArr.push(node);
        }
      } if (flag == '') {
        setTimeout(() => {
          node.isSelected = isChecked;
          if (node.isSelected && !this.typeDataArr.find((item: any) => item.report_Id == node.report_Id)) {
            this.typeDataArr.push(node);
          }
          else if (!node.isSelected && this.typeDataArr.find((item: any) => item.report_Id == node.report_Id)) {
            let deleteIndex = this.typeDataArr.findIndex((item: any) => item.report_Id == node.report_Id);
            this.typeDataArr.splice(deleteIndex, 1);
          }
        }, 100)

      }

      /***Only used for Last child values which stored in typeDataArr varibale*/
    }

    /** for checkbox only  not for value and selection stored all objects parents and childs both*/
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node)) {
      this.selections.push(node);
    }
    else if (!node.isSelected && this.selections.includes(node)) {
      let deleteIndex = this.selections.indexOf(node);
      this.selections.splice(deleteIndex, 1);
    }


    //submit button disable if no checkbox select
    if (this.selections?.length > 0 && this.senderEmailsControl.value?.length > 0) {
      this.emailValidDsblBtn = '';
      this.submitBtn = false;
      this.resetBtn = false;
    } else {
      this.typeName = "Select Report Type";
      this.resetBtn = false;
      this.submitBtn = true;
    }

  }


  // use for submit email config 
  addUpdateEmailConfig() {
    this.mySelect['_value'] = "";
    // Clear the email input field
    this.input1.nativeElement.value = '';
    if (((this.groupName == null || this.groupName == '') && this.module[0].CREATE_ACCESS == 1) || (!(this.groupName == null || this.groupName == '') && this.module[0].EDIT_ACCESS == 1)) {
      this.reportIdArr = [];
      let allEmailArr: any = [];
      allEmailArr = Array.from(new Set(this.senderEmailsControl.value));
      this.typeDataArr.forEach((item: any) => {
        this.reportIdArr.push(item.report_Id);
      });
      let data = {
        reportId: this.reportIdArr,
        emailId: allEmailArr,
        groupName: this.groupName,
        //flag: this.submitFlag

      }

      let stringData = JSON.stringify(data)
      let encryptData = CryptoJS.AES.encrypt(stringData, this.service.secretKeyEncrypt_Decrypt).toString();
      if (this.reportIdArr.length == 0) {
        return this.service.sweetAlertMsg('error', "Please select report option");
      } else if (allEmailArr.length == 0) {
        return this.service.sweetAlertMsg('error', "Please enter email");
      } else if (this.emailValidDsblBtn != 0) { //use for disable submit button if (user input wrong email in input box)
        return this.service.sweetAlertMsg('error', "Please enter valid email");
      }
      else {
        this.submitBtn = false;
        this.service.postAPIMethod("/addUpdateEmailConfig", { obj: encryptData }).subscribe((res: any) => {
          if (res?.result[0].ERR == 'X') {
            this.service.sweetAlertMsg('error', res.result[0].MSG);
          }
          else {
            this.service.sweetAlertMsg('success', res.result[0].MSG);
            allEmailArr = [];
            this.senderEmailsControl.setValue([]);
            this.typeName = "Select Report Type";
            this.getEmailConfigReportList('');
            this.selections = [];
            this.typeDataArr = [];
            this.getReportDetails();
            this.editAtreBlur = false;
            this.submitFlag = 0;
            this.submitBtn = true;
            this.editbuttons = false;
            this.resetBtn = true;
            this.groupName = '';
          }
        })
      }
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions.');
    }
  }

  viewEmailConfig(list: any) {
    this.mySelect['_value'] = "";
    // Clear the email input field
    this.input1.nativeElement.value = '';
    const dialogRef = this.dialog.open(EmailConfigViewComponent, {
      disableClose: true,
      data: {
        details: list,
        // title: '',
      },
      width: '650px',
      height: 'auto',
    });
  }


  // delete schedule
  deleteSchduleEmailConfig(obj: any) {
    this.resetfunc();
    let reportIdsArray = obj.REPORT_IDS.split(',');
    if (this.module[0].DELETE_ACCESS == 1) {
      let scheduleName = obj.GROUP_NAME && obj.GROUP_NAME.length > 20
        ? `${obj.GROUP_NAME.slice(0, 30)}...`
        : obj.GROUP_NAME;
      const dialogRef = this.dialog.open(DeleteDialogBoxComponent, {

        data: {
          heading: 'Delete Email Group ' + obj.GROUP_NAME,
          title: 'Are you sure want to delete Email Group ' + scheduleName + ' and its details',
          buttonName: 'Yes Delete',
          panelClass: 'custom-modalbox'
        },
        width: '400px',
        height: 'auto'
      });
      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          const delSchduleEmailObj = {
            action_type: 'delete',
            groupId: obj.GROUP_NAME,
            action: '1',
            delete_reason: closeResult.reason,
            reportIds: reportIdsArray
          }
          this.ngxLoader.start();

          this.service.postAPIMethod('/deleteEmailConfig', delSchduleEmailObj).subscribe((response: any) => {
            this.ngxLoader.stop();
            if (response.result[0].ERR == 'X') {
              this.service.sweetAlertMsgWarning('error', response.result[0].MSG);
            }
            else {
              this.service.sweetAlertMsg('success', response.result[0].MSG);
              this.getEmailConfigReportList('');
              this.getReportDetails();
              this.ngxLoader.stop();
            }
          });

          this.ngxLoader.stop();

        }
      });


    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have the permissions.')
    }
  }

  public editData: any;
  resetfunc() {
    this.mySelect['_value'] = "";
    // Clear the email input field
    this.input1.nativeElement.value = '';
    if (this.submitFlag != 1) {
      this.senderEmailsControl.setValue([]);
      this.typeName = "Select Report Type";
      this.getEmailConfigReportList('');
      this.resetBtn = true;
      this.submitBtn = true;
      this.selections = [];
      this.typeDataArr = [];
    } else {
      this.selections = [];
      this.typeDataArr = [];
      setTimeout(() => {
        this.updateEmailConfig(this.editData);
      }, 100)
    }
  }

  public repoIdArr: any

  updateEmailConfig(item: any) {
    this.typeName = "Select Report Type";
    this.selections = [];
    this.typeDataArr = [];
    this.editData = item;
    // Clear the email input field
    this.input1.nativeElement.value = '';
    this.mySelect['_value'] = "";
    this.emailValidDsblBtn = '';
    if (this.module[0].EDIT_ACCESS == 1) {

      this.editAtreBlur = true;
      this.editbuttons = true;
      this.groupName = item.GROUP_NAME;
      this.submitFlag = 1;
      this.getEmailConfigReportList(item.REPORT_IDS);
      this.senderEmailsControl.setValue(item.EMAIL.split(','));
    } else {
      this.service.sweetAlertMsg('error', 'You do not have the permissions.')
    }
  }

  closeEditMode() {
    this.editAtreBlur = false;
    this.editbuttons = false;
    this.groupName = '';
    this.submitFlag = 0;
    this.submitBtn = true;
    this.resetBtn = true;
    this.resetfunc();

  }


  public searchEmails: any = [];
  public senderEmails: any = '';
  // This function handles email input changes and suggestions
  filterEmail(item: any) {
    const data: string = item.target.value;
    // Update the disable button flag based on the input length
    this.emailValidDsblBtn = data.length;
    // Fetch email suggestions if input length is greater than 2
    if (data.length > 2) {
      this.service.getAPIMethod(`/getAllUserEmailList?emailData=${data}`).subscribe((response: any) => {
        // Filter out emails that are already selected
        this.searchEmails = response.result?.filter((email: any) =>
          !this.senderEmailsControl.value.includes(email.USER_EMAIL)
        );

        // Open or close the dropdown based on the availability of suggestions
        this.searchEmails?.length > 0 ? this.mySelect.open() : this.mySelect.close();
      });
    } else {
      this.searchEmails = [];
    }

    let emailArray = item.target.value.split(';').map((email: any) => email.trim());
    // Filter valid emails based on the domain pattern
    const validEmails = emailArray.filter((email: any) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(echelonedge.com)$/.test(email));
    // Filter invalid emails
    const invalidEmails = emailArray.filter((email: any) => !validEmails.includes(email));
    if (invalidEmails.length != 0) {
      this.senderEmailsControl.setErrors({ invalidEmail: true });
    } else {
      this.senderEmailsControl.setErrors({ invalidEmail: false });
    }

  }

  // This function adds valid emails to chips and removes them from the input box
  addEmailsToChips(inputElement: any) {

    let emailArray = inputElement.value.split(';').map((email: any) => email.trim());
    // Filter valid emails based on the domain pattern
    const validEmails = emailArray.filter((email: any) => Regex.emailDomianRegex.test(email));
    // Filter invalid emails
    const invalidEmails = emailArray.filter((email: any) => !validEmails.includes(email));

    if (invalidEmails.length != 0) {
      this.senderEmailsControl.setErrors({ invalidEmail: true });
    } else {
      this.senderEmailsControl.setErrors({ invalidEmail: false });
    }
    // Add valid emails to the chip list
    if (validEmails.length > 0) {
      let currentChips = this.senderEmailsControl.value || [];
      currentChips = [...currentChips, ...validEmails];
      // Update the chip list with unique values
      this.senderEmailsControl.setValue(Array.from(new Set(currentChips)));
    }
    // Update the input field to only show invalid emails
    this.senderEmailsControl.setErrors(invalidEmails.length > 0 ? { invalidEmail: true } : null);
    this.emailValidDsblBtn = invalidEmails.length === 0 ? 0 : inputElement.value.length;
    inputElement.value = invalidEmails.join(';'); // Update input with only invalid emails
  }

  // This function handles pressing "Enter" or clicking outside the input
  handleInputEvent(event: any) {

    if (this.input1.nativeElement.value || this.senderEmailsControl.value?.length > 0) {

      this.resetBtn = false;

      if (event.key === 'Enter' || event.type === 'blur') {
        if (this.typeDataArr?.length > 0 && this.senderEmailsControl.value?.length > 0) {
          this.submitBtn = false;
        }
        this.addEmailsToChips(event.target);
      }

    }
  }


  suggestionMail(event: any) {
    if (this.typeDataArr?.length > 0) {

      this.emailValidDsblBtn = '';
      this.submitBtn = false;
    } else {
      //this.submitBtn = true;
      // this.resetBtn = true;
    }
    this.emailArray = this.senderEmailsControl.value;
    // Add the new email to the array
    this.emailArray.push(event.value);
    this.input1.nativeElement.value = '';
    // Update the form control with the modified array
    let removeDuplicacy = Array.from(new Set(this.emailArray));// remove diplicate values from array and create new array
    this.senderEmailsControl.setValue(removeDuplicacy);
    this.searchEmails = this.searchEmails?.filter((e: any) => e.USER_EMAIL != event.value);
  }


}



