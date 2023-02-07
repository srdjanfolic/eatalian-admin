import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OrderStatus } from '../dto/get-own-order.dto';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {

  order?: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ordersService: OrdersService
    ) { }

  ngOnInit(): void {
    let id = this.config.data;
    console.log(id);
    this.ordersService.getOrderById(id).subscribe(
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
