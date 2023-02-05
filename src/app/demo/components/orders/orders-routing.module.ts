import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/login/auth.guard';
import { UserRole } from '../auth/login/user.model';
import { MyOrdersComponent } from './my-orders.component';
import { OrdersComponent } from './orders.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'all',
      component: OrdersComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.ADMIN],
      },
    },
    {
      path: 'my',
      component: MyOrdersComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.FACILITY],
      },
    },
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
