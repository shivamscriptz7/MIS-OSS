import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { getReportList } from '../../header/header.component';
import { Route, Router } from '@angular/router';
import { LocalshareService } from 'src/app/services/localshare.service';
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
//import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  public selectedTypeId: any;
  public getReportList: any;
  public selectedParent: any;
  public userId: any;
  @Input() items: getReportList[] | any;
  @ViewChild('childMenu') public childMenu: any;
  selectedTypeName: any;
  activeParentItem: any;
  getReportData: any;
  selectedparentId: any;


  constructor(public service: CommonService, public router: Router, public localShareService: LocalshareService) { }

  ngOnInit(): void {
    let data: any = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    let userData = JSON.parse(decryptUserData)
    this.userId = userData.USER_ID;
    //this.forceLogout(this.userId);
  }



  public get titleBreadcrummenu() {
    var list
    const url: any = this.router?.url;
    if (url.split('/').reverse()[0] == 'permissions') {
      list = 'Adminstartion'
    } else if (url.split('/').reverse()[0] == 'user') {
      list = 'Adminstartion'
    }
    else if (url.split('/').reverse()[0] == 'role') {
      list = 'Adminstartion'
    }
    else if (url.split('/').reverse()[0] == 'report-Creation') {
      list = 'Operations'
    }
    else if (url.split('/').reverse()[0] == 'report') {
      list = 'Prepaid'
    }
    else if (url.split('/').reverse()[0] == 'dashboard') {
      list = 'dashboard'
    }
    else if (url.split('/').reverse()[1] == 'admin_panel') {
      list = url.split('/').reverse()[1]
    }
    return list

  }
  public get titleBreadcrum() {
    const url: any = this.router?.url;
    return url.split('/').pop().replace(/_/g, ' ');
  }
  // this method call for selecting user
  getReportListData() {

    let data: any = localStorage.getItem("userData");
    let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    data = JSON.parse(decryptUserData);
    let user_id = data.USER_ID.toString();
    let role_id = data.USER_ROLE;
    this.service.getAPIMethod(`/getRoleTypeMenu?userId=${user_id}&&roleId=${role_id}`).subscribe((res => {
      this.getReportData = res.result;
      //console.log(this.getReportData,"this.getReportData ")
    }));

  }
  // used for get type id when click on menu
  getTypeId(data: any) {

    this.selectedTypeId = data.type_id;
    this.selectedTypeName = data.display;
    this.selectedParent = data.parent_name;
    this.localShareService.shareTypeIdData(this.selectedTypeId, this.selectedTypeName);

    let bredCrumData = JSON.stringify(data)
    let encryptbredCrumData = CryptoJS.AES.encrypt(bredCrumData, 'Rw7]HwL5cXH$zkh').toString();
    localStorage.setItem('selectedparentName', encryptbredCrumData);
    this.localShareService.shareParentTypeId.subscribe((msg: any) => {
      this.selectedparentId = msg;
    })
    this.localShareService.shareparentIdData(this.selectedparentId);
    $("#navbarSupportedContent").removeClass("show");
  }

}
