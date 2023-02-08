import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/login/auth.guard';
import { UserRole } from '../auth/login/user.model';
import { MyStatsComponent } from './my-stats.component';
import { StatsComponent } from './stats.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'all',
      component: StatsComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.ADMIN],
      },
    },
    {
      path: 'my',
      component: MyStatsComponent,
      canActivate: [AuthGuard],
      data: {
        allowedRoles: [UserRole.FACILITY],
      },
    },
    { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
