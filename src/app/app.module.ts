import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { CategoriesComponent } from './demo/components/categories/categories.component';
import { FacilitiesComponent } from './demo/components/facilities/facilities.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        CategoriesComponent,
        FacilitiesComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
