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
import {DialogModule} from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule} from 'primeng/avatar'
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {KeyFilterModule} from 'primeng/keyfilter';


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
        ReactiveFormsModule,
        ToastModule,
        ToolbarModule,
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
        CommonModule
    ],
    providers: [
        MessageService,
        ConfirmationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
