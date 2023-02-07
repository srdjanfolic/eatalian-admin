import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { TableModule } from 'primeng/table';
import { OrderInfoComponent } from './order-info/order-info.component';
import { CardModule } from 'primeng/card';
import { OwnOrderInfoComponent } from './own-order-info/own-order-info.component';

@NgModule({
  declarations: [
    OrderInfoComponent,
    OwnOrderInfoComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    TableModule,
    CardModule
  ]
})
export class OrdersModule { }
