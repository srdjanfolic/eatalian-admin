import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/login/auth.guard';
import { UserRole } from '../auth/login/user.model';
import { FacilitiesComponent } from './facilities.component';
import { FacilityComponent } from './facility.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'all',
      component: FacilitiesComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.ADMIN],
      },
    },
    {
      path: 'my',
      component: FacilityComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.FACILITY],
      },
    },
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})
export class FacilitiesRoutingModule { }
