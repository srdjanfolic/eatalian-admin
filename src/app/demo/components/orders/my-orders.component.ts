import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent, PrimeNGConfig, SelectItem, TranslationKeys } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, Subscription } from 'rxjs';
import { GetOwnOrderFilterDto } from './dto/get-own-order-filter.dto';
import { GetOwnOrderListDto } from './dto/get-own-order-list.dto';
import { GetOwnOrderDto, OrderStatus } from './dto/get-own-order.dto';
import { OrderInfoComponent } from './order-info/order-info.component';
import { OrdersService } from './orders.service';
import { OwnOrderInfoComponent } from './own-order-info/own-order-info.component';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  providers: [DialogService]
})
export class MyOrdersComponent implements OnInit, OnDestroy {

  ordersSubscription: Subscription = new Subscription();

  orders: GetOwnOrderDto[] = [];
  selectedOrder?: GetOwnOrderDto;

  dateMatchModeOptions!: SelectItem[];
  totalPriceMatchModeOptions!: SelectItem[];
  statusMatchModeOptions!: SelectItem[];


  totalRecords!: number;
  ordersTotal!: number;

  cols?: any[];

  statuses: any[] = [
    { label: "Novi", value: OrderStatus.NEW},
    { label: "U obradi", value: OrderStatus.PROGRESS},
    { label: "Završen", value: OrderStatus.COMPLETED},

    
  ]

  loading!: boolean;

  constructor(
    private ordersService: OrdersService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    

    this.dateMatchModeOptions = [
      { label: "Danas", value: "today" },
      { label: "Juče", value: "yesterday" },
      { label: "Zadnjih 7 dana", value: "7days" },
      { label: "Zadnjih 15 dana", value: "15days" },
      { label: "Zadnjih 30 dana", value: "30days" },
      { label: "Nakon", value: FilterMatchMode.DATE_AFTER },
      { label: "Prije", value: FilterMatchMode.DATE_BEFORE },
  
    ];

    this.totalPriceMatchModeOptions = [
      { label: "Jednako", value: FilterMatchMode.EQUALS },
      { label: "Veće od", value: FilterMatchMode.GREATER_THAN },
      { label: "Manje od", value: FilterMatchMode.LESS_THAN },
  
    ];

    this.statusMatchModeOptions = [
      { label: "Jednako", value: FilterMatchMode.EQUALS },
    ];
  }

  loadOrders(event: LazyLoadEvent, filters: FilterMetadata) {
    console.log(filters, "Filteri");
    console.log(event.first, event.rows);

    this.loading = true;

    let getOwnOrderFilterDto = new GetOwnOrderFilterDto(event.first, event.rows, filters);

    this.ordersSubscription = this.ordersService.getOwnOrders(getOwnOrderFilterDto).subscribe(
      {
        next: (ordersList: GetOwnOrderListDto) => {
          this.orders = ordersList.orders;
          this.totalRecords = ordersList.ordersCount;
          this.ordersTotal = ordersList.ordersTotal
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

  selectOrder(order: GetOwnOrderDto) {
    console.log(order._id);
    const ref = this.dialogService.open(OwnOrderInfoComponent, {
      header: order.facility?.name,
      data: order._id,
      contentStyle: { "max-height": 'calc(100vh - 32px)', "overflow": "auto", "width": 'calc(100vw - 16px)', "max-width": '800px' },
      baseZIndex: 10000
    });

  }
  ngOnDestroy(): void {
    if(this.ordersSubscription)
      this.ordersSubscription.unsubscribe();
  }
}
