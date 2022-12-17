import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacilitiesComponent } from './facilities.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: FacilitiesComponent }
  ])],
  exports: [RouterModule]
})
export class FacilitiesRoutingModule { }
