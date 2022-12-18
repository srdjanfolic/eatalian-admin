import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwtHelper = new JwtHelperService();

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const allowedRoles: string[] = route.data['allowedRoles'];
    const token = localStorage.getItem('token') || "";

    // decode the token to get its payload
    const tokenPayload = jwtHelper.decodeToken(token);

    if (
      tokenPayload && (!this.auth.isAuthenticated() ||
      allowedRoles.indexOf(tokenPayload._role) === -1)
    ) {
      this.router.navigate(['/uath/login']);
      return false;
    }
    return true;
  }
}
