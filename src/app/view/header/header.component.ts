import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../user_management/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import * as CryptoJS from 'crypto-js';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { timeout } from 'rxjs';
import { LocalshareService } from 'src/app/services/localshare.service';
import { ChangeDetectorRef } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
interface TypeNode {
  display: any;
  value: any;
  children?: TypeNode[];
  isSelected: boolean;
}
export interface getReportList {
  displayName: string;
  iconName: string;
  route?: string;
  children?: getReportList[];
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('childMenu') public childMenu: any;
  public username: any;
  public imageUrl: any;
  public firstname: any;
  public lastname: any;
  public ngxAvatarFrstName: any;
  public ngxAvatarLastName: any;
  public permissionKeys: any;
  public module: any;
  public permission_disableBtn = false;
  public moduleList: any;
  public submodules: any;
  public parsed_data: any;
  moduleListBasedOnReports: any;
  public dataSource = new MatTreeNestedDataSource<TypeNode>();
  public treeControl = new NestedTreeControl<TypeNode>(node => node.children);
  public getReportList: any;
  public getReportList1: any;
  menuPermData: any;
  user_name: any;
  public activeParentMenuItem: any;
  public flag: any = false;
  selectedparentId: any;
  urlName: any;
  public userId: any;
  public currentYear: any;
  constructor(public router: Router, private socketService: SocketService, public dialog: MatDialog, public service: CommonService,
    public auth: AuthGuardService, public ngxLoader: NgxUiLoaderService, private localShareService: LocalshareService, private cdr: ChangeDetectorRef) { }
  hasChild = (_: number, node: TypeNode) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.getReportListData();
    //this.forceLogout();
    //this.socketService.DeleteLogout()
    this.getYear();
    this.selectedparentId = localStorage.getItem('selectedparentId');
    this.service.userImage.subscribe((item: any) => {
      // use to show username and full name on header from localstorage
      let data: any = localStorage.getItem("userData");
      let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
      data = JSON.parse(decryptUserData)
      this.userId = data.USER_ID;
      this.forceLogout(this.userId);
      this.forceLogoutDelete(this.userId);

      this.imageUrl = data.USER_IMAGE;
      this.firstname = data.FIRST_NAME;
      this.lastname = data.LAST_NAME;
      this.user_name = data.USER_NAME;
      this.ngxAvatarFrstName = data.FIRST_NAME?.trimStart().split(' ');
      this.ngxAvatarLastName = data.LAST_NAME?.trimStart().split(' ');
      this.localShareService.selectedparentId.subscribe((msg: any) => {
        this.selectedparentId = msg;

      })



    })

