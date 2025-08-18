import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        permission: `${localStorage.getItem('permission')}`,
        // userData:`${localStorage.getItem('userData')}`
        'Allow': 'POST, OPTIONS',
        'Cache-Control': 'no-cache, no-store, max-age=0, s-maxage=0',
        'X-Content-Type-Options': 'application/json,application/text',
        'Referrer-Policy': 'same-origin',
        'Strict-Transport-Security': 'max-age=63072000; includeSubdomains',
        'X-Xss-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self'",
        'X-Frame-Options': 'DENY'
      }
    });
    return next.handle(request).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
