import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
import { DeleteDialogBoxComponent } from '../../dialogbox/delete-dialog-box/delete-dialog-box.component';
import { StatusChangeDialogBoxComponent } from '../../dialogbox/status-change-dialog-box/status-change-dialog-box.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { CommonService } from 'src/app/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DescriptionDialogBoxComponent } from '../../dialogbox/description-dialog-box/description-dialog-box.component';
import { Subscription, debounceTime } from 'rxjs';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  loaderdata: boolean = true;
  URLSearchParams: any;
  page: number | any;
  size: any;
  pageRecordsTotal: number | any;
  getUserDetails: Subscription | any;
  search: string = '';
  ordering: string = '';
  otherParams: any;

  // shivam kumar
  public permissionKeys: any;
  public module: any;

  public userDetails: any
  columnDefs: any = [
    { orderable: true, targets: 0, width: '40px' },
    { orderable: true, targets: 1, width: '90px' },
    { orderable: true, targets: 2, width: '90px' },
    { orderable: true, targets: 3, width: '90px' },
    { orderable: true, targets: 4, width: '90px' },
    { orderable: true, targets: 5, width: '90px' },
    { orderable: true, targets: 6, width: '90px' },
    { orderable: true, targets: 7, width: '90px' },
    { orderable: true, targets: 8, width: '90px' },
    { orderable: true, targets: 9, width: '90px' },
    { orderable: true, targets: 10, width: '50px' },
    { orderable: true, targets: '_all' }
  ];
  userList: any = [];
  userCircle: any = [];
  userZone: any = [];
  userType: any = [];

  constructor(public commonService: CommonHelperService,
    public dialog: MatDialog,
    public service: CommonService,
    public ngxLoader: NgxUiLoaderService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // updated by: shivam kumar
    // get permission keys data from localstorage in encrypt form and decrypted 
    setTimeout(() => {
      let permissionData: any = localStorage.getItem("permission");
      let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      let parsed_data = JSON.parse(permissions)
      this.permissionKeys = JSON.parse(parsed_data.MODULES);
      this.module = this.permissionKeys.filter((item: any) =>
        item.module_id === 6
      );
      this.ngxLoader.stop();
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
    this.getUserList();
    this.userDetails = localStorage.getItem('userData');
    let decryptUserData = CryptoJS.AES.decrypt(this.userDetails, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    this.userDetails = JSON.parse(decryptUserData);



    // let getHtml = document.getElementsByClassName('dataTables_filter')[0]



  }

  reDraw(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => { dtInstance.draw(); });
    }
  }

  //Purpose: fetch user listing
  getUserList() {
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
        const url = '/getUserList';
        this.getUserDetails = this.service.getAPIMethod(url + '?' + params).pipe(debounceTime(500)).subscribe((resp) => {
          this.loaderdata = false;
          this.ngxLoader.stop();
          if (resp.result[0]) {
            if (resp.result[0]) {
              this.userList = resp.result[0].map((data: any) => {
                return {
                  ...data,
                  checked: false,
                };
              });
            } else {
              this.userList = [];
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
            this.userList = [];
          }
        },
          (error) => {
            this.userList = false;
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            this.userList = [];
          }
        );
      },
      columns: [
        { orderable: false, data: '', width: '40px' },
        { orderable: true, data: 'USER_NAME', width: '90px' },
        { orderable: true, data: 'FIRST_NAME', width: '90px' },
        { orderable: true, data: 'USER_EMAIL', width: '90px' },
        { orderable: true, data: 'USER_CONTACT', width: '90px' },
        { orderable: true, data: 'ROLE_NAME', width: '90px' },
        { orderable: true, data: 'TYPE_NAMES', width: '90px' },
        { orderable: true, data: 'ZONE_NAMES', width: '90px' },
        { orderable: true, data: 'CIRCLE_NAMES', width: '90px' },
        { orderable: true, data: 'SC_DESC', width: '90px' },
        { orderable: true, data: 'USER_ACTIVE', width: '90px' },

        { orderable: false, data: '', width: '50px' }


      ],
    };

  }

  addUpdateUser(list: any) {
    if (((list.USER_ID == null || list.USER_ID == '') && this.module[0].CREATE_ACCESS == 1) || (!(list.USER_ID == null || list.USER_ID == '') && this.module[0].EDIT_ACCESS == 1) && list.USER_ACTIVE == 0) {
      if (this.userDetails.USER_ID != list.USER_ID) {
        const dialogRef = this.dialog.open(AddUpdateUserComponent, {
          disableClose: true,
          data: {
            details: list,
            title: list?.USER_ID ? 'Edit User' : 'Create User',
            buttonName: list?.USER_ID ? 'Update' : 'Submit',
          },
          width: '650px',
          height: 'auto',
        });
        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            this.getUserList();
          }
        });
      } else {
        this.service.sweetAlertMsg('error', 'You can not update your own profile');
      }
    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions or user is inactive');
    }

  }




  // Purpose to delete the selected user
  deleteUser(item: any) {
    let userName = item.USER_NAME;
    let userNameToolTip = item.USER_NAME && item.USER_NAME.length > 20 ? `${item.USER_NAME.slice(0, 30)}...` : item.USER_NAME;
    if (this.module[0].DELETE_ACCESS == 1) {
      if (this.userDetails.USER_ID != item.USER_ID) {
        const dialogRef = this.dialog.open(DeleteDialogBoxComponent,
          {
            data: {
              heading: 'Delete User ' + userName,
              title: "Are you sure you want to delete " + userNameToolTip + " and its permissions?",
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
              userId: JSON.stringify(item.USER_ID),
              action: '1',
              delete_reason: closeResult.reason
            }
            this.ngxLoader.start();
            this.service.postAPIMethod("/activeDeleteUser", delUserObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', response.result[0].MSG)
              }
              else {
                this.getUserList();
                this.service.sweetAlertMsg('success', response.result[0].MSG);
              }
            })
          }
        });
      } else {
        this.service.sweetAlertMsg('error', 'You can not delete your own profile');
      }
    } else {
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }

  }

  // Purpose to activate or deactivate user login status
  onToggleChange(obj: any, events: any) {

    if (this.module[0].EDIT_ACCESS == 1) {
      if (this.userDetails.USER_ID != obj.USER_ID) {
        events.target.checked = !events.target.checked;
        const isActive = obj.USER_ACTIVE == '1' ? '0' : '1';
        const delUserObj = {
          action_type: 'active',
          userId: JSON.stringify(obj.USER_ID),
          action: isActive,
        }
        const dialogRef = this.dialog.open(StatusChangeDialogBoxComponent,
          {
            data: {
              heading: 'Confirmation',
              title: obj.USER_ACTIVE == '1' ? "Do you want to activate the user?" : "Do you want to deactivate the user?",
              buttonName: 'Submit'
            },
            width: '400px',
            height: 'auto'
          }
        );
        dialogRef.afterClosed().subscribe((closeResult: any) => {
          if (closeResult) {
            this.ngxLoader.start();
            this.service.postAPIMethod("/activeDeleteUser", delUserObj).subscribe((response: any) => {
              this.ngxLoader.stop();
              if (response.result[0].ERR == 'X') {
                this.service.sweetAlertMsg('error', response.result[0].MSG)
              }
              else {
                this.getUserList();
                this.service.sweetAlertMsg('success', response.result[0].MSG);
              }
            })

          }
        });
      } else {
        events.target.checked = !events.target.checked;
        this.service.sweetAlertMsg('error', 'You can not update your own profile');
      }
    } else {
      events.target.checked = !events.target.checked;
      this.service.sweetAlertMsg('error', 'You do not have permissions');
    }
  }
  // Purpose to Reset the selected user
  resetPassword(list: any) {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: {
        heading: 'Reset Password',
        details: list,
        title: list.user_active == '1' ? "User is deactivated do you want to reset the user?" : "Do you want to reset the user?",
        buttonName: 'Submit'
      },
      width: '460px',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe((closeResult: any) => {
      if (closeResult) {
        this.ngxLoader.start();
        this.service.postAPIMethod("/resetUserPassword", list).subscribe((response: any) => {
          this.ngxLoader.stop();
          if (response.result[0].ERR == 'X') {
            this.service.sweetAlertMsg('error', response.result[0].MSG)
          }
          else {
            this.getUserList();
            this.service.sweetAlertMsg('success', response.result[0].MSG);
          }
        })
      }
    });
  }

  //Description Dialog
  descriptionDialogBox(details: any, data: any) {
    let heading = "User Details";
    let object_key = Object.keys(details);
    for (let i = 0; i < object_key.length; i++) {
      details[object_key[i]] = details[object_key[i]].split(",");
    }
    const dialogRef = this.dialog.open(DescriptionDialogBoxComponent,
      {
        data: {
          heading: '',
          details: details,
          itemData: data,
          title: heading,
          buttonName: ""
        },
        width: '600px',
        height: 'auto'
      }
    );
  }
}

