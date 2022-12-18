import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler ) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        if (req.headers.get("skip"))  {
          return next.handle(req);
        } else {
          const cloneReq = req.clone({
            setHeaders : {
              Authorization: 'Bearer ' + user.token
            }
          });
          return next.handle(cloneReq);
        }
      })
    );
  }
}
