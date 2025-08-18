import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
//import  html2pdf from 'html2pdf.js';
const html2pdf: any = require('html2pdf.js');
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const key = require('config.json');

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseURL: string = '';
  public userProfile = new BehaviorSubject(null);
  userImage: any = this.userProfile.asObservable();

  private fetchModuleIdforLogs = new BehaviorSubject<any>(null); // Subject to hold data
  public moduleId = this.fetchModuleIdforLogs.asObservable(); // Observable to subscribe to

  private fetchModulePdfData = new BehaviorSubject<any>(null); // Subject to hold data
  public logsDataPdf = this.fetchModulePdfData.asObservable(); // Observable to subscribe to

  private jobId = new BehaviorSubject<any>(null);
  currentJobId = this.jobId.asObservable();

  httpOptions = {
    headers: new HttpHeaders(
      {
        "Content-Type": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*"
      }
    ),
  };

  // public header = new Headers();

  public logoBase64 = "data:image/jpeg;base64,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";

  public secretKeyEncrypt_Decrypt = key.encrypt_decryptKey;

  constructor(private http: HttpClient, public router: Router, public ngxLoader: NgxUiLoaderService,) {
    // this.header.append('Content-Type', 'application/json');
    // //headers.append('authentication', `${student.token}`);
    // let options = new RequestOptions({ headers: headers });
  }

  getHeaderImage(data: any) {
    this.userProfile.next(data)
  }

  getJobId(data: any) {
    this.jobId.next(data);
  }

  /**
   * Post API method
   * @param url
   * @param data
   * @Developer Rahul Kumar
   */

  public postAPIMethod(url: any, postData: any): Observable<any> {
    // url = this.baseURL + url;
    return this.http.post<any>(url, postData).pipe(
      map((res: any) => {
        return res;
      }), catchError(<T>(error: any, result?: T) => {

        error == 'Unknown Error' ? error = 'Network Error' : error = error
        const data = {
          error: error,
          result: result
        }
        return of(result as T);
      }));
  }

  public postAPIMethodWithHeader(url: any, postData: any): Observable<any> {
    return this.http.post<any>(url, postData, this.httpOptions).pipe(
      map((res: any) => {
        return res;
      }), catchError(<T>(error: any, result?: T) => {

        error == 'Unknown Error' ? error = 'Network Error' : error = error
        const data = {
          error: error,
          result: result
        }
        return of(result as T);
      }));
  }

  /**
  * Get API Method
  * @param url
  * @Developer Rahul Kumar
  */
  public getAPIMethod(url: any): Observable<any> {
    url = this.baseURL + url;
    return this.http.get<any>(url).pipe(
      map((res: any) => { return res; }), catchError(<T>(error: any, result?: T) => {
        error == 'Unknown Error' ? error = 'Network Error' : error = error
        const dataObj = {
          result: result,
          error: error
        }
        return of(dataObj);
      }));
  }

  public sweetAlertMsg(typeIcon: any, msg: any) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timer: 3000,
      title: msg,
    });
  }

  /****Monitoring Error Popup**** */
  public sweetAlertMsgMonitoring(typeIcon: any, msg: any) {

    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timer: 4000,
      title: msg,
      customClass: {
        popup: 'monitoring-swal-popup',  // Add custom class to the popup        
      },
    });
  }


  public sweetAlertMsgLogin(typeIcon: any, msg: any) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timer: 2000,
      title: msg,
    });
  }

  public sweetAlertMsgWarning(typeIcon: any, msg: any) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timer: 6000,
      title: msg,
    });
  }

  public logout() {
    // use for remove data from local 
    const localstorageKeys = ["userData", "access-token", "permission", "selectedTypeId", "selectedparentId", "selectedparentName"];
    // Loop through the array and remove each item from localStorage
    localstorageKeys.forEach((item: any) => localStorage.removeItem(item));
  }

  // use for send module id for showing log componenet on the basis of module id 
  fetchModuleId(data: any) {
    this.fetchModuleIdforLogs.next(data); // Send data to subscribers
  }

  pdfLogsData(data: any) {
    this.fetchModulePdfData.next(data); // Send data to subscribers
  }

  generatePDF(filename: any) {
    this.ngxLoader.start();
    const element = document.getElementById('contentToConvert');
    this.ngxLoader.stop();

    if (element) {
      const options = {
        margin: [1.5, 1, 1.5, 1], // Margins in inches
        filename: filename || 'document.pdf',
        image: { type: 'JPEG', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Convert HTML to PDF
      html2pdf().set(options).from(element).toPdf().get('pdf').then((pdf: any) => {
        // Example border styling
        const borderThickness = 0.02; // Border thickness in inches
        const borderColor = '#000'; // Border color
        const pageCount = pdf.internal.getNumberOfPages();

        const header = 'BHARAT SANCHAR NIGAM LTD';
        // const pageCount = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.text(header, 3, 1); // Position the header text (x, y in inches)

          // Add the logo image
          const logoWidth = 1; // Logo width in inches
          const logoHeight = 0.5; // Logo height in inches
          pdf.addImage(this.logoBase64, 'PNG', 0.7, 0.7, logoWidth, logoHeight); // Position the logo

          // Draw border around the page
          const borderMargin = 0.5; // Margin from the edge of the page (in inches)
          const pageWidth = 8.5; // Page width (in inches)
          const pageHeight = 10.7; // Page height (in inches)
          pdf.setDrawColor(0, 0, 0); // Border color (black)
          pdf.setLineWidth(0.01); // Border thickness (in inches)
          pdf.rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin); // Draw border

          // Draw horizontal line
          const lineYPosition = 1.3; // Y-coordinate for the horizontal line (in inches)
          const lineStartX = borderMargin; // Starting X-coordinate of the line (in inches)
          const lineEndX = pageWidth - borderMargin; // Ending X-coordinate of the line (in inches)
          pdf.setDrawColor(0, 0, 0); // Line color (black)
          pdf.setLineWidth(0.01); // Line thickness (in inches)
          pdf.line(lineStartX, lineYPosition, lineEndX, lineYPosition); // Draw horizontal line
        }

        pdf.save(filename);
      });
    } else {
      console.error('Content element not found.');
    }
  }

  generatePDFType(filename: any) {

    const element = document.getElementById('contentToConvert');
    this.ngxLoader.stop();
    if (element) {
      const options = {
        margin: [1.4, 1, 1.4, 1], // Margins in inches
        filename: filename || 'document.pdf',
        image: { type: 'JPEG', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: [10, 12], orientation: 'landscape' }
      };

      // Convert HTML to PDF
      html2pdf().set(options).from(element).toPdf().get('pdf').then((pdf: any) => {
        // Example border styling
        const borderThickness = 0.02; // Border thickness in inches
        const borderColor = '#000'; // Border color
        const pageCount = pdf.internal.getNumberOfPages();

        const header = 'BHARAT SANCHAR NIGAM LTD';
        // const pageCount = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {

          pdf.setPage(i);
          pdf.text(header, 4.5, 1); // Position the header text (x, y in inches)
          const options = {
            margin: [1.4, 1, 1.4, 1], // Margins in inches
          };
          // Add the logo image
          const logoWidth = 1; // Logo width in inches
          const logoHeight = 0.5; // Logo height in inches
          pdf.addImage(this.logoBase64, 'PNG', 0.7, 0.7, logoWidth, logoHeight); // Position the logo

          // Draw border around the page
          const borderMargin = 0.5; // Margin from the edge of the page (in inches)
          const pageWidth = 12; // Page width (in inches)
          const pageHeight = 10; // Page height (in inches)
          pdf.setDrawColor(0, 0, 0); // Border color (black)
          pdf.setLineWidth(0.01); // Border thickness (in inches)
          pdf.rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin); // Draw border

          // Draw horizontal line
          const lineYPosition = 1.3; // Y-coordinate for the horizontal line (in inches)
          const lineStartX = borderMargin; // Starting X-coordinate of the line (in inches)
          const lineEndX = pageWidth - borderMargin; // Ending X-coordinate of the line (in inches)
          pdf.setDrawColor(0, 0, 0); // Line color (black)
          pdf.setLineWidth(0.01); // Line thickness (in inches)
          pdf.line(lineStartX, lineYPosition, lineEndX, lineYPosition); // Draw horizontal line
        }

        pdf.save(filename);

      });
    } else {
      console.error('Content element not found.');
    }
  }

}

