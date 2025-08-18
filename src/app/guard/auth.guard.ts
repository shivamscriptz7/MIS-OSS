import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { AuthGuardService } from '../../app/services/auth-guard.service';
import * as CryptoJS from 'crypto-js';
import { CommonService } from '../services/common.service';

@Injectable({
    providedIn: 'root'
})
export class authguard implements CanActivate, CanActivateChild {
    public user_name: any;
    public menuPermData: any;
    public typeMenuPerm: any;

    constructor(public router: Router, public authService: AuthGuardService, public service: CommonService) {

    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        this.canActivate(route, state);
        return true;
    }


    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,): any {
        let url = state.url;
        var login = false
        var permissionlist: any = ['/MIS/user/user-profile', '/MIS/dashboard'];
        if (this.authService.isLoggedIn(url)) {
            let data: any = localStorage.getItem("userData");
            let decryptUserData = CryptoJS.AES.decrypt(data, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8); //decrypt userData from local storage 
            data = JSON.parse(decryptUserData)
            
            this.user_name = data.USER_NAME;
            this.service.getAPIMethod(`/getMenupermissions`).subscribe((res) => {
                this.menuPermData = res.result;
                this.typeMenuPerm = res.result1;
                let user_permission = CryptoJS.AES.encrypt(JSON.stringify(this.menuPermData[0]), 'Rw7]HwL5cXH$zkh').toString();
                localStorage.setItem('permission', user_permission);
                JSON.parse(this.menuPermData[0].MODULES).forEach((element: any) => {
                    if (element.routing === null) {
                        permissionlist.push([]);
                    } else {
                        permissionlist.push(element.routing);
                    }
                });
                JSON.parse(this.typeMenuPerm[0].JSONRESULT)?.forEach((element: any) => {
                    if (element.routing === null) {
                        permissionlist.push([]);
                    } else {
                        permissionlist.push(element.routing);
                    }
                });
                permissionlist.forEach((elem: any) => {
                    if (elem == state.url) {
                        login = true
                        return
                    }
                });
                if (login == false) {
                    this.router.navigateByUrl('/**');
                }
                return login


            });

        } else {
            // use for remove data from local 
            const localstorageKeys = ["userData", "access-token", "permission", "selectedTypeId", "selectedparentId", "selectedparentName"];
            // Loop through the array and remove each item from localStorage
            localstorageKeys.forEach((item: any) => localStorage.removeItem(item));
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
            return false;
        }


    }
    logOut() {
        localStorage.removeItem('access-token');
        this.router.navigateByUrl('/login');
    }

}