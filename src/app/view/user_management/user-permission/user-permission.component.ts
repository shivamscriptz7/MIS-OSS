import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/services/common.service';
import * as CryptoJS from 'crypto-js';

//import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';
import { MatDialog } from '@angular/material/dialog';


/**********Rahul Code  */
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CommonHelperService } from 'src/app/services/common-helper.service';

import { DataTableDirective } from 'angular-datatables';
import { Subscription, debounceTime } from 'rxjs';




interface TypeNode {
  display: any;
  value: any;
  children?: TypeNode[];
  isSelected: boolean;
}

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss'],


})
export class UserPermissionComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  roledtOptions: DataTables.Settings = {};
  dtOptions: DataTables.Settings = {};
  loaderdata: boolean = true;
  URLSearchParams: any;
  page: number | any;
  size: any;
  pageRecordsTotal: number | any;
  getTypeDetails: Subscription | any;
  getRoleDetails: Subscription | any;
  search: string = '';
  ordering: string = '';
  otherParams: any;
  typeUserListData: any;


  columnDefs: any = [
    { orderable: false, targets: '_all' }
  ];


  public roleDataTableRefresh: boolean = false;
  public typeDataTableRefresh: boolean = false;
  public roleData: any = [];
  public permissionForm: FormGroup;  //kajal code for initialize permissions form
  public moduleList: any = [];
  public subModuleArr: any = [];
  public viewpermission: boolean = true;
  public createPermissions: boolean = false;
  public userList: any;
  public list: any;
  public rolePermList: any = [];
  public checkboxShown: boolean = false;
  public permAccessList: any;
  public permByRoleId: any;
  public moduleListGet: any;
  public selectedRole: any;
  public editPermissions: boolean = false;
  public selectedRole1: any;
  public readCheckboxTrue: boolean = false;
  public btnEnable: boolean = false;
  public reset_btn_disabled: boolean = false;
  public userId: any;
  // permissions @shivam kumar
  public permissionKeys: any;
  public module: any;
  public showModuleList: boolean = false;
  public selectRole: boolean = false;
  public userDetails: any;
  public treeControl = new NestedTreeControl<TypeNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<TypeNode>();
  public childIsSelectedList = new Array();
  public selections = new Array();
  public typeCheckbox: boolean = false;
  public arrData = new Array();
  public typePermissionForm: FormGroup;
  public selectedUser: any;
  public typeDataArr: any = [];
  public selectedUserListData: any = [];
  public typePermMsgFlag = 0;
  public createTypeDiv: boolean = false;
  public viewTypeDiv: boolean = true;
  public listingFlag = 0;
  public userTypeDropDown: boolean = false;
  public createTreeView: boolean = false;
  public typePermBtnForSubmit: boolean = true;
  public typePermResetBtnFlag: any;
  public filteredList: any;
  public navTotal: any;
  public navLimit: number = 5;
  public navPage: any = [];
  public navCurrent: number = 0;
  moduleList1: any = [];
  public currentPage: any;
  public filteredRoleList: any;
  public typePermResetBtn: boolean = true;

  /**pagination Code */

  /**pagination Code End */


  constructor(
    public commonService: CommonHelperService,
    public service: CommonService,
    private fb: FormBuilder,
    public ngxLoader: NgxUiLoaderService,
    public dialog: MatDialog,


  ) {
    this.permissionForm = this.fb.group({
      role_id: ['', Validators.required],
      module_id: [''],
      serachInputRole: ['']
    });

    this.typePermissionForm = this.fb.group({
      userId: ['', Validators.required],
      serachInput: ['']
    });
  }

  /**this method used for check  tree node childrens length */
  hasChild = (_: number, node: TypeNode) => !!node.children && node.children.length > 0;


  filterdOptions = [];

  ngOnInit(): void {
    // updated by: shivam kumar
    // get permission keys data from localstorage in encrypt form and decrypted 
    setTimeout(() => {
      let permissionData: any = localStorage.getItem("permission");
      let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      let parsed_data = JSON.parse(permissions)
      this.permissionKeys = JSON.parse(parsed_data.MODULES);
      this.module = this.permissionKeys.filter((item: any) => item.module_id === 8);
    }, 500);



    this.getUserList();
    this.getRoleList();
    this.getModuleList();
    this.getAllRolePermissions();

    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);
    this.selectedUserTypePermListingData();


  }
  refreshSearch(event: any) {
    this.roleDataTableRefresh = false;
    this.typeDataTableRefresh = false;
    if (event == 'role') {
      setTimeout(() => {
        this.roleDataTableRefresh = true;
      }, 200);
    } else {
      setTimeout(() => {
        this.typeDataTableRefresh = true;
      }, 200);
    }
  }

  public view_edit_permission() {
    if (this.module[0].CREATE_ACCESS == 1) { // updated by shivam for role menu permission 26/07/2023
      this.showModuleList = false;
      this.checkboxShown = true;
      if (this.viewpermission == true) {
        this.createPermissions = true;
        this.viewpermission = false;
      }
      if (this.createPermissions = true) {
        this.showModuleList = false;
        this.getModuleList();
        this.permissionForm.patchValue({ role_id: '' })
      }
      this.getRoleList();
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have your permissions')
    }

  }




  ShowModuleList() {
    this.showModuleList = true;
    this.reset_btn_disabled = true;
  }

  // reset form for role permissions
  resetForm() {
    this.reset_btn_disabled = false;
    this.btnEnable = false;
    if (this.selectedRole == '' || this.selectedRole == undefined) {
      this.permissionForm.reset();
      this.getModuleList();
      this.showModuleList = false;
    } else {
      this.getPermissionsByRoleId();
    }

  }


  // get role id click on edit icon
  getRoleId(event: any) {
    if (this.module[0].EDIT_ACCESS == 1) // updated by shivam for role menu permission 26/07/2023
    {
      this.btnEnable = false;
      this.reset_btn_disabled = false;
      this.selectedRole = event.ROLE_ID;
      this.permissionForm.value.role_id = event.ROLE_ID;
      this.permissionForm.patchValue({ role_id: event.ROLE_ID })
      this.getPermissionsByRoleId();
      this.createPermissions = true;
      this.editPermissions = true;
      this.selectedRole1 = event.ROLE_NAME;
      this.showModuleList = true;

    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions')
    }

  }
  // validations for submit button
  anyCheckboxSelected(): boolean {
    // Iterate over the subModules array and check if any checkbox is selected
    for (let module of this.moduleList) {
      for (let subModule of module.SUB_MODULES) {
        if (subModule.READ_ACCESS || subModule.CREATE_ACCESS || subModule.EDIT_ACCESS || subModule.DELETE_ACCESS) {
          return true;
        }
      }
    }

    return false; // No checkbox is selected
  }



  /**
   * get role data 
   */
  getRoleList() {
    this.ngxLoader.start();
    this.service.getAPIMethod('/getUnassignedRole').subscribe((res => {
      this.roleData = res.result;
      this.filteredRoleList = res.result;
      this.ngxLoader.stop();

    }));
  }
  //  get permissions by role id
  getPermissionsByRoleId() {
    this.service.getAPIMethod(`/getPermissionsByRoleId?role_id=${this.selectedRole}`).subscribe((res => {
      this.moduleList = res.result;
      this.moduleList = JSON.parse(this.moduleList.Data[0].MODULE);
    }))
  }

  //  get all module list
  getModuleList() {
    this.ngxLoader.start();
    this.service.getAPIMethod('/getModuleList').subscribe((res => {
      this.ngxLoader.stop();
      this.moduleList = res.result;

      for (let i = 0; i < this.moduleList.length; i++) {
        this.moduleList[i].SUB_MODULES = [...JSON.parse(this.moduleList[i].SUB_MODULES)]
      } // this.getSubModule(this.moduleList[0]);
    }))

  }


  //  get all role permissions list
  getAllRolePermissions() {
    this.roleDataTableRefresh = true;
    this.tableDataLoad = true;
    this.reDraw();
    this.roledtOptions = {
      ...this.commonService.settingDataTableServer(),
      ajax: (dataTablesParameters: any, callback, settings) => {
        let params;
        if (this.URLSearchParams) {
          params = new URLSearchParams(this.URLSearchParams.toString());
        } else {
          params = new URLSearchParams();
        }
        const defaultOrdering = 'ROLE_NAME';
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
        const url = '/getAllRolePermissions';
        this.getRoleDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.loaderdata = false;

          this.ngxLoader.stop();

          if (resp.result?.data) {
            if (resp.result.data) {
              this.rolePermList = resp.result?.data;
              this.rolePermList.forEach((e: any, i: any) => {
                this.rolePermList[i].MODULE = e.MODULE;

              });
              //this.selectedUserListData = resp.result.data

            } else {
              this.rolePermList = [];
            }
            if (resp.result.total[0].COUNT || resp.result.total[0].COUNT == 0) {
              this.pageRecordsTotal = resp.result.total[0].COUNT;
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
            this.rolePermList = [];
          }
        },
          (error) => {
            this.rolePermList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.rolePermList = [];
          }
        );
      },
      columns: [
        // { orderable: false, data: '', width: '35px' },
        { orderable: true, data: 'ROLE_NAME', width: '90px' }



      ],
    };



  }
  getRolePermissions(event: any) {
    this.selectedRole = event.ROLE_ID;
    this.getPermissionsByRoleId();
  }
  // delete role permissions
  public tableDataLoad: boolean = false;
  deleteRolePerm(event: any) {
    this.tableDataLoad = false;
    if (this.module[0].DELETE_ACCESS == 1)  // updated by shivam for role menu permission 26/07/2023
    {
      const dialogRef = this.dialog.open(DeleteDialogBoxComponent,
        {
          data: {
            heading: 'Delete Permissions',
            title: 'Are you sure you want to delete Permissions?',
            buttonName: 'Yes Delete',
            panelClass: 'custom-modalbox'
          },
          width: '400px',
          height: 'auto'
        });

      dialogRef.afterClosed().subscribe((closeResult: any) => {

        if (closeResult) {
          const delUserObj = {
            action_type: 'delete',
            ROLE_ID: (event.ROLE_ID),
            action: '1',
            delete_reason: closeResult.reason,
            userId: this.userDetails.USER_ID
          }
          this.ngxLoader.start();
          this.service.postAPIMethod('/deleteRolePerm', delUserObj).subscribe((res => {
            this.ngxLoader.stop();
            if (res.result[0].ERR == 'X') {
              this.service.sweetAlertMsg('error', res.result[0].MSG)
            }
            else {
              this.getAllRolePermissions();
              this.getRoleList();
              this.service.sweetAlertMsg('success', res.result[0].MSG);
            }

          }))
          this.tableDataLoad = true;
        }
      });
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions')
    }
  }


  //  add update role permissions
  addUpdatepermissions() {
    this.moduleList1 = [];
    this.moduleList.filter((val: any) => {
      val.SUB_MODULES.filter((e: any) => {
        if (e.READ_ACCESS == true) {
          this.moduleList1.push(e);
        }
      })
    })





    this.selectedRole = '';
    this.selectedRole1 = '';

    if (this.moduleList1?.length > 0) {
      if (this.btnEnable) {


        let data = {
          role_id: this.permissionForm.value.role_id ? this.permissionForm.value.role_id : this.selectedRole, moduleArr: this.moduleList1
        };

        // if (this.moduleList1?.lenght > 0) {
        this.ngxLoader.start();
        this.service.postAPIMethod('/addUpdateRolePermissions', data).subscribe((response) => {
          this.ngxLoader.stop();
          if (response.result[0].ERR == 'X') {
            this.service.sweetAlertMsg('error', response.result[0].MSG)
          } else {
            this.service.sweetAlertMsg('success', response.result[0].MSG);
            this.viewpermission = true;
            this.createPermissions = false;
            this.editPermissions = false;
            this.checkboxShown = false;
            this.getAllRolePermissions();
            this.permissionForm.reset();
          }
        })



      } else {

      }

    } else {
      this.service.sweetAlertMsg('error', 'Please Select atleast one module');
      return
    }



  }


  handleCheckboxChange(subModule: any) {
    this.reset_btn_disabled = true;


    if (this.selectedRole == '' || this.selectedRole == undefined) {
      // if (subModule.READ_ACCESS == false && !this.anyCheckboxSelected()) {
      if (subModule.READ_ACCESS == false) {

        subModule.CREATE_ACCESS = false;
        subModule.EDIT_ACCESS = false;
        subModule.DELETE_ACCESS = false;
        this.btnEnable = true;
      }
      else {
        this.btnEnable = true;
      }


    }
    else {
      if (subModule.READ_ACCESS == false) {
        subModule.CREATE_ACCESS = false;
        subModule.EDIT_ACCESS = false;
        subModule.DELETE_ACCESS = false;

        this.btnEnable = true;
      } else {
        this.btnEnable = true;
      }
    }

  }


  // tree struture------

  backToViewPage() {
    this.viewpermission = true;
    this.createPermissions = false;
    this.editPermissions = false;
    this.checkboxShown = false;
    this.permissionForm.reset();
  }


  /** Rahul Type Permission Code Start */

  /**this method used for fetching users on dropdown */
  getUserList() {

    // get data from local storage.
    let Userdata: any = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(Userdata, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    let data = JSON.parse(decryptUserData);
    let userId = data.USER_ID;
    this.service.getAPIMethod(`/fetchActiveUsers?USER_ID=${userId}`).subscribe((res => {
      this.userList = res.result;
      this.filteredList = res.result;
    }));

  }


  // this method call for selecting user
  public getReportListData(event: any, flag: any) {


    let url: any = '';
    if (!event.value || undefined) {
      this.userId = event;
      this.typePermMsgFlag = 1;
      // this.typePermResetBtnFlag = 1;
    } else {
      this.userId = event.value;
      this.typePermBtnForSubmit = true;
      this.typePermMsgFlag = 0;
      // this.typePermResetBtnFlag = 0;
    }

    this.typePermResetBtn = false;

    if (flag == 0) {
      this.createTreeView = true;
      this.ngxLoader.start();
    }

    if (flag == 2) {
      this.typeDataArr = [];
    }


    this.service.getAPIMethod(`/getRepoData?userId=${this.userId}&&flag=${flag}`).subscribe((res => {
      this.dataSource.data = res.result;


      this.ngxLoader.stop();
      this.dataSource.data.forEach((item: any) => {
        if (flag == 0 || flag == 1) {
          this.typePermResetBtn = true;
          this.statusChangAfterEdit(item)
        }
      })
    }));

  }



  /**this method used for edit tyme parents and childs ke checkbox deakhne k liye true of false hai ya nai */
  statusChangAfterEdit(node: any) {
    if (node.isSelected) {
      this.selections.push(node);
      this.typeDataArr.push(node);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        this.childIsSelectedList.push(child.isSelected);
        this.statusChangAfterEdit(child)
      });
      /** Check all childern is true then parent should be true */
      let count = 0; // to check foreach (child exits parents)
      let check: boolean = true;//Use if all child is true then check should be true
      node.children.forEach((child: any) => {
        check = check && child.isSelected;
        count = 1;
      })
      if (count == 1) {
        node.isSelected = check;
      }
    }
  }


  /** used for last childs selection not for parents */
  selectionToggleLastChilds(isChecked: boolean, node: any) {
    this.typePermResetBtn = false;
    if (isChecked == true) {
      this.typePermBtnForSubmit = false;
    } else if (isChecked == false) {
      this.typePermBtnForSubmit = false;
    }
    node.isSelected = isChecked;
    if (node.isSelected && !this.selections.includes(node)) {
      this.selections.push(node);
      this.typeDataArr.push(node);
    } else if (!node.isSelected && this.selections.includes(node)) {
      let deleteIndex = this.selections.indexOf(node);
      this.selections.splice(deleteIndex, 1);
      let deleteIndex1 = this.typeDataArr.indexOf(node);
      this.typeDataArr.splice(deleteIndex1, 1);
    }
  }

  /** used for parents selection not for last childs */

  selectionToggle(isChecked: any, node: any) {
    this.typePermResetBtn = false;
    /**used condition for back tracking as eg. last childs to grand parents */
    if (isChecked == true) {
      this.typePermBtnForSubmit = false;
    } else if (isChecked == false) {
      this.typePermBtnForSubmit = false;
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {

        this.selectionToggle(isChecked, child);
      });
    } else {
      /***Only used for Last child values which stored in typeDataArr varibale*/
      node.isSelected = isChecked;
      if (node.isSelected && !this.typeDataArr.includes(node)) {
        this.typeDataArr.push(node);
      }
      else if (!node.isSelected && this.typeDataArr.includes(node)) {
        let deleteIndex = this.typeDataArr.indexOf(node);
        this.typeDataArr.splice(deleteIndex, 1);
      }
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
  }

  /**used for checked functionality */
  descendantsAllSelected(node: any) {
    let childIsSelectedList: any = [];
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        childIsSelectedList.push(child.isSelected);
      });
    }
    // scans to see if children are all true
    if (childIsSelectedList.length && childIsSelectedList.every((item: any) => {
      return item;
    })) {
      if (!this.selections.includes(node)) {
        this.selections.push(node);
      }
      return true;
    }

    /**used for recursion */
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => {
        this.descendantsAllSelected(child);
      });
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


  checkDescPartSelection(node: any) {
    this.childIsSelectedList = [];
    this.addChildSelection(node);
    // scans to see if children contain any false, but not all false
    if (this.childIsSelectedList.includes(false) && !this.childIsSelectedList.every(item => { return !item })) {
      return true;
    }
  }




  /**this method used for add and update type permission */
  public addUpdateType_Permission() {

    if (this.typeDataArr.length > 0 && this.userId != '') {
      let createdBy = this.userDetails.USER_ID; // get localstroge 
      let index = 0;
      let stringValue: any;
      this.typeDataArr.forEach((element: any) => {
        stringValue = index == 0 ? this.userId + ',' + element.report_Id + ',' + element.parent_Id + ',' + createdBy : stringValue + '#' + this.userId + ',' + element.report_Id + ',' + element.parent_Id + ',' + createdBy;
        index = 1;
      });

      let dataTypePerm = {
        msgFlag: this.typePermMsgFlag, /**this typePermMsgFlag used for add or update data 0 means add or 1 means update */
        stringData: stringValue,
        userId: this.userDetails.USER_ID, // this userid user for log
      }
      this.ngxLoader.start();
      this.service.postAPIMethod('/addUpdateTypePermissions', dataTypePerm).subscribe((res) => {
        this.ngxLoader.stop();
        if (res.result[0].ERR == 'X') {
          this.service.sweetAlertMsg('error', res.result[0].MSG)
        } else {
          this.service.sweetAlertMsg('success', res.result[0].MSG);
          this.typeDataArr = [];
          this.viewTypeDiv = true;
          this.createTypeDiv = false;
          this.selectedUserTypePermListingData();
          this.typePermissionForm.controls['userId'].patchValue("");
          //this.ngOnInit();
        }
      })

    }


  }

  /**this method used for fetch users listings who assigned reports */
  showUserViseTypeData(id: any, flag = 2) {
    this.getReportListData(id, flag);
  }


  /**this function used for open edit type permission block */
  editTypePerm(id: any, flag = 0) {// updated by shivam for role menu permission 31/07/2023
    if (this.module[0].EDIT_ACCESS == 1) {
      this.viewTypeDiv = false;
      this.createTypeDiv = true;
      this.userTypeDropDown = false;
      this.createTreeView = true;
      this.typePermBtnForSubmit = true;
      this.typePermResetBtn = true;

      this.getReportListData(id, flag)
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }

  }

  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }

  public tableDataLoadTypePerm: boolean = false;

  selectedUserTypePermListingData() {
    this.typeDataTableRefresh = true;
    this.tableDataLoadTypePerm = true;
    this.reDraw();
    this.dtOptions = {
      ...this.commonService.settingDataTableServer(),
      ajax: (dataTablesParameters: any, callback, settings) => {
        let params;
        if (this.URLSearchParams) {
          params = new URLSearchParams(this.URLSearchParams.toString());
        } else {
          params = new URLSearchParams();
        }
        const defaultOrdering = 'NAME';
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

        this.datatableElement
        this.ngxLoader.start();
        const url = '/fetchTypePermUserListingData';
        this.getTypeDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.loaderdata = false;
          this.ngxLoader.stop();

          if (resp.result?.data) {
            if (resp.result.data) {
              this.selectedUserListData = resp.result.data

            } else {
              this.selectedUserListData = [];
            }
            if (resp.result.total[0].COUNT || resp.result.total[0].COUNT == 0) {
              this.pageRecordsTotal = resp.result.total[0].COUNT;
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
            this.selectedUserListData = [];
          }
        },
          (error) => {
            this.selectedUserListData = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.selectedUserListData = [];
          }
        );
      },
      columns: [
        // { orderable: false, data: '', width: '35px' },
        { orderable: true, data: 'NAME', width: '90px' }



      ],
    };

  }


  /**this method used for open create type permission block */
  createTypePerm() {
    if (this.module[0].CREATE_ACCESS == 1) {// updated by shivam for role menu permission 31/07/2023
      this.userId = '';
      this.typePermissionForm.controls['userId'].setValue('');
      this.createTypeDiv = true;
      this.viewTypeDiv = false;
      this.userTypeDropDown = true;
      this.createTreeView = true;
      this.typePermBtnForSubmit = true;
      this.typeDataArr.length = [];
      this.getUserList();
    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }
  }
  //public tableDataLoadTypePerm = false;
  public deleteTypePerm(id: any) {


    if (this.module[0].DELETE_ACCESS == 1) {// updated by shivam for role menu permission 31/07/2023
      let USER_ID = id.USER_ID;

      const dialogRef = this.dialog.open(DeleteDialogBoxComponent,
        {
          data: {
            heading: 'Delete Permissions',
            title: 'Are you sure you want to delete Permissions?',
            buttonName: 'Yes Delete',
            panelClass: 'custom-modalbox'
          },
          width: '400px',
          height: 'auto'
        });



      dialogRef.afterClosed().subscribe((closeResult: any) => {
        if (closeResult) {
          this.tableDataLoadTypePerm = true;
          this.tableDataLoadTypePerm = false;
          const delUserObj = {
            action_type: 'delete',
            USER_ID: USER_ID,
            action: '1',
            delete_reason: closeResult.reason,
            userId: this.userDetails.USER_ID
          }

          this.ngxLoader.start();
          this.service.postAPIMethod('/deleteTypePermission', delUserObj).subscribe((res => {
            //this.tableDataLoadTypePerm = ;
            this.ngxLoader.stop();

            if (res.result[0].ERR == 'X') {
              this.service.sweetAlertMsg('error', res.result[0].MSG)
            }
            else {
              this.service.sweetAlertMsg('success', res.result[0].MSG);

              this.selectedUserTypePermListingData();

            }
            this.tableDataLoadTypePerm = true;
          }))

        }
      });

    }
    else {
      this.service.sweetAlertMsg('error', 'You do not have permissions')
    }


  }


  resetBtnTypePerm(id: any) {
    if (this.typePermMsgFlag == 1) {
      let flag = 1;  //this flag is used for could not call to loader
      this.getReportListData(id, flag)
      this.createTreeView = true; // create view screen show
    } else {
      this.typePermissionForm.controls['userId'].setValue('');
      this.typeDataArr = [];
      this.typePermResetBtn = true;
      this.typePermBtnForSubmit = true;
      this.createTreeView = false; // create view screen hide

    }
  }

  /**this method used for back to view type permission block */
  backBtnTypePerm() {
    this.typePermissionForm.controls['userId'].patchValue('');
    this.typeDataArr = [];
    this.createTypeDiv = false;
    this.viewTypeDiv = true;
    this.createTreeView = false;

  }

  /**this method used for serarching users in userdropdown */
  filterUsers(event: any) {
    const searchUser = event?.target?.value;
    if (searchUser && event) {
      this.filteredList = this.userList.filter(
        (item: any) => item.FULL_NAME.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    else {
      this.typePermissionForm.controls['serachInput'].patchValue('');
      this.filteredList = this.userList;
    }
  }

  /**this method used for serarching role in role dropdown */
  filterRole(event: any) {
    const searchRole = event?.target?.value;
    if (searchRole && event) {
      this.filteredRoleList = this.roleData.filter((item: any) =>
        item?.ROLE_NAME?.toLowerCase().includes(searchRole.toLowerCase())
      );
    }
    else {
      this.permissionForm.controls['serachInputRole'].patchValue('');
      this.filteredRoleList = this.roleData;
    }
  }

  /** Rahul Type Permission Code End */

}

