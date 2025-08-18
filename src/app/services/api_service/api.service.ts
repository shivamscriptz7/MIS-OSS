import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseURL: string = '';
  
  constructor(private http:HttpClient) { }

  getData(url:any){
  return this.http.get(url);
  }

  /**
   * Post API method
   * @param url
   * @param data
   * @Developer Rahul Kumar
   */

  public getAPIMethod(url: any): Observable<any> {
    url = this.baseURL + url;
    return this.http.get<any>(url).pipe(
      map((res: any) => { return res; }), catchError(<T>(error: any, result?: T) => {
        const dataObj = {
          result: result,
          error: error
        }
        return of(dataObj);
      }));
  }


  
}
