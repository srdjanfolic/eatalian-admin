import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { CategoriesComponent } from './demo/components/categories/categories.component';
import { FacilitiesComponent } from './demo/components/facilities/facilities.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule} from 'primeng/dialog';
import { CardModule} from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule} from 'primeng/avatar'
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ImageModule} from 'primeng/image';
import {ColorPickerModule} from 'primeng/colorpicker';
import {CalendarModule} from 'primeng/calendar';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RatingModule} from 'primeng/rating';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import {CheckboxModule} from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';

import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './demo/components/auth/login/auth-interceptor.service';
import { FacilityComponent } from './demo/components/facilities/facility.component';
import { ProductsComponent } from './demo/components/products/products.component';
import { OrdersComponent } from './demo/components/orders/orders.component';
import { MyOrdersComponent } from './demo/components/orders/my-orders.component';
import { StatsComponent } from './demo/components/stats/stats.component';
import { MyStatsComponent } from './demo/components/stats/my-stats.component';
import { ChartModule } from 'primeng/chart';
import { FacilityTypesComponent } from './demo/components/facility-types/facility-types.component';



const NG_MODULES=  [
    ToastModule,
    ToolbarModule,
    CardModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    AvatarModule,
    KeyFilterModule,
    ImageModule,
    ColorPickerModule,
    DataViewModule,
    DropdownModule,
    InputSwitchModule,
    RatingModule,
    AutoCompleteModule,
    NgxPhotoEditorModule,
    CalendarModule,
    ChartModule,
    ChipsModule,
    CheckboxModule,
    MessagesModule
    
];

@NgModule({
    declarations: [
        AppComponent,
        CategoriesComponent,
        FacilitiesComponent,
        ProductsComponent,
        FacilityComponent,
        OrdersComponent,
        MyOrdersComponent,
        StatsComponent,
        MyStatsComponent,
        FacilityTypesComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ...NG_MODULES
    ],
    providers: [
        MessageService,
        ConfirmationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
