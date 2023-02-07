import { Component, OnInit } from '@angular/core';
import { SelectItem, FilterMatchMode, LazyLoadEvent, FilterMetadata } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GetFacilityListDto } from '../facilities/dto/get-facility-list.dto';
import { FacilitiesService } from '../facilities/facilities.service';
import { GetOwnOrderFilterDto } from './dto/get-own-order-filter.dto';
import { GetOwnOrderListDto } from './dto/get-own-order-list.dto';
import { GetOwnOrderDto, OrderStatus } from './dto/get-own-order.dto';
import { OrdersService } from './orders.service';
import { DialogService, } from 'primeng/dynamicdialog';
import { OrderInfoComponent } from './order-info/order-info.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DialogService]
})
export class OrdersComponent implements OnInit {

  ordersSubscription: Subscription = new Subscription();
  faciltiesSubscription: Subscription = new Subscription();

  orders: GetOwnOrderDto[] = [];
  selectedOrder?: GetOwnOrderDto;

  facilities: GetFacilityListDto[] = [];

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
    private facilitiesService: FacilitiesService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {

    this.faciltiesSubscription = this.facilitiesService.getFacilitiesList().subscribe(
      {
        next: (facilities) => {
          this.facilities = facilities;
          console.log(facilities);
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
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

    this.ordersSubscription = this.ordersService.getOrders(getOwnOrderFilterDto).subscribe(
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
    const ref = this.dialogService.open(OrderInfoComponent, {
      header: order.facility?.name,
      data: order._id,
      contentStyle: { "max-height": 'calc(100vh - 32px)', "overflow": "auto", "width": 'calc(100vw - 16px)', "max-width": '800px' },
      baseZIndex: 10000
    });

  }

  ngOnDestroy(): void {
    if(this.ordersSubscription)
      this.ordersSubscription.unsubscribe();
    if(this.faciltiesSubscription)
      this.faciltiesSubscription.unsubscribe();
  }

}
