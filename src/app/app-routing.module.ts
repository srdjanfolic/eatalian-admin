import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './demo/components/auth/login/auth.guard';
import { UserRole } from './demo/components/auth/login/user.model';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    {
                        path: 'facilities',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.ADMIN, UserRole.FACILITY],
                        },
                        loadChildren: () => import('./demo/components/facilities/facilities.module').then(m => m.FacilitiesModule)
                    },
                    {
                        path: 'facility-types',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.ADMIN],
                        },
                        loadChildren: () => import('./demo/components/facility-types/facility-types.module').then(m => m.FacilityTypesModule)
                    },
                    {
                        path: 'orders',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.ADMIN, UserRole.FACILITY],
                        },
                        loadChildren: () => import('./demo/components/orders/orders.module').then(m => m.OrdersModule)
                    },
                    {
                        path: 'stats',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.ADMIN, UserRole.FACILITY],
                        },
                        loadChildren: () => import('./demo/components/stats/stats.module').then(m => m.StatsModule)
                    },
                    {
                        path: 'categories',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.FACILITY],
                        },
                        loadChildren: () => import('./demo/components/categories/categories.module').then(m => m.CategoriesModule)
                    },
                    {
                        path: 'products',
                        canActivate: [AuthGuard],
                        data: {
                            allowedRoles: [UserRole.FACILITY],
                        },
                        loadChildren: () => import('./demo/components/products/products.module').then(m => m.ProductsModule)
                    },
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
