import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityTypesComponent } from './facility-types.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: FacilityTypesComponent }
])],
  exports: [RouterModule]
})
export class FacilityTypesRoutingModule { }
