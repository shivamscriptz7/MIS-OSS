import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  httpOptions = {
    Headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor() { }
  setToken(token: any) {
    localStorage.setItem('access-token', token);
  }
  getToken() {
    localStorage.getItem('access-token');
  }
  isAuthorized() {
    Boolean(localStorage.getItem('access-token'));
  }
  isLoggedIn(url?: any) {
    var lastUrl = url.substring(url.lastIndexOf("/"), url.length);
    if (localStorage.getItem('access-token') === null || localStorage.getItem('access-token') === undefined ||
      localStorage.getItem('access-token') === '') {
      return false;
    } else {
      return true;
    }
  }
  userProfileDetails() {
    let token = localStorage.getItem('access-token');
    let payload;
    if (token) {
      payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
}
