import { Component, OnInit } from '@angular/core';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent, PrimeNGConfig, SelectItem, TranslationKeys } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GetOwnOrderListDto, OrderStatus } from './dto/get-own-order.dto';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  ordersSubscription: Subscription = new Subscription();

  orders: GetOwnOrderListDto[] = [];

  matchModeOptions!: SelectItem[];


  totalRecords!: number;

  cols?: any[];

  statuses: any[] = [
    { label: "Novi", value: OrderStatus.NEW},
    { label: "U obradi", value: OrderStatus.PROGRESS},
    { label: "Završen", value: OrderStatus.COMPLETED},

    
  ]

  loading!: boolean;

  constructor(
    private ordersService: OrdersService,
    //private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.loading = true;
    

    //this.primengConfig.setTranslation({addRule: "Dodaj uslov", clear: "Ocisti "});

  }

  loadOrders(event: LazyLoadEvent, filters: FilterMetadata) {
    console.log(filters, "Filteri");
    console.log(event.first, event.rows);

    this.loading = true;

    this.ordersSubscription = this.ordersService.getOwnOrders().subscribe(
      {
        next: (orders) => {
          this.orders = orders;
          this.totalRecords = orders.length;
          console.log(this.totalRecords);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      }
    );
  }
  applyFilterGlobal(event: any) {
    return event.target.value;
  }

}
