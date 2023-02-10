import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent, PrimeNGConfig, SelectItem, TranslationKeys } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, Subscription } from 'rxjs';
import { PredefinedInterval } from '../stats/dto/predefined-interval.enum';
import { GetOwnOrderFilterDto } from './dto/get-own-order-filter.dto';
import { GetOwnOrderListDto } from './dto/get-own-order-list.dto';
import { GetOwnOrderDto, OrderStatus } from './dto/get-own-order.dto';
import { OrderInfoComponent } from './order-info/order-info.component';
import { OrdersService } from './orders.service';
import { OwnOrderInfoComponent } from './own-order-info/own-order-info.component';
import * as FileSaver from 'file-saver';

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
    { label: "Novi", value: OrderStatus.NEW },
    { label: "U obradi", value: OrderStatus.PROGRESS },
    { label: "Završen", value: OrderStatus.COMPLETED },


  ]

  loading!: boolean;

  constructor(
    private ordersService: OrdersService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.loading = true;


    this.dateMatchModeOptions = [
      { label: "Danas", value: PredefinedInterval.TODAY },
      { label: "Juče", value: PredefinedInterval.YESTERDAY },
      { label: "Zadnjih 7 dana", value: PredefinedInterval.DAYS7 },
      { label: "Zadnjih 15 dana", value: PredefinedInterval.DAYS15 },
      { label: "Zadnjih 30 dana", value: PredefinedInterval.DAYS30 },
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

  exportExcel(filters: FilterMetadata) {

    let getOwnOrderFilterDto = new GetOwnOrderFilterDto(undefined, undefined, filters);

    this.ordersSubscription = this.ordersService.getOwnOrdersExcel(getOwnOrderFilterDto).subscribe(
      {
        next: (data: any) => {
          console.log(data);
          import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "data");
          });

        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      }
    );


  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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
    if (this.ordersSubscription)
      this.ordersSubscription.unsubscribe();
  }
}
