import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { 
                        label: 'Facilities',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/facilities']
                    },
                    { 
                        label: 'Categories',
                        icon: 'pi pi-fw pi-share-alt',
                        routerLink: ['/categories']
                    },
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/login']
                    },
                ]
            }
        ];
    }
}
