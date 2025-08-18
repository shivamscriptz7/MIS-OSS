import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { HttpClientModule } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Edge_MIS';
  public tokenExpiryTime: any
  public oldDate: any;
  public count: any = 0;
  public timer: any;
  public user_name: any;
  public menuPermData: any;

  constructor(private service: CommonService, public route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    // localStorage.removeItem('permission');
    this.initListener();
    // this.localStorageCheck();
  }





  // localStorageCheck() {
  //   const helper = new JwtHelperService();
  //   let token: any = localStorage.getItem("access-token");
  //   let decodedToken = helper.decodeToken(token);
  //   let permissionData: any = localStorage.getItem("permission");
  //   let permissions = CryptoJS.AES.decrypt(permissionData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
  //   let parsed_data = JSON.parse(permissions)
  //   if (decodedToken.USER_ROLE != parsed_data.ROLE_ID) {
  //     localStorage.removeItem('userData');
  //     localStorage.removeItem('access-token');
  //     localStorage.removeItem('permission');
  //     this.router.navigateByUrl('/login');
  //   } else {
  //   }

  // }



  initListener() {
    document.body.addEventListener('click', () => this.refreshToken());
    document.body.addEventListener('keyup', () => this.refreshToken());
    document.body.addEventListener('enter', () => this.refreshToken());
    document.body.addEventListener('mouseover', () => this.refreshToken());
    document.body.addEventListener('mouseout', () => this.refreshToken());
  }

  refreshToken() {
    let token = localStorage.getItem('access-token');
    if (token !== null && (this.router.url !== '/login' && this.router.url !== '/forgot-password')) {
      this.tokenExpiryTime = JSON.parse(atob(token.split(".")[1])).exp;
      this.oldDate = new Date(0).setUTCSeconds(this.tokenExpiryTime);
      if ((this.oldDate - new Date().getTime()) / 1000 <= 120) {
        this.count++;
        if (this.count == 1) {
          this.service.getAPIMethod("/refreshToken?key=auto").subscribe((success: any) => {
            if (success.err != "X" && success.token) {
              this.count = 0;
              localStorage.setItem('access-token', success.token);
            }
            else {
              this.service.sweetAlertMsg('error', success.error.error.msg)
              this.service.logout();
              window.location.reload();
              this.router.navigateByUrl('/login')
            }
          });
        }
      } else {
        // console.log(this.oldDate - new Date().getTime(), (this.oldDate - new Date().getTime()) / 1000);

        if ((this.oldDate - new Date().getTime()) / 1000 <= 480) {
          this.autoCheckEvent()
        }
      }
    }
  }


  autoCheckEvent() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.service.getAPIMethod("/refreshToken?key=event").subscribe((success: any) => {
        if (success.err != "X" && success.token) {
          this.count = 0;
          localStorage.setItem('access-token', success.token);
        }
      });
    }, 1000);
  }
}