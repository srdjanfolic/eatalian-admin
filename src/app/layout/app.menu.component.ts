import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../demo/components/auth/login/auth.service';
import { UserRole } from '../demo/components/auth/login/user.model';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.user.subscribe(
            user => {
                if(user?._role == UserRole.ADMIN) {
                    this.model = [
                        {
                            label: 'Home',
                            items: [
                                { 
                                    label: 'Facilities',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/facilities/all']
                                },
                                { 
                                    label: 'Facility Types',
                                    icon: 'pi pi-fw pi-tag',
                                    routerLink: ['/facility-types']
                                },
                            ]
                        },
                        {
                            label: 'Orders',
                            items: [
                                { 
                                    label: 'View orders',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/orders/all']
                                },
                            ]
                        },
                        {
                            label: 'Stats',
                            items: [
                                { 
                                    label: 'Statistike',
                                    icon: 'pi pi-fw pi-chart-line',
                                    routerLink: ['/stats/all']
                                },
                            ]
                        }

                    ];
                } else {
                    this.model = [
                        {
                            label: 'Home',
                            items: [
                                { 
                                    label: 'My facility',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/facilities/my']
                                },
                                { 
                                    label: 'Categories',
                                    icon: 'pi pi-fw pi-sitemap',
                                    routerLink: ['/categories']
                                },
                                { 
                                    label: 'Products',
                                    icon: 'pi pi-fw pi-shopping-cart',
                                    routerLink: ['/products']
                                },
                            ]
                        },
                        {
                            label: 'Orders',
                            items: [
                                { 
                                    label: 'View orders',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/orders/my']
                                },
                            ]
                        },
                        {
                            label: 'Stats',
                            items: [
                                { 
                                    label: 'View stats',
                                    icon: 'pi pi-fw pi-chart-line',
                                    routerLink: ['/stats/my']
                                },
                            ]
                        }
                    ];
                }
            }
        );
       
    }
}
