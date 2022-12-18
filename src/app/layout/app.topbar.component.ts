import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../demo/components/auth/login/auth.service';

import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    private userSubscription!: Subscription;
    name: string | undefined;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {

        this.userSubscription = this.authService.user.subscribe(
            user => {
                this.name = user?.name;
                this.items = [
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-power-off',
                        command: () => this.logOut()
                    }
                ]
            });
    }

    logOut() {
        this.authService.signOut();
    }
}
