import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from './user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {


  private signInSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  authForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });
  authCredentials: AuthCredentialsDto | undefined;
  autoSignIn: any;
  path: any;
  constructor(
    public layoutService: LayoutService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.autoSignIn = this.route.snapshot.paramMap.get('autoSignIn');
    console.log(this.route.snapshot)
  }

  ngOnInit(): void {

    this.userSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          if (user._role === UserRole.ADMIN) {
            this.router.navigate([`/facilities/all`]);
          } else {
            this.router.navigate([`/products`]);
          }
        }

      }
    );
  }

  onSubmit() {
    this.authCredentials = this.authForm.getRawValue();
    this.signInSubscription = this.authService.signIn(this.authCredentials).subscribe((authResponse: AuthResponseDto) => {

      this.userSubscription = this.authService.user.subscribe(
        user => {
          if (user) {
            if (user._role === UserRole.ADMIN) {
              this.router.navigate([`/facilities/all`]);
            } else {
              this.router.navigate([`/products`]);
            }
          }
        }
      );
    },
      error => {

      });

  }

}
