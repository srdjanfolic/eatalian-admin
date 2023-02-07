import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-own-order-info',
  templateUrl: './own-order-info.component.html',
  styleUrls: ['./own-order-info.component.scss']
})
export class OwnOrderInfoComponent implements OnInit {

  order?: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ordersService: OrdersService
    ) { }

  ngOnInit(): void {
    let id = this.config.data;
    console.log(id);
    this.ordersService.getOwnOrderById(id).subscribe(
      {
        next: (order) => {
          console.log(order);
          this.order = order;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }
}
