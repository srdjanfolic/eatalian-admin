import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './demo/components/auth/login/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.authService.autoSignIn();
    }
}
