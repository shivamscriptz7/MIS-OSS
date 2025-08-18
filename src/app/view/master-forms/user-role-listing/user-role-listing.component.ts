import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateUserRoleComponent } from '../add-update-user-role/add-update-user-role.component';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-user-role-listing',
  templateUrl: './user-role-listing.component.html',
  styleUrls: ['./user-role-listing.component.scss']
})
export class UserRoleListingComponent implements OnInit {
  public redirectRoleForm: boolean = false;
  public updateUserRoleForm: any;
  public userRoleFormData: any;
  public role: any;
  // use for permissions
  public permissionKeys: any;
  public module: any;
  public loaderdata: boolean = true;
  public URLSearchParams: any;
  public page: number | any;
  public size: any;
  public pageRecordsTotal: number | any;
  public getRoleDetails: Subscription | any;
  public search: string = '';
  public rdering: string = '';
  public otherParams: any;
  public userDetails: any; //kajal code for getting localstorage value
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  columnDefs: any = [
    { orderable: true, targets: 0 },
    { orderable: true, targets: 1 },
    { orderable: true, targets: 2 },
    { orderable: true, targets: 3 },

    { orderable: true, targets: '_all' }
  ];
  roleList: any = [];
  constructor(public commonService: CommonHelperService,
    public dialog: MatDialog,
    public service: CommonService,
    public ngxLoader: NgxUiLoaderService,
    public route: Router
  ) { }


  ngOnInit(): void {
    // get permission keys data from localstorage in encrypt form and decrypted 
    setTimeout(() => {
      let permissionData: any = localStorage.getItem("permission");
      let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      let parsed_data = JSON.parse(permissions)
      this.permissionKeys = JSON.parse(parsed_data.MODULES);
      this.module = this.permissionKeys.filter((item: any) => item.module_id === 7);
    }, 500);



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
    this.getUserRole();
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);


  }
  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }
  //Purpose: fetch user-role listing
  getUserRole() {
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
          '',
          this.otherParams
        );
        this.ngxLoader.start();
        const url = '/getRoleList';
        this.getRoleDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          
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
        { orderable: true, data: 'ROLE_NAME' },
        { orderable: true, data: 'ROLE_DESC' },
        { orderable: true, data: 'IS_ACTIVE' },
        { orderable: false, data: '' }
      ],
    };
  }

  addUpdateRole(list: any) {
    if (((list.ROLE_ID == null || list.ROLE_ID == '') && this.module[0].CREATE_ACCESS == 1) || (!(list.ROLE_ID == null || list.ROLE_ID == '') && this.module[0].EDIT_ACCESS == 1) && list.IS_ACTIVE == 0) { // updated by shivam for role menu permission 26/07/2023
      if (this.userDetails.USER_ROLE != list.ROLE_ID) {
        const dialogRef = this.dialog.open(AddUpdateUserRoleComponent, {
          disableClose: true,

          data: {
            details: list,
            title: list?.id ? 'Edit Role' : 'Create Role',
            buttonName: 'Submit',
          },
          width: '650px',
          height: 'auto',
        });
        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            this.getUserRole();
          }
        });
      }
      else {
        this.service.sweetAlertMsg('error', 'You can not edit your own role');
      }

    }
    else {
      this.service.sweetAlertMsg('error', ' You do not have permissions or role is inactive')
    }

  }



  // delete the selected user-role
  deleteUserRole(item: any) {
    let roleName = item.ROLE_NAME;
    let roleNameToolTip = item.ROLE_NAME && item.ROLE_NAME.length > 20 ? `${item.ROLE_NAME.slice(0, 30)}...` : item.ROLE_NAME;
    if (this.module[0].DELETE_ACCESS == 1) {
      if (this.userDetails.USER_ROLE != item.ROLE_ID) {
        const dialogRef = this.dialog.open(DeleteDialogBoxComponent,
          {
            data: {
              heading: 'Delete Role ' + roleName,
              title: 'Are you sure, you want to delete ' + roleNameToolTip + ' Role and its details?',
              buttonName: 'Yes Delete',
              panelClass: 'custom-modalbox'
            },
            width: '400px',
            height: 'auto'

          });

        dialogRef.afterClosed().subscribe((closeResult: any) => {

          if (closeResult) {
            const delUserRoleObj = {
              action_type: 'delete',
              role_id: JSON.stringify(item.ROLE_ID),
              action: '1',
              delete_reason: closeResult.reason,
            }
            this.ngxLoader.start();
            this.service.postAPIMethod("/activeDeleteRole", delUserRoleObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', response.result[0].MSG);
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);
                this.getUserRole();
              }
            })
          }
        });
      } else {
        this.service.sweetAlertMsg('error', 'You can not delete your own role');
      }
    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }

  }
  // Purpose to activate or deactivate user login status
  onToggleChangeRole(obj: any, events: any) {
    if (this.module[0].EDIT_ACCESS == 1) {
      if (this.userDetails.USER_ROLE != obj.ROLE_ID) {
        events.target.checked = !events.target.checked;
        const isActive = obj.IS_ACTIVE == '1' ? '0' : '1';
        const delUserRoleObj = {
          action_type: 'active',
          role_id: JSON.stringify(obj.ROLE_ID),
          action: isActive,
        }
        const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,

          {

            data: {
              heading: 'Confirmation',
              title: obj.IS_ACTIVE == '1' ? "Do you want to activate the User Role?" : "Do you want to deactivate the User Role?",
              buttonName: 'Submit'
            },
            width: '400px',
            height: 'auto'
          }
        );
        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            this.ngxLoader.start();
            this.service.postAPIMethod("/activeDeleteRole", delUserRoleObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', response.result[0].MSG)
              }
              else {
                this.service.sweetAlertMsg('success', response.result[0].MSG);
                this.getUserRole();
              }
            })
          }
        });
      } else {
        events.target.checked = !events.target.checked;
        this.service.sweetAlertMsg('error', 'You can not update your own role');
      }
    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }

  }

}
