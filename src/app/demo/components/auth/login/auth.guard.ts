import {
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const allowedRoles: string[] = route.data['allowedRoles'];

        if (!!user && allowedRoles.indexOf(user._role) !== -1 ) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth/login']);
        }
      })
    );
  }
}
