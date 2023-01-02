import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Subject, BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { User } from './user.model';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.apiURL}:${environment.apiPort}/auth`;
  private tokenExpirationTimer: any;
  user = new BehaviorSubject<User | null>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  signIn(authCredentials: AuthCredentialsDto) {
    return this.http.post<AuthResponseDto>(`${this.authUrl}/signin`, authCredentials, httpOptions).pipe(
      tap((res: AuthResponseDto) => {
        localStorage.setItem('token', res.accessToken);
        const tokenPayload = jwtHelper.decodeToken(res.accessToken);
        // tslint:disable-next-line: max-line-length
        console.log(tokenPayload, "PAYLOAD", Math.floor(Date.now() / 1000));
        const user = new User(tokenPayload.username, tokenPayload.name, res.accessToken, tokenPayload.exp, tokenPayload.role);
        this.user.next(user);
        console.log(tokenPayload.exp - tokenPayload.iat, user)
        this.autoSignOut(tokenPayload.exp - tokenPayload.iat);
      }),
      catchError(this.handleError<any>('signIn'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error.error.message, "error"); // log to console instead
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 3000 });
      return of(result as T);
    };
  }
  signOut() {

    localStorage.removeItem('token');
    this.user.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth/login']);
  }

  autoSignIn() {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate([`/auth/login`]);

    } else {
      const tokenPayload = jwtHelper.decodeToken(token);
      console.log("TOKEN PAYLOAD AUTOSIGN IN", tokenPayload);
      // tslint:disable-next-line: max-line-length
      const loadedUser = new User(tokenPayload.username, tokenPayload.name, token, tokenPayload.exp, tokenPayload.role);

      if (loadedUser.token) {
        const expirationDuration = +tokenPayload.exp - (Math.floor(Date.now() / 1000));

        this.autoSignOut(expirationDuration);
        this.user.next(loadedUser);
        this.router.navigate([`/auth/login`, { autoSignIn: 'REFRESH' }]);
      }
    }

  }

  autoSignOut(expirationDuration: number) {
    console.log("EXPIRATION TIMEOUT", expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration * 1000);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || undefined;
    return !jwtHelper.isTokenExpired(token);
  }

}
