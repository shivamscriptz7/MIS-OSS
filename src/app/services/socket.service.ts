import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(public router: Router) {
    // Retrieve user data from localStorage
    const encryptedUserData: any = localStorage.getItem("userData");
    const decryptedUserData = CryptoJS.AES.decrypt(encryptedUserData, 'Rw7]HwL5cXH$zkh').toString(CryptoJS.enc.Utf8);
    const userData = JSON.parse(decryptedUserData);
    const userId = userData.USER_ID;

    // Connect to the socket server and pass user ID in the query
    this.socket = io({
      query: {
        "userId": userId
      }
    });
  }

  // Function to send login request to the server
  login(userId: any) {
    this.socket.emit('login', userId);
  }



  jobMonitoring() {
    return new Observable(observer => {
      this.socket.on(`viewSteps`, (data: any) => {
        observer.next(data);
      });
    });
  }


  stepsFile() {
    return new Observable(observer => {
      this.socket.on(`file`, (data: any) => {
        observer.next(data);
      });
    });
  }

  LogoutSocket(id: any) {
    this.socket.emit('logoutSocket', id);
  }

  DeleteLogout(id: any) {
    this.socket.emit(`delLogout${id}`);
  }

  // Function to listen for logout event from the server
  onLogoutPrevious(userId: any): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`logout${userId}`, (data: any) => {
        observer.next(data);
      });
    });
  }


  // Function to listen for logout event from the server
  onLogoutDelete(userId: any): Observable<any> {
    return new Observable(observer => {
      this.socket.on(`delLogout${userId}`, (data: any) => {
        observer.next(data);
      });
    });
  }


}