    // updated by: shivam kumar
    // get permission keys data from localstorage in encrypt form and decrypted 
    let permissionData: any = localStorage.getItem("permission");
    let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh')?.toString(CryptoJS.enc.Utf8);
    this.parsed_data = JSON.parse(permissions)
    this.permissionKeys = JSON.parse(this.parsed_data.MODULES);
    this.getModuleList();
    this.getModuleListBasedOnReport();

  }

  public details: any;
  public logout() {
    this.details = {
      'USERID': this.userId,
      'LOGIN_FLAG': 0,
      'PROC_STATUS': 1

    }
    this.service.postAPIMethod('/update_loginFlag', this.details).subscribe((res) => {
    })

    setTimeout(() => {
      //console.log(this.userId, 'check user if in FE');
      //this.socketService.LogoutSocket(this.userId);
      // localStorage.clear();
      localStorage.removeItem("userData");
      localStorage.removeItem("access-token");
      localStorage.removeItem("permission");
      localStorage.removeItem("selectedTypeId");
      localStorage.removeItem("selectedparentId");
      localStorage.removeItem("selectedparentName");
      //window.location.reload();
      this.router.navigate(['/login']);
      window.location.reload();
    }, 200);

  }

  public loginSubscription: any;


  changepasswordpopup() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {
        loginId: this.username,
      },
      width: '560px',
      height: 'auto'
    });
  }
  // for get main-module and sub-module data as dynamic
  getModuleList() {
    this.service.getAPIMethod('/getModuleList').subscribe((res => {
      this.moduleList = res.result;
      //console.log(this.moduleList, "kkkkkkkkkkkkk")
      for (let i = 0; i < this.moduleList.length; i++) {
        this.moduleList[i].SUB_MODULES = [...JSON.parse(this.moduleList[i].SUB_MODULES)]

      }
    }))
  }



  // this method call for selecting user
  // getReportListData() {
  //   let data: any = localStorage.getItem("userData");
  //   let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
  //   data = JSON.parse(decryptUserData);
  //   let user_id = data.USER_ID.toString();
  //   let role_id = data.USER_ROLE;
  //   this.service.getAPIMethod(`/getRoleTypeMenu?userId=${user_id}&&roleId=${role_id}`)?.subscribe((res => {
  //     this.dataSource.data = res.result;
  //     this.getReportList = res.result;
  //     //console.log(this.dataSource.data,"this.dataSource.data")
  //     //console.log(this.getReportList,"this.getReportList")
  //   }));

  // }

  getReportListData() {
    let data: any = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    data = JSON.parse(decryptUserData);
    let user_id = data.USER_ID.toString();
    let role_id = data.USER_ROLE;

    this.service.getAPIMethod(`/getRoleTypeMenu?userId=${user_id}&&roleId=${role_id}`).subscribe((res => {
      this.dataSource.data = res.result;
      this.getReportList = res.result;

      // Manually trigger change detection after the asynchronous operation
      this.cdr.detectChanges();
    }));
  }


  // get selected parent Id when click on parent
  getSelectedParentId(parent_id: any) {


    // localStorage.setItem('selectedparentId', parent_id);
    this.localShareService.shareParentTypeIdData(parent_id);

  }



  // for get main-module based on reports and sub-module data as dynamic
  getModuleListBasedOnReport() {
    this.service.getAPIMethod('/getModuleListBasedOnReport').subscribe((res => {
      this.moduleListBasedOnReports = res.result;
      for (let i = 0; i < this.moduleListBasedOnReports.length; i++) {
        this.moduleListBasedOnReports[i].SUB_MODULES = [...JSON.parse(this.moduleListBasedOnReports[i].SUB_MODULES)]

      }
    }))
  }
  public get titleBreadcrummenu() {
    var list
    const url: any = this.router?.url;
    if (url.split('/').reverse()[0] == 'permissions') {
      list = 'Administration'
    } else if (url.split('/').reverse()[0] == 'user') {
      list = 'Administration'
    }
    else if (url.split('/').reverse()[0] == 'slr') {
      list = 'SLR REPORTS'
    }
    else if (url.split('/').reverse()[0] == 'slr_associated') {
      list = 'SLR REPORTS'
    }
    else if (url.split('/').reverse()[0] == 'role') {
      list = 'Administration'
    }
    else if (url.split('/').reverse()[0] == 'report') {
      list = 'Prepaid'
    }
    else if (url.split('/').reverse()[0] == 'dashboard') {
      list = 'dashboard'
    }
    else if (url.split('/').reverse()[0] == 'report-Creation') {
      list = 'Operations'
    }
    else if (url.split('/').reverse()[0] == 'schedule') {
      list = 'Operations'
    }
    // else if (url.split('/').reverse()[0] == 'Monitoring') {
    //   list = 'Operations'
    // }
    // else if (url.split('/').reverse()[0] == 'Audit-Trail') {
    //   list = 'Operations'
    // }
    else if (url.split('/').reverse()[0] == 'billing') {
      list = 'BSS REPORTS'
    }
    else if (url.split('/').reverse()[1] == 'Prepaid') {
      list = 'PREPAID REPORTS'
    }
    else if (url.split('/').reverse()[1] == 'Mediation') {
      list = 'BSS REPORTS'
    }
    else if (url.split('/').reverse()[1] == 'ICB') {
      list = 'BSS REPORTS'
    }
    else if (url.split('/').reverse()[1] == 'user-profile') {
      list = url.split('/').reverse()[1]
    }

    return list

  }
  public get titleBreadcrum() {
    const url: any = this.router?.url;
    return url.split('/').pop().replace(/_/g, ' ');
  }


  // for disable mainmenu when all sub-menu of main-module is hide
  permissionCheckDisable(item: any, permissionArr: any) {
    let viewP = []
    item.SUB_MODULES.forEach((arr: any) => {
      permissionArr.findIndex((arr1: any) => {
        if (arr1.module_id == arr.module_id) {
          if (arr1.READ_ACCESS) {
            viewP.push(arr.module_id)
          }
        }
      })
    })
    return viewP.length == 0 ? true : false;
  }
  closepopUp() {
    //this.namebutton.nativeElement.classList.remove('class-to-remove')
    $("#navbarSupportedContent").removeClass("show");
  }

  public getYear() {
    //this.currentYear=(new Date()).getFullYear();
    this.currentYear = '2023';
  }
  forceLogout(id: any) {
    this.socketService.onLogoutPrevious(id).subscribe((success: any) => {

      this.socketService.LogoutSocket(id);
      this.service.sweetAlertMsg('error', "your user id logged in another window")
      // use for remove data from local 
      const localstorageKeys = ["userData", "access-token", "permission", "selectedTypeId", "selectedparentId", "selectedparentName"];
      // Loop through the array and remove each item from localStorage
      localstorageKeys.forEach((item: any) => localStorage.removeItem(item));

      this.socketService.LogoutSocket(id);
      this.service.sweetAlertMsg('error', "your user id logged in another window")
      setTimeout(() => {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/login']);
      }, 1000);
      // window.location.reload();
      // this.router.navigate(['/login']);


      // 
    });
  }


  forceLogoutDelete(id: any) {
    this.socketService.onLogoutDelete(id).subscribe((success: any) => {

      // this.socketService.LogoutSocket(id);
      // this.service.sweetAlertMsg('error', "your user id logged in another window")
      // use for remove data from local 
      const localstorageKeys = ["userData", "access-token", "permission", "selectedTypeId", "selectedparentId", "selectedparentName"];
      // Loop through the array and remove each item from localStorage
      localstorageKeys.forEach((item: any) => localStorage.removeItem(item));

      this.socketService.LogoutSocket(id);
      this.service.sweetAlertMsg('error', "Your user account has been deleted.")
      setTimeout(() => {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/login']);
      }, 1000);
      // window.location.reload();
      // this.router.navigate(['/login']);


      // 
    });
  }



}

