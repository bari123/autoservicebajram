// cookie.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "./environments/environment";

@Injectable()
export class CookieInterceptor implements HttpInterceptor {
  env=environment
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the cookie value from wherever it's stored in your application
    const cookieValue = this.env.COOKIE_VALUE;

    // Clone the request and add the cookie to the headers
    const modifiedRequest = req.clone({
      withCredentials:true,
      headers: req.headers.set('Cookie', `_vercel_jwt=${cookieValue}`)
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}
