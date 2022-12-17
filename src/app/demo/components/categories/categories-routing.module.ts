import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: CategoriesComponent }
])],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
